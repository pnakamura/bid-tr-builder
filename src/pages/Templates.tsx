import { useState } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, FileText, Plus, Download, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

const templateData = [
  {
    id: 1,
    title: "TR Consultoria Individual - Padrão BID",
    description: "Template para contratação de consultoria individual conforme diretrizes BID",
    category: "Consultoria",
    type: "Individual",
    lastUpdated: "15/01/2024",
    downloads: 45,
    rating: 4.8,
    popular: true
  },
  {
    id: 2,
    title: "TR Obras - Infraestrutura Básica",
    description: "Template para contratação de obras de infraestrutura com especificações técnicas",
    category: "Obras",
    type: "Infraestrutura",
    lastUpdated: "12/01/2024",
    downloads: 32,
    rating: 4.6,
    popular: false
  },
  {
    id: 3,
    title: "TR Equipamentos - Laboratório",
    description: "Template para aquisição de equipamentos de laboratório com especificações técnicas",
    category: "Equipamentos",
    type: "Científico",
    lastUpdated: "10/01/2024",
    downloads: 28,
    rating: 4.7,
    popular: true
  },
  {
    id: 4,
    title: "TR Consultoria Empresa - Sistema de Gestão",
    description: "Template para contratação de empresa de consultoria para implementação de sistemas",
    category: "Consultoria",
    type: "Empresa",
    lastUpdated: "08/01/2024",
    downloads: 38,
    rating: 4.9,
    popular: true
  }
];

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredTemplates = templateData.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesType = selectedType === "all" || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="animate-fade-in">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-8 border shadow-sm">
            <div className="max-w-4xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Templates de Termos de Referência
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Biblioteca de templates pré-configurados para diferentes tipos de contratação, 
                    seguindo as diretrizes do BID e melhores práticas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Templates
              </CardTitle>
              <CardDescription>Encontre o template ideal para seu projeto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por título ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                    <SelectItem value="Obras">Obras</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Científico">Científico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-all duration-300 hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        {template.title}
                        {template.popular && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant="secondary">{template.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Atualizado: {template.lastUpdated}</span>
                    <span>{template.downloads} downloads</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/create?template=${template.id}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Usar Template
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca para encontrar templates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Templates;