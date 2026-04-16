import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Trophy, Target, HelpCircle, ChevronRight, LogOut, CheckCircle2, PlayCircle, BookOpen, FileText, AlertTriangle,
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
  descricao: string | null;
  ordem: number;
}

interface Aula {
  id: string;
  titulo: string;
  categoria_id: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { completedLessons, questionsAnswered, getQuizScore } = useProgress();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestProvinha, setBestProvinha] = useState<number | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const userName = localStorage.getItem("lp_user_name") || "Aluno";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("lp_token") || "";
      const [catRes, aulaRes, provRes, tokenRes] = await Promise.all([
        supabase.from("categorias").select("*").order("ordem", { ascending: true }),
        supabase.from("aulas").select("id, titulo, categoria_id, status").eq("status", "publicada").order("ordem", { ascending: true }),
        supabase.from("provinhas_resultados").select("percentual").eq("token_aluno", token),
        supabase.from("tokens").select("expires_at").eq("token", token).maybeSingle(),
      ]);
      setCategorias((catRes.data as Categoria[]) || []);
      setAulas((aulaRes.data as Aula[]) || []);

      const results = (provRes.data || []) as { percentual: number }[];
      if (results.length > 0) {
        setBestProvinha(Math.round(Math.max(...results.map((r) => r.percentual))));
      }

      const tokenData = tokenRes.data as any;
      if (tokenData?.expires_at) {
        const diff = new Date(tokenData.expires_at).getTime() - Date.now();
        setDaysRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const getAulasByCategoria = (catId: string) => aulas.filter((a) => a.categoria_id === catId);

  const totalLessons = aulas.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  const completedModules = categorias.filter((cat) => {
    const catAulas = getAulasByCategoria(cat.id);
    return catAulas.length > 0 && catAulas.every((a) => completedLessons.has(a.id));
  }).length;

  const avgScore = (() => {
    const scores = categorias.map((c) => getQuizScore(c.id)).filter((s) => s !== null) as number[];
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const stats = [
    { icon: Trophy, label: "Média nos Simulados", value: avgScore > 0 ? `${avgScore}%` : "—" },
    { icon: HelpCircle, label: "Questões Respondidas", value: String(questionsAnswered) },
    { icon: Target, label: "Módulos Concluídos", value: `${completedModules}/${categorias.length}` },
    { icon: FileText, label: "Melhor Provinha", value: bestProvinha !== null ? `${bestProvinha}%` : "—" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("lp_token");
    localStorage.removeItem("lp_is_admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-border/50 px-4 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">AT</span>
            </div>
            <span className="font-semibold text-sm hidden sm:block">Aprovado no Trânsito</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Access expiration warning */}
        {daysRemaining !== null && daysRemaining <= 30 && (
          <div className={`rounded-lg p-4 flex items-start gap-3 ${
            daysRemaining <= 0
              ? "bg-destructive/10 border border-destructive/30"
              : "bg-yellow-500/10 border border-yellow-500/30"
          }`}>
            <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              daysRemaining <= 0 ? "text-destructive" : "text-yellow-500"
            }`} />
            <div>
              <p className={`text-sm font-medium ${daysRemaining <= 0 ? "text-destructive" : "text-yellow-400"}`}>
                {daysRemaining <= 0
                  ? "Seu acesso expirou!"
                  : `Seu acesso expira em ${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""}!`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Para renovar, entre em contato pelo{" "}
                <a
                  href="https://wa.me/5531981046221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  WhatsApp (31) 98104-6221
                </a>
              </p>
            </div>
          </div>
        )}

        {daysRemaining !== null && daysRemaining > 30 && (
          <div className="text-xs text-muted-foreground text-right">
            ⏳ {daysRemaining} dias restantes de acesso
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">Olá, <span className="text-primary">{userName}</span> 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Continue de onde parou e conquiste sua aprovação!</p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-secondary [&>div]:bg-primary" />
          <p className="text-xs text-muted-foreground">{completedLessons.size} de {totalLessons} aulas concluídas</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5 space-y-2">
              <s.icon className="w-5 h-5 text-primary" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-bold text-xl">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Provinhas CTA */}
        <button
          onClick={() => navigate("/provinhas")}
          className="glass-card w-full p-5 flex items-center gap-4 text-left transition-all hover:ring-1 hover:ring-primary/30 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Provinhas Completas</p>
            <p className="text-xs text-muted-foreground mt-0.5">Simule uma prova real do Detran</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Módulos do Curso</h2>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando módulos...</p>
          ) : categorias.length === 0 ? (
            <div className="glass-card p-8 text-center text-muted-foreground">
              Nenhum módulo disponível ainda. O conteúdo está sendo preparado!
            </div>
          ) : (
            <div className="space-y-3">
              {categorias.map((cat) => {
                const catAulas = getAulasByCategoria(cat.id);
                const modCompleted = catAulas.filter((a) => completedLessons.has(a.id)).length;
                const modTotal = catAulas.length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/lesson/${cat.id}/0`)}
                    className="glass-card w-full p-5 flex items-center gap-4 text-left transition-all hover:ring-1 hover:ring-primary/30 cursor-pointer"
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{cat.nome}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {modTotal > 0 ? `${modCompleted}/${modTotal} aulas concluídas` : "Sem aulas publicadas"}
                      </p>
                      {modTotal > 0 && (
                        <Progress value={(modCompleted / modTotal) * 100} className="h-1.5 mt-2 bg-secondary [&>div]:bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {modTotal > 0 && modCompleted === modTotal ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : modCompleted > 0 ? (
                        <BookOpen className="w-5 h-5 text-primary" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
