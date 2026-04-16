import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
  descricao: string | null;
  ordem: number;
}

const AdminCategories = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", emoji: "📚", descricao: "" });

  const fetchCategorias = async () => {
    setLoading(true);
    const { data } = await supabase.from("categorias").select("*").order("ordem", { ascending: true });
    setCategorias((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCategorias(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", emoji: "📚", descricao: "" });
    setModalOpen(true);
  };

  const openEdit = (cat: Categoria) => {
    setEditing(cat);
    setForm({ nome: cat.nome, emoji: cat.emoji, descricao: cat.descricao || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    if (editing) {
      await supabase.from("categorias").update({
        nome: form.nome, emoji: form.emoji, descricao: form.descricao || null,
      } as any).eq("id", editing.id);
      toast.success("Categoria atualizada.");
    } else {
      const maxOrdem = categorias.length > 0 ? Math.max(...categorias.map((c) => c.ordem)) + 1 : 0;
      await supabase.from("categorias").insert({
        nome: form.nome, emoji: form.emoji, descricao: form.descricao || null, ordem: maxOrdem,
      } as any);
      toast.success("Categoria criada.");
    }
    setModalOpen(false);
    fetchCategorias();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    // Check for linked aulas
    const { data: aulas } = await supabase.from("aulas").select("id").eq("categoria_id", deleteId);
    if (aulas && aulas.length > 0) {
      toast.error(`Existem ${aulas.length} aula(s) vinculada(s). Exclua-as primeiro.`);
      setDeleteId(null);
      return;
    }
    await supabase.from("categorias").delete().eq("id", deleteId);
    toast.success("Categoria excluída.");
    setDeleteId(null);
    fetchCategorias();
  };

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const idx = categorias.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= categorias.length) return;

    const updated = [...categorias];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    // Update ordem
    for (let i = 0; i < updated.length; i++) {
      await supabase.from("categorias").update({ ordem: i } as any).eq("id", updated[i].id);
    }
    fetchCategorias();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
        <Button onClick={openNew} className="glow-green">
          <Plus className="w-4 h-4 mr-2" /> Nova Categoria
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : categorias.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground">Nenhuma categoria cadastrada.</div>
      ) : (
        <div className="space-y-3">
          {categorias.map((cat, idx) => (
            <div key={cat.id} className="glass-card p-4 flex items-center gap-4">
              <span className="text-2xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{cat.nome}</p>
                {cat.descricao && <p className="text-xs text-muted-foreground truncate">{cat.descricao}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveCategory(cat.id, "up")} disabled={idx === 0}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => moveCategory(cat.id, "down")} disabled={idx === categorias.length - 1}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(cat.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Legislação de Trânsito" />
            </div>
            <div className="space-y-2">
              <Label>Emoji / Ícone</Label>
              <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="📚" className="w-24" />
            </div>
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descrição do módulo" rows={2} />
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
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente. Categorias com aulas vinculadas não podem ser excluídas.
            </AlertDialogDescription>
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

export default AdminCategories;
