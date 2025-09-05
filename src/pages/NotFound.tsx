import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileText, Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* 404 Icon and Title */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Página não encontrada</h1>
            <p className="text-lg text-muted-foreground">
              A página que você está procurando não existe ou foi removida.
            </p>
          </div>

          {/* Suggestions Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                O que você gostaria de fazer?
              </CardTitle>
              <CardDescription>
                Sugestões para ajudá-lo a encontrar o que procura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild variant="outline" className="h-auto p-4 justify-start">
                  <Link to="/">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Ir para Dashboard</div>
                        <div className="text-sm text-muted-foreground">Ver todos os TRs</div>
                      </div>
                    </div>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4 justify-start">
                  <Link to="/create">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Criar novo TR</div>
                        <div className="text-sm text-muted-foreground">Iniciar um documento</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button variant="ghost" className="text-muted-foreground">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Precisa de ajuda? Entre em contato com suporte
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Button asChild variant="ghost">
            <button onClick={() => window.history.back()} className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à página anterior
            </button>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
