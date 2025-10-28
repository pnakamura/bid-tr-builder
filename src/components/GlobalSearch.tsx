import { useState, useRef, useEffect } from "react";
import { Search, FileText, File, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { results, isLoading, hasQuery } = useGlobalSearch(query);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    navigate(url);
    setQuery("");
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    return type === 'tr' ? FileText : File;
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar TRs, templates..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && hasQuery && (
        <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left flex items-start gap-3"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg mt-1 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate flex-1">
                          {result.title}
                        </h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {result.type === 'tr' ? 'TR' : 'Template'}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                          {result.description}
                        </p>
                      )}
                      {result.category && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {result.category}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
