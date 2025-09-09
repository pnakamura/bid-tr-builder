import { FileText, Building2, User, Settings, Bell, Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const isCreatePage = location.pathname === "/create";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">TR Manager</h1>
              <p className="text-sm text-muted-foreground">Termos de Referência - BID</p>
            </div>
          </Link>

          {/* Search Bar - Only on larger screens */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar TRs, templates, documentos..."
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Auto-save indicator for create page */}
          {isCreatePage && (
            <div className="hidden lg:block">
              <AutoSaveIndicator />
            </div>
          )}
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Institution info - Hidden on small screens */}
            <div className="hidden xl:flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              <Building2 className="h-4 w-4" />
              <span>Banco Interamericano de Desenvolvimento</span>
            </div>

            {/* Action buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Drawer - Conditionally rendered */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed right-0 top-0 h-full w-64 bg-card border-l shadow-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};