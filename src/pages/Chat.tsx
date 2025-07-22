import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, AlertCircle, Clock, Crown } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou sua assistente nutricional especializada em pessoas com mais de 50 anos. Como posso ajudá-lo(a) hoje? 😊\n\nPosso te ajudar com:\n• Planos alimentares personalizados\n• Receitas saudáveis\n• Dicas de nutrição\n• Exercícios adequados\n• Acompanhamento do seu progresso',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [trialStatus, setTrialStatus] = useState<{
    trial_expired: boolean;
    days_remaining: number;
    subscription_active: boolean;
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    checkTrialStatus()
  }, [])

  const checkTrialStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data, error } = await supabase.functions.invoke('check-trial')
        if (data && !error) {
          setTrialStatus(data)
          if (data.trial_expired && !data.subscription_active) {
            toast.error("Seu período de teste expirou! Faça uma assinatura para continuar.")
            setTimeout(() => navigate('/assinatura'), 2000)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar trial:', error)
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { message: userMessage }
      })

      if (error) {
        console.error('Erro no Edge Function:', error)
        return "Desculpe, houve um erro ao processar sua pergunta. Tente novamente."
      }

      return data?.response || "Desculpe, não consegui processar sua pergunta. Tente novamente."
    } catch (error) {
      console.error('Erro ao gerar resposta:', error)
      return "Desculpe, houve um erro ao processar sua pergunta. Verifique sua conexão e tente novamente."
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    // Check trial status before sending message
    if (trialStatus?.trial_expired && !trialStatus?.subscription_active) {
      toast.error("Seu período de teste expirou! Assine um plano para continuar.")
      navigate('/assinatura')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      const aiResponseContent = await generateAIResponse(newMessage)
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setNewMessage(suggestion)
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Trial Status */}
      {trialStatus && !trialStatus.subscription_active && (
        <Card className={`p-4 mb-4 ${trialStatus.trial_expired ? 'bg-destructive/10 border-destructive' : 'bg-warning/10 border-warning'}`}>
          <div className="flex items-center gap-3">
            {trialStatus.trial_expired ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Clock className="h-5 w-5 text-warning" />
            )}
            <div className="flex-1">
              {trialStatus.trial_expired ? (
                <p className="font-semibold text-destructive">Período de teste expirado</p>
              ) : (
                <p className="font-semibold">Período de teste: {trialStatus.days_remaining} dias restantes</p>
              )}
            </div>
            <Button 
              onClick={() => navigate('/assinatura')} 
              size="sm"
              className="gradient-primary text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Assinar Agora
            </Button>
          </div>
        </Card>
      )}

      {/* Chat Header */}
      <Card className="p-4 mb-4 gradient-primary text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Assistente 24/24</h2>
            <p className="text-sm opacity-90">Online • Sempre disponível</p>
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-senior whitespace-pre-line">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] flex gap-3">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border pt-4">
          <div className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre nutrição..."
              className="flex-1 text-lg py-3 px-4 rounded-xl"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="btn-senior px-6 gradient-primary text-white"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "Como acelerar o metabolismo após os 50?",
          "Receitas saudáveis para o jantar",
          "Dicas para beber mais água",
          "Exercícios adequados para minha idade",
          "Como controlar a diabetes com alimentação?",
          "Alimentos que ajudam na pressão alta"
        ].map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleQuickSuggestion(suggestion)}
            className="text-sm hover:bg-primary/10 hover:text-primary hover:border-primary"
            disabled={isLoading}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}