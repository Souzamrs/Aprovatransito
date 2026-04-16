import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, Trophy, PlayCircle, RotateCcw } from "lucide-react";

interface Provinha {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string;
}

interface Resultado {
  provinha_id: string;
  acertos: number;
  total: number;
  percentual: number;
}

const Provinhas = () => {
  const navigate = useNavigate();
  const [provinhas, setProvinhas] = useState<Provinha[]>([]);
  const [qCounts, setQCounts] = useState<Record<string, number>>({});
  const [bestScores, setBestScores] = useState<Record<string, Resultado>>({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("lp_token") || "";

  useEffect(() => {
    const fetchData = async () => {
      const [provRes, qRes, resRes] = await Promise.all([
        supabase.from("provinhas").select("*").eq("status", "publicada").order("criado_em", { ascending: false }),
        supabase.from("provinhas_questoes").select("provinha_id"),
        supabase.from("provinhas_resultados").select("*").eq("token_aluno", token),
      ]);

      setProvinhas((provRes.data || []) as Provinha[]);

      const counts: Record<string, number> = {};
      ((qRes.data || []) as any[]).forEach((q) => { counts[q.provinha_id] = (counts[q.provinha_id] || 0) + 1; });
      setQCounts(counts);

      const best: Record<string, Resultado> = {};
      ((resRes.data || []) as Resultado[]).forEach((r) => {
        if (!best[r.provinha_id] || r.percentual > best[r.provinha_id].percentual) {
          best[r.provinha_id] = r;
        }
      });
      setBestScores(best);
      setLoading(false);
    };
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-border/50 px-4 py-3 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Provinhas</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Provinhas <span className="text-primary">Completas</span></h1>
          <p className="text-muted-foreground text-sm mt-1">Simule uma prova real do Detran com questões completas</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Carregando provinhas...</p>
        ) : provinhas.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Nenhuma provinha disponível ainda. Em breve!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {provinhas.map((p) => {
              const count = qCounts[p.id] || 0;
              const best = bestScores[p.id];
              return (
                <div key={p.id} className="glass-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{p.titulo}</h3>
                      {p.descricao && <p className="text-xs text-muted-foreground mt-1">{p.descricao}</p>}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{count} questões</span>
                  </div>

                  {best ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span>Melhor: <strong className="text-primary">{best.acertos}/{best.total} ({Math.round(best.percentual)}%)</strong></span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Não iniciada</p>
                  )}

                  <Button
                    onClick={() => navigate(`/provinha/${p.id}`)}
                    className="w-full glow-green"
                    disabled={count === 0}
                  >
                    {best ? (
                      <><RotateCcw className="w-4 h-4 mr-2" /> Refazer Prova</>
                    ) : (
                      <><PlayCircle className="w-4 h-4 mr-2" /> Iniciar Prova</>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Provinhas;
