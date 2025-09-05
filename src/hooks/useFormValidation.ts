import { useState, useCallback, useMemo } from "react";
import { z } from "zod";

interface ValidationError {
  field: string;
  message: string;
}

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  data: Record<string, any>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
}

export const useFormValidation = <T>({ 
  schema, 
  data, 
  mode = 'onChange' 
}: UseFormValidationProps<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((fieldName?: string) => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      if (fieldName) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      } else {
        setErrors({});
      }
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.issues.forEach(error => {
      const field = error.path[0] as string;
      if (!fieldName || field === fieldName) {
        newErrors[field] = error.message;
      }
    });

    if (fieldName) {
      setErrors(prev => ({ ...prev, [fieldName]: newErrors[fieldName] || '' }));
    } else {
      setErrors(newErrors);
    }

    return false;
  }, [schema, data]);

  const validateField = useCallback((fieldName: string, value: any) => {
    try {
      const fieldSchema = (schema as any).shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.issues[0]?.message || 'Valor inválido'
        }));
      }
      return false;
    }
    return true;
  }, [schema]);

  const markFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  }, [errors, touched]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    errors,
    touched,
    validate,
    validateField,
    markFieldTouched,
    getFieldError,
    isValid,
    hasErrors,
    clearErrors: () => setErrors({}),
    clearTouched: () => setTouched({})
  };
};