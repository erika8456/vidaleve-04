import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, BookOpen, User, Settings, Menu, X, LogOut, Trophy, Smartphone, Stethoscope } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
const menuItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: Home
}, {
  title: "Meu Plano",
  url: "/meu-plano",
  icon: BookOpen
}, {
  title: "Exercícios",
  url: "/exercicios",
  icon: Trophy
}, {
  title: "Dr. Inteligente",
  url: "/dr-inteligente",
  icon: Stethoscope
}, {
  title: "Baixar App",
  url: "/baixar-app",
  icon: Smartphone
}, {
  title: "Perfil",
  url: "/perfil",
  icon: User
}, {
  title: "Configurações",
  url: "/configuracoes",
  icon: Settings
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const handleLogout = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        return;
      }
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };
  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-foreground hover:bg-accent hover:text-accent-foreground";
  return <Sidebar className={state === "collapsed" ? "w-16" : "w-72"} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          {state !== "collapsed" && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">Vida Leve</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      {state !== "collapsed" && <span className="text-lg font-medium text-slate-100">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-6 w-6 flex-shrink-0" />
            {state !== "collapsed" && <span className="text-lg font-medium ml-3">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>;
}