import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ajuste o import conforme seu projeto

const ThanksPage = () => {
  // Configuração do WhatsApp
  const phoneNumber = "5531982920060"; // COLOQUE SEU NÚMERO AQUI (com DDD)
  const message = encodeURIComponent("Olá! Fiz a compra agora e gostaria de solicitar minha chave de acesso.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Ícone de Sucesso */}
      <div className="mb-6 animate-bounce">
        <CheckCircle2 className="w-20 h-20 text-[#22c55e]" />
      </div>

      {/* Título Principal */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
        Parabéns pela <span className="text-[#22c55e]">sua compra!</span>
      </h1>

      {/* Descrição */}
      <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
        Sua jornada para a CNH começou! Agora, só falta um passo para liberar seu acesso exclusivo.
      </p>

      {/* Card de Ação */}
      <div className="glass-card p-8 rounded-2xl border border-white/10 bg-white/5 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-6">Receber Chave de Acesso</h2>
        
        <Button 
          onClick={() => window.location.href = whatsappUrl}
          className="w-full h-16 text-lg font-bold bg-[#22c55e] hover:bg-[#16a34a] text-black gap-3 glow-green transition-all hover:scale-[1.02]"
        >
          <MessageCircle className="w-6 h-6" />
          Chamar no WhatsApp
          <ArrowRight className="w-5 h-5" />
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Ao clicar, você será redirecionado para o nosso suporte oficial.
        </p>
      </div>

      {/* Link de Ajuda */}
      <p className="mt-10 text-sm text-muted-foreground">
        Dúvidas? Entre em contato: <span className="text-white">moraisouza2304Gmail.com</span>
      </p>
    </div>
  );
};

export default ThanksPage;