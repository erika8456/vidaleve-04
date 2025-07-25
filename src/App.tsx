import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ReceitaCompleta from "./pages/ReceitaCompleta";
import MeuPlano from "./pages/MeuPlano";
import MealPlan from "./components/MealPlan";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Assinatura from "./pages/Assinatura";
import ImageBank from "./pages/ImageBank";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/cadastro" element={
              <PublicRoute>
                <Cadastro />
              </PublicRoute>
            } />
            <Route path="/assinatura" element={<Assinatura />} />
            <Route path="/banco-imagens" element={
              <ProtectedRoute>
                <Layout><ImageBank /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Layout><Chat /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/meu-plano" element={
              <ProtectedRoute>
                <Layout><MeuPlano /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/receita-completa" element={
              <ProtectedRoute>
                <Layout><ReceitaCompleta /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/plano-refeicoes" element={
              <ProtectedRoute>
                <Layout><MealPlan /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Layout><Perfil /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Layout><Configuracoes /></Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
