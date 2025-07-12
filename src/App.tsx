
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TaxonomyManagement from "./pages/skills/TaxonomyManagement";
import InactiveBin from "./pages/skills/InactiveBin";
import SkillRelationships from "./pages/skills/SkillRelationships";
import ProficiencyLevels from "./pages/skills/ProficiencyLevels";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills/taxonomy" element={<TaxonomyManagement />} />
          <Route path="/skills/taxonomy/inactive" element={<InactiveBin />} />
          <Route path="/skills/inactive-bin" element={<InactiveBin />} />
          <Route path="/skills/relationships" element={<SkillRelationships />} />
          <Route path="/skills/proficiency" element={<ProficiencyLevels />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
