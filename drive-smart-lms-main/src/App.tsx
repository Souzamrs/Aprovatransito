import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGuard from "@/components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import Provinhas from "./pages/Provinhas";
import ProvinhaExam from "./pages/ProvinhaExam";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Obrigado from "./obrigado";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/lesson/:moduleId/:lessonIndex" element={<AuthGuard><Lesson /></AuthGuard>} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/quiz/:moduleId" element={<AuthGuard><Quiz /></AuthGuard>} />
          <Route path="/provinhas" element={<AuthGuard><Provinhas /></AuthGuard>} />
          <Route path="/provinha/:provinhaId" element={<AuthGuard><ProvinhaExam /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard requireAdmin><Admin /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
