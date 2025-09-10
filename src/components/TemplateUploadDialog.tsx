import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTemplate, useUploadTemplate } from '@/hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';

const templateSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  is_public: z.boolean().default(false)
});

type TemplateFormData = z.infer<typeof templateSchema>;

const categories = [
  'Infraestrutura',
  'Tecnologia',
  'Consultoria',
  'Obras',
  'Serviços',
  'Aquisições'
];

const types = [
  'Básico',
  'Intermediário',
  'Avançado',
  'Especializado'
];

interface TemplateUploadDialogProps {
  children: React.ReactNode;
}

export function TemplateUploadDialog({ children }: TemplateUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      is_public: false
    }
  });

  const createTemplate = useCreateTemplate();
  const uploadTemplate = useUploadTemplate();

  const onSubmit = async (data: TemplateFormData) => {
    if (!selectedFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Selecione um arquivo para fazer upload.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create template record
      const template = await createTemplate.mutateAsync({
        ...data,
        metadata: {
          originalFileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type
        }
      });

      // Upload file
      await uploadTemplate.mutateAsync({
        file: selectedFile,
        templateId: template.id
      });

      // Reset form and close dialog
      reset();
      setSelectedFile(null);
      setOpen(false);

      toast({
        title: "Upload concluído",
        description: "Template enviado com sucesso!"
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.oasis.opendocument.text'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Apenas PDF, DOC, DOCX, TXT e ODT são permitidos.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const isLoading = createTemplate.isPending || uploadTemplate.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Template</DialogTitle>
          <DialogDescription>
            Faça upload de um novo template de Termo de Referência
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Nome do template"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descrição detalhada do template"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="file-upload">Arquivo *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.odt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {selectedFile ? (
                    <>
                      <FileText className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm">Clique para selecionar um arquivo</span>
                      <span className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, TXT ou ODT (máx. 10MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={watch('is_public')}
                onCheckedChange={(checked) => setValue('is_public', checked)}
              />
              <Label htmlFor="is_public">Template público</Label>
              <span className="text-xs text-muted-foreground ml-2">
                (Outros usuários poderão ver e usar este template)
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
                setSelectedFile(null);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}