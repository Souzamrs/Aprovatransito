import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Copy, Ban, RotateCcw, Trash2, Search, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

interface Token {
  id: string;
  token: string;
  status: string;
  nome_aluno: string | null;
  criado_em: string;
  expires_at: string | null;
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "tk_";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getExpirationBadge(expiresAt: string | null) {
  if (!expiresAt) return <Badge variant="secondary" className="text-xs">Sem validade</Badge>;

  const now = new Date();
  const exp = new Date(expiresAt);
  const diffMs = exp.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return <Badge variant="destructive" className="text-xs">🔴 Expirado</Badge>;
  }
  if (diffDays <= 30) {
    return <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30">🟡 {diffDays}d restantes</Badge>;
  }
  return <Badge className="text-xs bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">🟢 {diffDays}d restantes</Badge>;
}

const AdminTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTokens = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tokens")
      .select("*")
      .order("criado_em", { ascending: false });
    setTokens((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchTokens(); }, []);

  const handleGenerate = async () => {
    const newToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6);
    const { error } = await supabase.from("tokens").insert({
      token: newToken,
      status: "ativo",
      expires_at: expiresAt.toISOString(),
    } as any);
    if (error) {
      toast.error("Erro ao gerar token.");
      return;
    }
    toast.success("Token gerado com sucesso!");
    fetchTokens();
  };

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado!");
  };

  const handleCancel = async (id: string) => {
    await supabase.from("tokens").update({ status: "cancelado" } as any).eq("id", id);
    toast.success("Token cancelado.");
    fetchTokens();
  };

  const handleReactivate = async (id: string) => {
    await supabase.from("tokens").update({ status: "ativo" } as any).eq("id", id);
    toast.success("Token reativado.");
    fetchTokens();
  };

  const handleRenew = async (id: string) => {
    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + 6);
    await supabase.from("tokens").update({ expires_at: newExpiry.toISOString() } as any).eq("id", id);
    toast.success("Token renovado por +6 meses!");
    fetchTokens();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("tokens").delete().eq("id", deleteId);
    toast.success("Token excluído.");
    setDeleteId(null);
    fetchTokens();
  };

  const filtered = tokens.filter((t) =>
    t.token.toLowerCase().includes(search.toLowerCase()) ||
    (t.nome_aluno || "").toLowerCase().includes(search.toLowerCase())
  );

  const ativos = tokens.filter((t) => t.status === "ativo").length;
  const cancelados = tokens.filter((t) => t.status === "cancelado").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Gerenciar Tokens</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {tokens.length} · Ativos: <span className="text-primary">{ativos}</span> · Cancelados: <span className="text-destructive">{cancelados}</span>
          </p>
        </div>
        <Button onClick={handleGenerate} className="glow-green">
          <Plus className="w-4 h-4 mr-2" /> Gerar Novo Token
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar token ou nome do aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50 border-border/50"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum token encontrado.</TableCell></TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id} className={t.status === "cancelado" ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-sm">{t.token}</TableCell>
                  <TableCell className="text-sm">{t.nome_aluno || "—"}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      t.status === "ativo" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {t.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {t.expires_at ? new Date(t.expires_at).toLocaleDateString("pt-BR") : "—"}
                      </p>
                      {getExpirationBadge(t.expires_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(t.criado_em).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(t.token)} title="Copiar">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRenew(t.id)} title="Renovar +6 meses">
                        <CalendarPlus className="w-4 h-4 text-primary" />
                      </Button>
                      {t.status === "ativo" ? (
                        <Button variant="ghost" size="icon" onClick={() => handleCancel(t.id)} title="Cancelar">
                          <Ban className="w-4 h-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleReactivate(t.id)} title="Reativar">
                          <RotateCcw className="w-4 h-4 text-primary" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)} title="Excluir">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir token permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O aluno perderá acesso imediatamente.
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

export default AdminTokens;
