import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  title: string;
  type: 'tr' | 'template';
  description?: string;
  url: string;
  category?: string;
}

export const useGlobalSearch = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return [];
      }

      const searchTerm = `%${debouncedQuery.toLowerCase()}%`;
      const searchResults: SearchResult[] = [];

      // Search TRs
      const { data: trs } = await supabase
        .from('termos_referencia')
        .select('id, title, description, type')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      if (trs) {
        searchResults.push(
          ...trs.map(tr => ({
            id: tr.id,
            title: tr.title,
            type: 'tr' as const,
            description: tr.description?.substring(0, 100) + '...',
            url: `/meus-trs`,
            category: tr.type,
          }))
        );
      }

      // Search Templates
      const { data: templates } = await supabase
        .from('templates')
        .select('id, title, description, category')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      if (templates) {
        searchResults.push(
          ...templates.map(template => ({
            id: template.id,
            title: template.title,
            type: 'template' as const,
            description: template.description?.substring(0, 100) + '...',
            url: `/templates`,
            category: template.category,
          }))
        );
      }

      return searchResults;
    },
    enabled: debouncedQuery.length >= 2,
  });

  return {
    results: results || [],
    isLoading,
    hasQuery: debouncedQuery.length >= 2,
  };
};
