import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight } from "lucide-react";

interface Questao {
  id: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_correta: string;
  explicacao: string | null;
}

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
}

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return;
      const [catRes, qRes] = await Promise.all([
        supabase.from("categorias").select("id, nome, emoji").eq("id", moduleId).maybeSingle(),
        supabase.from("questoes").select("*").eq("categoria_id", moduleId),
      ]);
      setCategoria(catRes.data as Categoria | null);
      setQuestoes((qRes.data as Questao[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando simulado...</p>
      </div>
    );
  }

  if (!categoria || questoes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Nenhuma questão disponível para este módulo.</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const question = questoes[currentIdx];
  const options = [
    { label: "a", text: question.alternativa_a },
    { label: "b", text: question.alternativa_b },
    { label: "c", text: question.alternativa_c },
    { label: "d", text: question.alternativa_d },
  ];
  const isCorrect = selectedAnswer === question.alternativa_correta;

  const handleSelect = (label: string) => {
    if (answered) return;
    setSelectedAnswer(label);
    setAnswered(true);
    if (label === question.alternativa_correta) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questoes.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const percent = Math.round((score / questoes.length) * 100);

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 fade-in">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
            percent >= 70 ? "bg-primary/10" : "bg-destructive/10"
          }`}>
            <Trophy className={`w-10 h-10 ${percent >= 70 ? "text-primary" : "text-destructive"}`} />
          </div>
          <h2 className="text-2xl font-bold">Resultado do Simulado</h2>
          <p className="text-muted-foreground text-sm">{categoria.emoji} {categoria.nome}</p>
          <div className="text-5xl font-extrabold text-primary">{percent}%</div>
          <p className="text-lg">
            Você acertou <span className="font-bold text-primary">{score}</span> de{" "}
            <span className="font-bold">{questoes.length}</span> questões
          </p>
          {percent >= 70 ? (
            <p className="text-sm text-primary">✅ Parabéns! Você foi aprovado neste simulado!</p>
          ) : (
            <p className="text-sm text-destructive">⚠️ Continue estudando! Você precisa de 70% para aprovação.</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleRestart} variant="outline" className="flex-1 border-primary/30">
              <RotateCcw className="w-4 h-4 mr-2" /> Refazer
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="flex-1 glow-green">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-border/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{categoria.emoji} Simulado — {categoria.nome}</p>
            <p className="font-semibold text-sm">Questão {currentIdx + 1} de {questoes.length}</p>
          </div>
          <span className="text-xs bg-secondary px-3 py-1 rounded-full font-medium">
            {score} acerto{score !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="h-1 bg-secondary">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((currentIdx + 1) / questoes.length) * 100}%` }} />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="glass-card p-6">
          <p className="font-medium leading-relaxed">{question.enunciado}</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            let style = "glass-card hover:ring-1 hover:ring-primary/30";
            if (answered) {
              if (opt.label === question.alternativa_correta) {
                style = "bg-primary/10 ring-1 ring-primary/50";
              } else if (opt.label === selectedAnswer && !isCorrect) {
                style = "bg-destructive/10 ring-1 ring-destructive/50";
              } else {
                style = "glass-card opacity-50";
              }
            }
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.label)}
                disabled={answered}
                className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all ${style}`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 uppercase ${
                  answered && opt.label === question.alternativa_correta
                    ? "bg-primary text-primary-foreground"
                    : answered && opt.label === selectedAnswer && !isCorrect
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {opt.label}
                </span>
                <span className="text-sm">{opt.text}</span>
                {answered && opt.label === question.alternativa_correta && (
                  <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />
                )}
                {answered && opt.label === selectedAnswer && !isCorrect && (
                  <XCircle className="w-5 h-5 text-destructive ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`p-5 rounded-xl border fade-in ${
            isCorrect ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
          }`}>
            <p className="text-sm font-semibold mb-1">
              {isCorrect ? "✅ Resposta correta!" : "❌ Resposta incorreta"}
            </p>
            {question.explicacao && (
              <p className="text-sm text-muted-foreground leading-relaxed">{question.explicacao}</p>
            )}
          </div>
        )}

        {answered && (
          <Button onClick={handleNext} className="w-full h-12 glow-green hover:scale-[1.02] transition-transform">
            {currentIdx < questoes.length - 1 ? (
              <>Próxima Questão <ChevronRight className="w-4 h-4 ml-1" /></>
            ) : (
              "Ver Resultado Final"
            )}
          </Button>
        )}
      </main>
    </div>
  );
};

export default Quiz;
