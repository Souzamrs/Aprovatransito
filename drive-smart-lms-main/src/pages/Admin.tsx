import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Key, FolderOpen, BookOpen, HelpCircle, FileText, LogOut, Menu, X } from "lucide-react";
import AdminTokens from "@/components/admin/AdminTokens";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminLessons from "@/components/admin/AdminLessons";
import AdminQuestions from "@/components/admin/AdminQuestions";
import AdminProvinhas from "@/components/admin/AdminProvinhas";

type Section = "tokens" | "categorias" | "aulas" | "questoes" | "provinhas";

const sections: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "tokens", label: "Tokens", icon: Key },
  { key: "categorias", label: "Categorias", icon: FolderOpen },
  { key: "aulas", label: "Aulas", icon: BookOpen },
  { key: "questoes", label: "Questões", icon: HelpCircle },
  { key: "provinhas", label: "Provinhas", icon: FileText },
];

const Admin = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>("tokens");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("lp_is_admin");
    if (isAdmin !== "true") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("lp_is_admin");
    localStorage.removeItem("lp_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col fade-in">
      {/* Mobile header */}
      <header className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Admin</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-border/50 bg-background
          transform transition-transform lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6 border-b border-border/50 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Aprovado no Trânsito</p>
              <p className="text-xs text-muted-foreground">Painel Admin</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-14 lg:mt-0">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => { setActive(s.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  active === s.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 hidden lg:block">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {active === "tokens" && <AdminTokens />}
            {active === "categorias" && <AdminCategories />}
            {active === "aulas" && <AdminLessons />}
            {active === "questoes" && <AdminQuestions />}
            {active === "provinhas" && <AdminProvinhas />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
