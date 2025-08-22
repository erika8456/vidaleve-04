import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { ThemeToggle } from "@/components/ThemeToggle"
import { BrandLogo } from "@/components/BrandLogo"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-10 w-10" />
              <div className="hidden md:flex items-center gap-3">
                <BrandLogo size="sm" />
                <h1 className="text-xl font-semibold text-foreground">
                  Vida Leve
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificationDropdown />
              <BrandLogo size="sm" className="rounded-full" />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}