import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, AlertCircle, Clock, Crown, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSubscription } from '@/hooks/useSubscription';
import { PlanRestrictionBanner } from '@/components/PlanRestrictionBanner';
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
export default function Chat() {
  const navigate = useNavigate();
  const {
    hasAccess,
    subscription_tier
  } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: 'Olá! Sou sua assistente nutricional especializada em pessoas com mais de 50 anos. Como posso ajudá-lo(a) hoje? 😊\n\nPosso te ajudar com:\n• Planos alimentares personalizados\n• Receitas saudáveis\n• Dicas de nutrição\n• Exercícios adequados\n• Acompanhamento do seu progresso',
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{
    trial_expired: boolean;
    days_remaining: number;
    subscription_active: boolean;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    checkTrialStatus();
  }, []);
  const checkTrialStatus = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        const {
          data,
          error
        } = await supabase.functions.invoke('check-trial');
        if (data && !error) {
          setTrialStatus(data);
          if (data.trial_expired && !data.subscription_active) {
            toast.error("Seu período de teste expirou! Faça uma assinatura para continuar.");
            setTimeout(() => navigate('/assinatura'), 2000);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar trial:', error);
    }
  };
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage
        }
      });
      if (error) {
        console.error('Erro no Edge Function:', error);
        return "Desculpe, houve um erro ao processar sua pergunta. Tente novamente.";
      }
      return data?.response || "Desculpe, não consegui processar sua pergunta. Tente novamente.";
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return "Desculpe, houve um erro ao processar sua pergunta. Verifique sua conexão e tente novamente.";
    }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Check trial status before sending message
    if (trialStatus?.trial_expired && !trialStatus?.subscription_active) {
      toast.error("Seu período de teste expirou! Assine um plano para continuar.");
      navigate('/assinatura');
      return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    try {
      const aiResponseContent = await generateAIResponse(newMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleQuickSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };
  if (!hasAccess('chat')) {
    return <div className="container mx-auto p-6 max-w-4xl">
        <PlanRestrictionBanner currentPlan={subscription_tier} requiredPlan="Elite" featureName="Chat com IA" />
        <Card className="h-[600px] flex flex-col opacity-50">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Chat Premium</h3>
              <p className="text-muted-foreground">Faça upgrade para acessar conversas ilimitadas com nossa IA</p>
            </div>
          </div>
        </Card>
      </div>;
  }
  return <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Trial Status */}
      {trialStatus && !trialStatus.subscription_active && <Card className={`p-4 mb-4 ${trialStatus.trial_expired ? 'bg-destructive/10 border-destructive' : 'bg-warning/10 border-warning'}`}>
          <div className="flex items-center gap-3">
            {trialStatus.trial_expired ? <AlertCircle className="h-5 w-5 text-destructive" /> : <Clock className="h-5 w-5 text-warning" />}
            <div className="flex-1">
              {trialStatus.trial_expired ? <p className="font-semibold text-destructive">Período de teste expirado</p> : <p className="font-semibold">Período de teste: {trialStatus.days_remaining} dias restantes</p>}
            </div>
            <Button onClick={() => navigate('/assinatura')} size="sm" className="gradient-primary text-white">
              <Crown className="h-4 w-4 mr-2" />
              Assinar Agora
            </Button>
          </div>
        </Card>}

      {/* Chat Header */}
      <Card className="p-4 mb-4 gradient-primary text-white bg-gray-900 rounded-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 bg-slate-950" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Assistente 24/24</h2>
            <p className="text-sm opacity-90 text-slate-950">Online • Sempre disponível</p>
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      

      {/* Quick Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Como acelerar o metabolismo após os 50?", "Receitas saudáveis para o jantar", "Dicas para beber mais água", "Exercícios adequados para minha idade", "Como controlar a diabetes com alimentação?", "Alimentos que ajudam na pressão alta"].map((suggestion, index) => <Button key={index} variant="outline" size="sm" onClick={() => handleQuickSuggestion(suggestion)} className="text-sm hover:bg-primary/10 hover:text-primary hover:border-primary" disabled={isLoading}>
            {suggestion}
          </Button>)}
      </div>
    </div>;
}