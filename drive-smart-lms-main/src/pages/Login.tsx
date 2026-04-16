import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { OWNER_TOKEN } from "@/constants/auth";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error("Por favor, insira seu token de acesso.");
      return;
    }

    if (!isLogin && !name.trim()) {
      toast.error("Por favor, insira seu nome.");
      return;
    }

    const trimmedToken = token.trim();

    // Check if it's the owner token
    if (trimmedToken.toLowerCase() === OWNER_TOKEN.toLowerCase()) {
      localStorage.setItem("lp_is_admin", "true");
      localStorage.setItem("lp_token", trimmedToken);
      toast.success("Bem-vindo, Administrador!");
      navigate("/admin");
      return;
    }

    // Validate student token against Supabase
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("token", trimmedToken)
      .single();

    if (error || !data) {
      toast.error("Token inválido. Verifique o token enviado após a compra.");
      return;
    }

    if (data.status === "cancelado") {
      toast.error("Seu acesso foi revogado. Entre em contato com o suporte.");
      return;
    }

    // Check expiration
    const expiresAt = (data as any).expires_at;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      toast.error(
        "Seu acesso expirou. Entre em contato pelo WhatsApp (31) 98104-6221 para renovar.",
        { duration: 8000 }
      );
      return;
    }

    const userName = isLogin ? (localStorage.getItem("lp_user_name") || "Aluno") : name.trim();
    if (!isLogin) {
      localStorage.setItem("lp_user_name", userName);
      await supabase.from("tokens").update({ nome_aluno: userName } as any).eq("token", trimmedToken);
    }
    localStorage.setItem("lp_token", trimmedToken);
    localStorage.removeItem("lp_is_admin");

    toast.success(`Bem-vindo(a), ${userName}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 fade-in">
      <div className="w-full max-w-md space-y-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 glow-green">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Aprovado no <span className="text-primary">Trânsito</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Insira seu token de acesso para começar
          </p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                isLogin ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                !isLogin ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-muted-foreground">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary/50 border-border/50 h-12 pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm text-muted-foreground">Token de Acesso</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="token"
                  type={showToken ? "text" : "password"}
                  placeholder="Insira seu token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-secondary/50 border-border/50 h-12 pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                O token é enviado após a confirmação do pagamento.
              </p>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold glow-green hover:scale-[1.02] transition-transform">
              {isLogin ? "Entrar na Plataforma" : "Cadastrar e Acessar"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? "Ainda não tem acesso? " : "Já tem cadastro? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
            {isLogin ? "Cadastre-se com seu token" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
