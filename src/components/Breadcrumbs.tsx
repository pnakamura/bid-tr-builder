import { useLocation, Link } from "react-router-dom";
import { Home, FileText, Plus, BarChart3 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeMap = {
  "/": { label: "Dashboard", icon: Home },
  "/create": { label: "Criar TR", icon: Plus },
  "/templates": { label: "Templates", icon: FileText },
  "/reports": { label: "Relatórios", icon: BarChart3 },
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ path: "/", label: "Dashboard", icon: Home }];

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap[currentPath as keyof typeof routeMap];
      if (route) {
        breadcrumbs.push({
          path: currentPath,
          label: route.label,
          icon: route.icon,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const Icon = crumb.icon;
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div key={crumb.path} className="flex items-center">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        asChild
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Link to={crumb.path}>
                          <Icon className="h-4 w-4" />
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};