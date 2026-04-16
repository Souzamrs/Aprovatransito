import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, ChevronLeft } from "lucide-react";

interface Question {
  id: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_correta: string;
  explicacao: string | null;
  ordem: number;
}

interface Provinha {
  id: string;
  titulo: string;
}

type Phase = "exam" | "result";

const ProvinhaExam = () => {
  const { provinhaId } = useParams();
  const navigate = useNavigate();
  const [provinha, setProvinha] = useState<Provinha | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("exam");
  const [loading, setLoading] = useState(true);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const token = localStorage.getItem("lp_token") || "";

  useEffect(() => {
    const fetchData = async () => {
      if (!provinhaId) return;
      const [pRes, qRes] = await Promise.all([
        supabase.from("provinhas").select("id, titulo").eq("id", provinhaId).maybeSingle(),
        supabase.from("provinhas_questoes").select("*").eq("provinha_id", provinhaId).order("ordem", { ascending: true }),
      ]);
      setProvinha(pRes.data as Provinha | null);
      setQuestions((qRes.data || []) as Question[]);
      setLoading(false);
    };
    fetchData();
  }, [provinhaId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-sm">Carregando prova...</p></div>;
  }

  if (!provinha || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Prova não encontrada ou sem questões.</p>
        <Button variant="outline" onClick={() => navigate("/provinhas")}>Voltar</Button>
      </div>
    );
  }

  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  const finishExam = async () => {
    let acertos = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.alternativa_correta) acertos++;
    });
    const percentual = (acertos / totalQ) * 100;

    await supabase.from("provinhas_resultados").insert({
      token_aluno: token,
      provinha_id: provinha.id,
      acertos,
      total: totalQ,
      percentual,
    } as any);

    setPhase("result");
    setConfirmFinish(false);
  };

  // RESULT PHASE
  if (phase === "result") {
    const acertos = questions.filter((q) => answers[q.id] === q.alternativa_correta).length;
    const pct = Math.round((acertos / totalQ) * 100);

    let msg = "";
    let msgClass = "";
    if (pct >= 70) { msg = "✅ Parabéns! Você passou! Continue assim!"; msgClass = "text-primary"; }
    else if (pct >= 50) { msg = "⚠️ Quase lá! Revise os conteúdos e tente novamente."; msgClass = "text-yellow-400"; }
    else { msg = "❌ Não desanime! Estude mais e refaça a prova."; msgClass = "text-destructive"; }

    return (
      <div className="min-h-screen fade-in">
        <header className="border-b border-border/50 px-4 py-3 sticky top-0 bg-background/80 backdrop-blur-md z-50">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/provinhas")}><ChevronLeft className="w-5 h-5" /></Button>
            <span className="font-semibold text-sm">{provinha.titulo} — Resultado</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <div className="glass-card p-8 text-center space-y-4">
            <p className="text-5xl font-bold text-primary">{acertos}/{totalQ}</p>
            <p className="text-lg font-semibold">{pct}% de acertos</p>
            <p className={`text-sm font-medium ${msgClass}`}>{msg}</p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setAnswers({}); setCurrentIdx(0); setPhase("exam"); }} className="glow-green">
              <RotateCcw className="w-4 h-4 mr-2" /> Refazer Prova
            </Button>
            <Button variant="outline" onClick={() => navigate("/provinhas")}>Voltar para Provinhas</Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Revisão das Questões</h2>
            {questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const correct = userAnswer === q.alternativa_correta;
              return (
                <div key={q.id} className={`glass-card p-5 space-y-3 border-l-4 ${correct ? "border-primary" : "border-destructive"}`}>
                  <div className="flex items-start gap-2">
                    {correct ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{i + 1}. {q.enunciado}</p>
                  </div>
                  {(["a", "b", "c", "d"] as const).map((letter) => {
                    const text = q[`alternativa_${letter}` as keyof Question] as string;
                    const isCorrect = letter === q.alternativa_correta;
                    const isUserPick = letter === userAnswer;
                    let cls = "text-muted-foreground";
                    if (isCorrect) cls = "text-primary font-medium";
                    else if (isUserPick && !isCorrect) cls = "text-destructive line-through";
                    return (
                      <p key={letter} className={`text-xs ml-7 ${cls}`}>
                        {letter.toUpperCase()}) {text} {isCorrect && "✓"} {isUserPick && !isCorrect && "✗"}
                      </p>
                    );
                  })}
                  {q.explicacao && (
                    <p className="text-xs text-muted-foreground ml-7 mt-2 italic border-t border-border/30 pt-2">{q.explicacao}</p>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // EXAM PHASE
  const q = questions[currentIdx];

  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-border/50 px-4 py-3 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/provinhas")} className="text-muted-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Sair
            </Button>
            <span className="text-sm font-medium">Questão {currentIdx + 1} de {totalQ}</span>
            <span className="text-xs text-muted-foreground">{answeredCount}/{totalQ} respondidas</span>
          </div>
          <Progress value={((currentIdx + 1) / totalQ) * 100} className="h-2 bg-secondary [&>div]:bg-primary" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="glass-card p-6 space-y-6">
          <p className="text-sm font-medium leading-relaxed">{q.enunciado}</p>

          <div className="space-y-3">
            {(["a", "b", "c", "d"] as const).map((letter) => {
              const text = q[`alternativa_${letter}` as keyof Question] as string;
              const selected = answers[q.id] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setAnswers({ ...answers, [q.id]: letter })}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg text-left text-sm transition-all border ${
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 hover:border-primary/30 hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {letter.toUpperCase()}
                  </span>
                  <span className="flex-1">{text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>

          {currentIdx < totalQ - 1 ? (
            <Button onClick={() => setCurrentIdx(currentIdx + 1)}>
              Próxima <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => setConfirmFinish(true)} className="glow-green">
              Finalizar Prova
            </Button>
          )}
        </div>

        {/* Question navigator dots */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                i === currentIdx
                  ? "bg-primary text-primary-foreground"
                  : answers[qq.id]
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <AlertDialog open={confirmFinish} onOpenChange={setConfirmFinish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar prova?</AlertDialogTitle>
            <AlertDialogDescription>
              Você respondeu {answeredCount} de {totalQ} questões. {answeredCount < totalQ && "Questões não respondidas serão consideradas erradas. "}Deseja finalizar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={finishExam} className="bg-primary text-primary-foreground">Finalizar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProvinhaExam;
