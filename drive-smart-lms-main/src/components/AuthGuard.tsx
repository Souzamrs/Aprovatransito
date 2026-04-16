import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (requireAdmin) {
        const isAdmin = localStorage.getItem("lp_is_admin");
        if (isAdmin !== "true") {
          navigate("/login", { replace: true });
          return;
        }
        setVerified(true);
        return;
      }

      const token = localStorage.getItem("lp_token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("tokens")
        .select("status")
        .eq("token", token)
        .maybeSingle();

      if (error || !data || data.status !== "ativo") {
        localStorage.removeItem("lp_token");
        navigate("/login", { replace: true });
        return;
      }

      setVerified(true);
    };

    checkAuth();
  }, [navigate, requireAdmin]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Verificando acesso...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
