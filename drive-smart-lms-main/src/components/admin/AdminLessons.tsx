import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Aula {
  id: string;
  titulo: string;
  categoria_id: string;
  conteudo: string;
  tempo_leitura: string;
  status: string;
  ordem: number;
  criado_em: string;
}

interface Categoria {
  id: string;
  nome: string;
  emoji: string;
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const AdminLessons = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Aula | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "", categoria_id: "", conteudo: "", tempo_leitura: "5 min", status: "rascunho",
  });

  const fetchData = async () => {
    setLoading(true);
    const [aulasRes, catsRes] = await Promise.all([
      supabase.from("aulas").select("*").order("ordem", { ascending: true }),
      supabase.from("categorias").select("*").order("ordem", { ascending: true }),
    ]);
    setAulas((aulasRes.data as any[]) || []);
    setCategorias((catsRes.data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (filterCat === "all") return aulas;
    return aulas.filter((a) => a.categoria_id === filterCat);
  }, [aulas, filterCat]);

  const catMap = useMemo(() => {
    const m: Record<string, Categoria> = {};
    categorias.forEach((c) => (m[c.id] = c));
    return m;
  }, [categorias]);

  const openNew = () => {
    setEditing(null);
    setForm({ titulo: "", categoria_id: categorias[0]?.id || "", conteudo: "", tempo_leitura: "5 min", status: "rascunho" });
    setModalOpen(true);
  };

  const openEdit = (aula: Aula) => {
    setEditing(aula);
    setForm({
      titulo: aula.titulo,
      categoria_id: aula.categoria_id,
      conteudo: aula.conteudo,
      tempo_leitura: aula.tempo_leitura,
      status: aula.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.categoria_id) {
      toast.error("Título e categoria são obrigatórios.");
      return;
    }
    if (editing) {
      await supabase.from("aulas").update({
        titulo: form.titulo,
        categoria_id: form.categoria_id,
        conteudo: form.conteudo,
        tempo_leitura: form.tempo_leitura,
        status: form.status,
      } as any).eq("id", editing.id);
      toast.success("Aula atualizada.");
    } else {
      const sameCategory = aulas.filter((a) => a.categoria_id === form.categoria_id);
      const maxOrdem = sameCategory.length > 0 ? Math.max(...sameCategory.map((a) => a.ordem)) + 1 : 0;
      await supabase.from("aulas").insert({
        titulo: form.titulo,
        categoria_id: form.categoria_id,
        conteudo: form.conteudo,
        tempo_leitura: form.tempo_leitura,
        status: form.status,
        ordem: maxOrdem,
      } as any);
      toast.success("Aula criada.");
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("aulas").delete().eq("id", deleteId);
    toast.success("Aula excluída.");
    setDeleteId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Gerenciar Aulas</h2>
        <Button onClick={openNew} className="glow-green" disabled={categorias.length === 0}>
          <Plus className="w-4 h-4 mr-2" /> Nova Aula
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
        <div className="glass-card p-8 text-center text-muted-foreground">Nenhuma aula encontrada.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((aula) => (
            <div key={aula.id} className="glass-card p-4 flex items-center gap-4">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{aula.titulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{catMap[aula.categoria_id]?.emoji} {catMap[aula.categoria_id]?.nome}</span>
                  <span className="text-xs text-muted-foreground">· {aula.tempo_leitura}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    aula.status === "publicada" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}>
                    {aula.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(aula)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(aula.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título da aula" />
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
              <div className="space-y-2">
                <Label>Tempo de leitura</Label>
                <Input value={form.tempo_leitura} onChange={(e) => setForm({ ...form, tempo_leitura: e.target.value })} placeholder="Ex: 10 min" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publicada">Publicada</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <div className="bg-secondary/30 rounded-lg [&_.ql-toolbar]:border-border/50 [&_.ql-container]:border-border/50 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-foreground [&_.ql-snow]:bg-transparent">
                <ReactQuill theme="snow" value={form.conteudo} onChange={(v) => setForm({ ...form, conteudo: v })} modules={quillModules} />
              </div>
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
            <AlertDialogTitle>Excluir aula?</AlertDialogTitle>
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

export default AdminLessons;
