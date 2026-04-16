import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, CheckCircle2, FileText } from "lucide-react";

interface Provinha {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string;
  criado_em: string;
}

interface ProvQuestion {
  id: string;
  provinha_id: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_correta: string;
  explicacao: string | null;
  ordem: number;
}

type View = "list" | "questions";

const AdminProvinhas = () => {
  const [provinhas, setProvinhas] = useState<Provinha[]>([]);
  const [questions, setQuestions] = useState<ProvQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [activeProvinha, setActiveProvinha] = useState<Provinha | null>(null);

  // Provinha form
  const [provDialog, setProvDialog] = useState(false);
  const [editingProv, setEditingProv] = useState<Provinha | null>(null);
  const [provForm, setProvForm] = useState({ titulo: "", descricao: "", status: "rascunho" });

  // Question form
  const [qDialog, setQDialog] = useState(false);
  const [editingQ, setEditingQ] = useState<ProvQuestion | null>(null);
  const [qForm, setQForm] = useState({
    enunciado: "", alternativa_a: "", alternativa_b: "", alternativa_c: "", alternativa_d: "",
    alternativa_correta: "a", explicacao: "",
  });

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"provinha" | "question">("provinha");

  // Counts
  const [qCounts, setQCounts] = useState<Record<string, number>>({});

  const fetchProvinhas = async () => {
    const { data } = await supabase.from("provinhas").select("*").order("criado_em", { ascending: false });
    const list = (data || []) as Provinha[];
    setProvinhas(list);

    // Fetch question counts
    const { data: allQ } = await supabase.from("provinhas_questoes").select("provinha_id");
    const counts: Record<string, number> = {};
    (allQ || []).forEach((q: any) => { counts[q.provinha_id] = (counts[q.provinha_id] || 0) + 1; });
    setQCounts(counts);
    setLoading(false);
  };

  const fetchQuestions = async (provId: string) => {
    const { data } = await supabase.from("provinhas_questoes").select("*").eq("provinha_id", provId).order("ordem", { ascending: true });
    setQuestions((data || []) as ProvQuestion[]);
  };

  useEffect(() => { fetchProvinhas(); }, []);

  // Provinha CRUD
  const openNewProv = () => {
    setEditingProv(null);
    setProvForm({ titulo: "", descricao: "", status: "rascunho" });
    setProvDialog(true);
  };

  const openEditProv = (p: Provinha) => {
    setEditingProv(p);
    setProvForm({ titulo: p.titulo, descricao: p.descricao || "", status: p.status });
    setProvDialog(true);
  };

  const saveProv = async () => {
    if (!provForm.titulo.trim()) { toast.error("Título obrigatório"); return; }
    if (editingProv) {
      await supabase.from("provinhas").update({
        titulo: provForm.titulo, descricao: provForm.descricao || null, status: provForm.status,
      } as any).eq("id", editingProv.id);
      toast.success("Provinha atualizada!");
    } else {
      await supabase.from("provinhas").insert({
        titulo: provForm.titulo, descricao: provForm.descricao || null, status: provForm.status,
      } as any);
      toast.success("Provinha criada!");
    }
    setProvDialog(false);
    fetchProvinhas();
  };

  // Question CRUD
  const openNewQ = () => {
    setEditingQ(null);
    setQForm({ enunciado: "", alternativa_a: "", alternativa_b: "", alternativa_c: "", alternativa_d: "", alternativa_correta: "a", explicacao: "" });
    setQDialog(true);
  };

  const openEditQ = (q: ProvQuestion) => {
    setEditingQ(q);
    setQForm({
      enunciado: q.enunciado, alternativa_a: q.alternativa_a, alternativa_b: q.alternativa_b,
      alternativa_c: q.alternativa_c, alternativa_d: q.alternativa_d,
      alternativa_correta: q.alternativa_correta, explicacao: q.explicacao || "",
    });
    setQDialog(true);
  };

  const saveQ = async () => {
    if (!qForm.enunciado.trim() || !qForm.alternativa_a.trim()) { toast.error("Preencha o enunciado e alternativas"); return; }
    if (!activeProvinha) return;

    if (editingQ) {
      await supabase.from("provinhas_questoes").update({
        enunciado: qForm.enunciado, alternativa_a: qForm.alternativa_a, alternativa_b: qForm.alternativa_b,
        alternativa_c: qForm.alternativa_c, alternativa_d: qForm.alternativa_d,
        alternativa_correta: qForm.alternativa_correta, explicacao: qForm.explicacao || null,
      } as any).eq("id", editingQ.id);
      toast.success("Questão atualizada!");
    } else {
      const nextOrdem = questions.length + 1;
      await supabase.from("provinhas_questoes").insert({
        provinha_id: activeProvinha.id,
        enunciado: qForm.enunciado, alternativa_a: qForm.alternativa_a, alternativa_b: qForm.alternativa_b,
        alternativa_c: qForm.alternativa_c, alternativa_d: qForm.alternativa_d,
        alternativa_correta: qForm.alternativa_correta, explicacao: qForm.explicacao || null,
        ordem: nextOrdem,
      } as any);
      toast.success("Questão adicionada!");
    }
    setQDialog(false);
    fetchQuestions(activeProvinha.id);
    fetchProvinhas();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteType === "provinha") {
      await supabase.from("provinhas").delete().eq("id", deleteId);
      toast.success("Provinha excluída!");
      fetchProvinhas();
    } else {
      await supabase.from("provinhas_questoes").delete().eq("id", deleteId);
      toast.success("Questão excluída!");
      if (activeProvinha) fetchQuestions(activeProvinha.id);
      fetchProvinhas();
    }
    setDeleteId(null);
  };

  const openQuestions = (p: Provinha) => {
    setActiveProvinha(p);
    setView("questions");
    fetchQuestions(p.id);
  };

  // Questions view
  if (view === "questions" && activeProvinha) {
    const count = questions.length;
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => setView("list")} className="text-muted-foreground mb-2">
              ← Voltar para provinhas
            </Button>
            <h2 className="text-xl font-bold">{activeProvinha.titulo}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {count}/30 questões adicionadas
              {count >= 30 && <span className="text-primary ml-2">Prova completa! ✅</span>}
            </p>
          </div>
          <Button onClick={openNewQ} className="glow-green">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Questão
          </Button>
        </div>

        {count > 30 && (
          <div className="glass-card p-3 border border-yellow-500/30 text-yellow-400 text-sm">
            ⚠️ Esta prova tem mais de 30 questões. O recomendado é 30.
          </div>
        )}

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="glass-card p-4 flex items-start gap-4">
              <span className="text-primary font-bold text-lg mt-1">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{q.enunciado}</p>
                <p className="text-xs text-muted-foreground mt-1">Correta: {q.alternativa_correta.toUpperCase()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEditQ(q)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { setDeleteId(q.id); setDeleteType("question"); }}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="glass-card p-8 text-center text-muted-foreground text-sm">
              Nenhuma questão adicionada ainda.
            </div>
          )}
        </div>

        {/* Question Dialog */}
        <Dialog open={qDialog} onOpenChange={setQDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQ ? "Editar Questão" : "Nova Questão"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Enunciado</Label>
                <Textarea value={qForm.enunciado} onChange={(e) => setQForm({ ...qForm, enunciado: e.target.value })} rows={3} className="bg-secondary/50" />
              </div>
              {(["a", "b", "c", "d"] as const).map((letter) => (
                <div key={letter}>
                  <Label>Alternativa {letter.toUpperCase()}</Label>
                  <Input
                    value={qForm[`alternativa_${letter}` as keyof typeof qForm]}
                    onChange={(e) => setQForm({ ...qForm, [`alternativa_${letter}`]: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
              ))}
              <div>
                <Label>Alternativa correta</Label>
                <RadioGroup value={qForm.alternativa_correta} onValueChange={(v) => setQForm({ ...qForm, alternativa_correta: v })} className="flex gap-6 mt-2">
                  {["a", "b", "c", "d"].map((l) => (
                    <div key={l} className="flex items-center gap-2">
                      <RadioGroupItem value={l} id={`q-${l}`} />
                      <Label htmlFor={`q-${l}`}>{l.toUpperCase()}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label>Explicação (opcional)</Label>
                <Textarea value={qForm.explicacao} onChange={(e) => setQForm({ ...qForm, explicacao: e.target.value })} rows={2} className="bg-secondary/50" />
              </div>
              <Button onClick={saveQ} className="w-full glow-green">Salvar Questão</Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir questão?</AlertDialogTitle>
              <AlertDialogDescription>Essa ação é irreversível.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Provinhas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{provinhas.length} provinha(s) cadastrada(s)</p>
        </div>
        <Button onClick={openNewProv} className="glow-green">
          <Plus className="w-4 h-4 mr-2" /> Nova Provinha
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : provinhas.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground text-sm">Nenhuma provinha cadastrada.</div>
      ) : (
        <div className="space-y-3">
          {provinhas.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.titulo}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{qCounts[p.id] || 0} questões</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "publicada" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {p.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(p.criado_em).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEditProv(p)} title="Editar"><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => openQuestions(p)} title="Ver questões"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { setDeleteId(p.id); setDeleteType("provinha"); }} title="Excluir">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provinha Dialog */}
      <Dialog open={provDialog} onOpenChange={setProvDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProv ? "Editar Provinha" : "Nova Provinha"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input value={provForm.titulo} onChange={(e) => setProvForm({ ...provForm, titulo: e.target.value })} className="bg-secondary/50" />
            </div>
            <div>
              <Label>Descrição (opcional)</Label>
              <Textarea value={provForm.descricao} onChange={(e) => setProvForm({ ...provForm, descricao: e.target.value })} rows={2} className="bg-secondary/50" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={provForm.status} onValueChange={(v) => setProvForm({ ...provForm, status: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="publicada">Publicada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveProv} className="w-full glow-green">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir provinha?</AlertDialogTitle>
            <AlertDialogDescription>Todas as questões vinculadas também serão excluídas. Essa ação é irreversível.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProvinhas;
