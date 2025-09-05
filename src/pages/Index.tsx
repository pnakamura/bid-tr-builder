import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="animate-fade-in">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;