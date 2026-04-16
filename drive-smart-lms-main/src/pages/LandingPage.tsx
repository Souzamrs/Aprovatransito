import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, CheckCircle2, BookOpen, FileQuestion, Star, ArrowRight, Zap, Award, Clock, Users,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: "7 Módulos Completos", desc: "Conteúdo que cobre 100% da prova teórica do DETRAN" },
    { icon: FileQuestion, title: "40+ Provas Simuladas", desc: "Provinhas completas no estilo da prova real do DETRAN" },
    { icon: Zap, title: "Simulados por Módulo", desc: "Teste seu conhecimento e veja seu desempenho em tempo real" },
    { icon: Award, title: "Certificado de Conclusão", desc: "Comprove que você está pronto para a prova" },
    { icon: Clock, title: "Estude no Seu Ritmo", desc: "Acesso ilimitado, sem prazo para terminar" },
    { icon: Shield, title: "Conteúdo Atualizado", desc: "Baseado no CTB e nas normas mais recentes do CONTRAN" },
  ];

  const modules = [
    { icon: "⚖️", name: "Legislação de Trânsito", lessons: 10 },
    { icon: "🛡️", name: "Direção Defensiva", lessons: 10 },
    { icon: "🪧", name: "Sinalização de Trânsito", lessons: 10 },
    { icon: "🚨", name: "Infrações e Penalidades", lessons: 10 },
    { icon: "🌿", name: "Meio Ambiente e Cidadania", lessons: 10 },
    { icon: "🚑", name: "Primeiros Socorros", lessons: 10 },
    { icon: "🔧", name: "Mecânica e Manutenção", lessons: 10 },
  ];

  const testimonials = [
    { name: "Ana Clara", text: "Passei de primeira! As questões comentadas fizeram toda a diferença.", stars: 5 },
    { name: "Pedro Henrique", text: "Estudei só por aqui e tirei 28 de 30 na prova. Recomendo muito!", stars: 5 },
    { name: "Juliana Santos", text: "Conteúdo direto ao ponto, sem enrolação. Perfeito para quem tem pouco tempo.", stars: 5 },
  ];

  const handleBuy = () => {
    // TODO: Substituir pelo link real do Kiwify
    window.open("https://payfast.greenn.com.br/v3pumug", "_blank");
  };

  return (
    <div className="min-h-screen fade-in">
      {/* Nav */}
      <nav className="border-b border-border/50 px-4 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">
              Aprovado no <span className="text-primary">Trânsito</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
              Entrar
            </Button>
            <Button size="sm" onClick={handleBuy} className="glow-green">
              Comprar Agora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
            <Zap className="w-4 h-4" />
            Método aprovado por +2.000 alunos
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Passe na prova de<br />
            <span className="text-primary">legislação de trânsito</span><br />
            de primeira
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aulas escritas objetivas, simulados comentados e um método comprovado para você conquistar sua CNH sem medo da prova teórica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={handleBuy} className="h-14 px-8 text-base font-semibold glow-green hover:scale-[1.02] transition-transform">
              Quero Minha Aprovação <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground">
              ✅ Acesso imediato · 7 módulos · 70 aulas · 40+ provas
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tudo que você precisa para passar</h2>
            <p className="text-muted-foreground mt-2">Um curso completo e direto ao ponto</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 space-y-3 hover:ring-1 hover:ring-primary/20 transition-all">
                <f.icon className="w-8 h-8 text-primary" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-4 py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Conteúdo do Curso</h2>
            <p className="text-muted-foreground mt-2">7 módulos com 10 aulas cada + 40 provas simuladas</p>
          </div>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.name} className="glass-card p-5 flex items-center gap-4">
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.lessons} aulas escritas + simulado + provas</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">O que nossos alunos dizem</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 space-y-3">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">"{t.text}"</p>
                <p className="font-medium text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Pronto para conquistar sua CNH?</h2>
          <p className="text-muted-foreground">
            Comece agora e esteja preparado para a prova em poucos dias.
          </p>
          <div className="glass-card p-8 space-y-4">
            <div className="text-5xl font-extrabold text-primary">R$ 19<span className="text-2xl">,90</span></div>
            <p className="text-xs text-muted-foreground">Pagamento único · Acesso vitalício · Token enviado na hora</p>
            <Button size="lg" onClick={handleBuy} className="w-full h-14 text-base font-semibold glow-green hover:scale-[1.02] transition-transform">
              Garantir Meu Acesso Agora <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> 7 dias de garantia</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Pagamento seguro</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Já comprou?{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline font-medium">
              Acesse aqui com seu token
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8 text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aprovado no Trânsito. Todos os direitos reservados.
        </p>
        <button onClick={() => navigate("/termos")} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors">
          Termos de Serviço
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
