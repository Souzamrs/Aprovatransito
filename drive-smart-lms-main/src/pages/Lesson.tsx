import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, BookOpen, FileQuestion } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Aula {
  id: string;
  titulo: string;
  conteudo: string | null;
  tempo_leitura: string | null;
  ordem: number;
  categoria_id: string;
}

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
}

const Lesson = () => {
  const { moduleId, lessonIndex } = useParams();
  const navigate = useNavigate();
  const { completedLessons, markLessonComplete } = useProgress();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const idx = Number(lessonIndex) || 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return;
      const [catRes, aulasRes] = await Promise.all([
        supabase.from("categorias").select("id, nome, emoji").eq("id", moduleId).maybeSingle(),
        supabase.from("aulas").select("*").eq("categoria_id", moduleId).eq("status", "publicada").order("ordem", { ascending: true }),
      ]);
      setCategoria(catRes.data as Categoria | null);
      setAulas((aulasRes.data as Aula[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando aula...</p>
      </div>
    );
  }

  const lesson = aulas[idx];

  if (!categoria || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Aula não encontrada.</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    if (idx < aulas.length - 1) {
      navigate(`/lesson/${moduleId}/${idx + 1}`);
    } else {
      setShowQuizModal(true);
    }
  };

  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-border/50 px-4 py-3 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">{categoria.emoji} {categoria.nome}</p>
            <p className="font-semibold text-sm">{lesson.titulo}</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">
        <main className="flex-1 px-4 py-8 space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <BookOpen className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">{lesson.titulo}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{lesson.tempo_leitura || "5 min"} de leitura</p>
            {lesson.conteudo ? (
              <div
                className="text-sm text-foreground/90 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.conteudo }}
              />
            ) : (
              <p className="text-muted-foreground text-sm">Conteúdo em preparação.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleComplete} className="flex-1 h-12 glow-green hover:scale-[1.02] transition-transform">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {idx < aulas.length - 1 ? "Concluir e Ir para Próxima" : "Concluir Módulo ✅"}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/quiz/${moduleId}`)} className="h-12 border-primary/30 text-primary hover:bg-primary/10">
              <FileQuestion className="w-5 h-5 mr-2" /> Iniciar Simulado
            </Button>
          </div>
        </main>

        <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Aulas do módulo</p>
          {aulas.map((a, i) => {
            const isActive = i === idx;
            const done = completedLessons.has(a.id);
            return (
              <button
                key={a.id}
                onClick={() => navigate(`/lesson/${moduleId}/${i}`)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all ${
                  isActive ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-secondary/50"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0" />
                )}
                <span className={`flex-1 truncate ${isActive ? "font-medium" : "text-muted-foreground"}`}>{a.titulo}</span>
                <span className="text-xs text-muted-foreground">{a.tempo_leitura || "5 min"}</span>
              </button>
            );
          })}
        </aside>
      </div>

      <AlertDialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Módulo concluído!</AlertDialogTitle>
            <AlertDialogDescription>
              Parabéns! Você concluiu todas as aulas de {categoria.emoji} {categoria.nome}. Deseja fazer o simulado agora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(`/quiz/${moduleId}`)} className="bg-primary text-primary-foreground">
              Iniciar Simulado
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Lesson;
