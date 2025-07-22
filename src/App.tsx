import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ReceitaCompleta from "./pages/ReceitaCompleta";
import MeuPlano from "./pages/MeuPlano";
import MealPlan from "./components/MealPlan";
import Perfil from "./pages/Perfil";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Assinatura from "./pages/Assinatura";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/assinatura" element={<Assinatura />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/meu-plano" element={<Layout><MeuPlano /></Layout>} />
          <Route path="/receita-completa" element={<Layout><ReceitaCompleta /></Layout>} />
          <Route path="/plano-refeicoes" element={<Layout><MealPlan /></Layout>} />
          <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
          <Route path="/configuracoes" element={<Layout><div className="p-6"><h1 className="text-2xl">Configurações em desenvolvimento</h1></div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
