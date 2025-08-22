import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const DrInteligente = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const quickSuggestions = [
    "Como emagrecer com segurança aos 50+?",
    "Sugira um jantar leve para hoje",
    "Como instalar o aplicativo?",
    "Quais exercícios são seguros na minha idade?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      content: "",
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();
      
      const { data, error } = await supabase.functions.invoke('dr-inteligente', {
        body: { 
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) throw error;

      if (data?.response) {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: data.response }
            : msg
        ));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        toast.error("Erro ao conversar com Dr. Inteligente");
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: "Desculpe, ocorreu um erro. Tente novamente." }
            : msg
        ));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast.success("Conversa limpa!");
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. Inteligente</h1>
              <p className="text-muted-foreground">Seu assistente especializado em emagrecimento saudável</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearConversation}
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Chat
          </Button>
        </div>

        {/* Messages */}
        <Card className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Olá! Sou o Dr. Inteligente</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Estou aqui para ajudar com questões sobre emagrecimento saudável após os 50 anos e sobre nosso aplicativo.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-sm h-auto p-3 text-left whitespace-normal"
                      onClick={() => sendMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.content === "" && message.role === 'assistant' && isLoading && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            {isLoading && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dr. Inteligente está digitando...</span>
                <Button variant="outline" size="sm" onClick={stopGeneration}>
                  Parar
                </Button>
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta sobre emagrecimento ou sobre o app..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DrInteligente;