import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Questao {
  id: string;
  enunciado: string;
  categoria_id: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_correta: string;
  explicacao: string | null;
  criado_em: string;
}

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
}

const AdminQuestions = () => {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Questao | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    enunciado: "", categoria_id: "",
    alternativa_a: "", alternativa_b: "", alternativa_c: "", alternativa_d: "",
    alternativa_correta: "a", explicacao: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [qRes, cRes] = await Promise.all([
      supabase.from("questoes").select("*").order("criado_em", { ascending: false }),
      supabase.from("categorias").select("*").order("ordem", { ascending: true }),
    ]);
    setQuestoes((qRes.data as any[]) || []);
    setCategorias((cRes.data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (filterCat === "all") return questoes;
    return questoes.filter((q) => q.categoria_id === filterCat);
  }, [questoes, filterCat]);

  const catMap = useMemo(() => {
    const m: Record<string, Categoria> = {};
    categorias.forEach((c) => (m[c.id] = c));
    return m;
  }, [categorias]);

  // Count per category
  const countPerCat = useMemo(() => {
    const m: Record<string, number> = {};
    questoes.forEach((q) => { m[q.categoria_id] = (m[q.categoria_id] || 0) + 1; });
    return m;
  }, [questoes]);

  const openNew = () => {
    setEditing(null);
    setForm({
      enunciado: "", categoria_id: categorias[0]?.id || "",
      alternativa_a: "", alternativa_b: "", alternativa_c: "", alternativa_d: "",
      alternativa_correta: "a", explicacao: "",
    });
    setModalOpen(true);
  };

  const openEdit = (q: Questao) => {
    setEditing(q);
    setForm({
      enunciado: q.enunciado, categoria_id: q.categoria_id,
      alternativa_a: q.alternativa_a, alternativa_b: q.alternativa_b,
      alternativa_c: q.alternativa_c, alternativa_d: q.alternativa_d,
      alternativa_correta: q.alternativa_correta, explicacao: q.explicacao || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.enunciado.trim() || !form.categoria_id || !form.alternativa_a || !form.alternativa_b || !form.alternativa_c || !form.alternativa_d) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const payload = {
      enunciado: form.enunciado,
      categoria_id: form.categoria_id,
      alternativa_a: form.alternativa_a,
      alternativa_b: form.alternativa_b,
      alternativa_c: form.alternativa_c,
      alternativa_d: form.alternativa_d,
      alternativa_correta: form.alternativa_correta,
      explicacao: form.explicacao || null,
    };
    if (editing) {
      await supabase.from("questoes").update(payload as any).eq("id", editing.id);
      toast.success("Questão atualizada.");
    } else {
      await supabase.from("questoes").insert(payload as any);
      toast.success("Questão criada.");
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("questoes").delete().eq("id", deleteId);
    toast.success("Questão excluída.");
    setDeleteId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Gerenciar Questões</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {questoes.length}
            {categorias.map((c) => (
              <span key={c.id}> · {c.emoji} {countPerCat[c.id] || 0}</span>
            ))}
          </p>
        </div>
        <Button onClick={openNew} className="glow-green" disabled={categorias.length === 0}>
          <Plus className="w-4 h-4 mr-2" /> Nova Questão
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Label className="text-sm text-muted-foreground whitespace-nowrap">Filtrar por:</Label>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-64 bg-secondary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.emoji} {c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground">Nenhuma questão encontrada.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div key={q.id} className="glass-card p-4 flex items-center gap-4">
              <HelpCircle className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{q.enunciado}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{catMap[q.categoria_id]?.emoji} {catMap[q.categoria_id]?.nome}</span>
                  {q.explicacao && <span className="text-xs text-primary">✓ Com explicação</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(q)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(q.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Questão" : "Nova Questão"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enunciado</Label>
              <Textarea value={form.enunciado} onChange={(e) => setForm({ ...form, enunciado: e.target.value })} placeholder="Digite o enunciado da questão" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.categoria_id} onValueChange={(v) => setForm({ ...form, categoria_id: v })}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.emoji} {c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {(["a", "b", "c", "d"] as const).map((letter) => (
                <div key={letter} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, alternativa_correta: letter })}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      form.alternativa_correta === letter
                        ? "bg-primary text-primary-foreground ring-2 ring-primary"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {letter.toUpperCase()}
                  </button>
                  <Input
                    value={form[`alternativa_${letter}`]}
                    onChange={(e) => setForm({ ...form, [`alternativa_${letter}`]: e.target.value })}
                    placeholder={`Alternativa ${letter.toUpperCase()}`}
                    className="flex-1"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Clique na letra para marcar a alternativa correta.</p>
            </div>

            <div className="space-y-2">
              <Label>Explicação (opcional)</Label>
              <Textarea
                value={form.explicacao}
                onChange={(e) => setForm({ ...form, explicacao: e.target.value })}
                placeholder="Explique por que a resposta é a correta..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="glow-green">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir questão?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação é permanente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminQuestions;
