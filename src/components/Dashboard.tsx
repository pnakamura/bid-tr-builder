import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Building, Users, Settings, Clock, CheckCircle, AlertCircle } from "lucide-react";

const contractTypes = [
  {
    id: "obras",
    title: "Obras e Serviços de Engenharia", 
    description: "Construção, reformas, instalações e serviços de engenharia",
    icon: Building,
    color: "bg-blue-500",
    count: 12
  },
  {
    id: "consultoria", 
    title: "Consultorias e Serviços Técnicos",
    description: "Estudos, projetos, assessorias e consultorias especializadas",
    icon: Users,
    color: "bg-green-500", 
    count: 8
  },
  {
    id: "equipamentos",
    title: "Equipamentos e Materiais",
    description: "Aquisição de equipamentos, materiais e sistemas",
    icon: Settings,
    color: "bg-purple-500",
    count: 5
  }
];

const recentTRs = [
  { id: 1, title: "Consultoria para Sistema de Gestão", type: "Consultoria", status: "draft", date: "2024-01-15" },
  { id: 2, title: "Obras de Pavimentação Urbana", type: "Obras", status: "review", date: "2024-01-14" },
  { id: 3, title: "Equipamentos de Laboratório", type: "Equipamentos", status: "approved", date: "2024-01-12" },
  { id: 4, title: "Consultoria em TI", type: "Consultoria", status: "draft", date: "2024-01-10" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'review': return <AlertCircle className="h-4 w-4 text-accent" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return 'Aprovado';
    case 'review': return 'Em Análise';
    default: return 'Rascunho';
  }
};

export const Dashboard = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contractTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => setSelectedType(type.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${type.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">{type.count} TRs</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
                <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo TR
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent TRs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Termos de Referência Recentes
              </CardTitle>
              <CardDescription>
                Últimos documentos criados e editados
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo TR
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTRs.map((tr) => (
              <div key={tr.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(tr.status)}
                    <div>
                      <h4 className="font-medium text-foreground">{tr.title}</h4>
                      <p className="text-sm text-muted-foreground">{tr.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{getStatusText(tr.status)}</Badge>
                  <span className="text-sm text-muted-foreground">{tr.date}</span>
                  <Button variant="ghost" size="sm">Abrir</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};