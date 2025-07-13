
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TaxonomyManagement from "./pages/skills/TaxonomyManagement";
import InactiveBin from "./pages/skills/InactiveBin";
import ProficiencyLevels from "./pages/skills/ProficiencyLevels";
import JobRoleSkillRelationship from "./pages/skills/JobRoleSkillRelationship";
import SkillSkillRelationship from "./pages/skills/SkillSkillRelationship";
import LearningContentSkillRelationship from "./pages/skills/LearningContentSkillRelationship";
import EmployeeSkillRelationship from "./pages/skills/EmployeeSkillRelationship";
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
          <Route path="/skills/proficiency" element={<ProficiencyLevels />} />
          <Route path="/skills/job-role-relationship" element={<JobRoleSkillRelationship />} />
          <Route path="/skills/skill-relationship" element={<SkillSkillRelationship />} />
          <Route path="/skills/learning-content-relationship" element={<LearningContentSkillRelationship />} />
          <Route path="/skills/employee-relationship" element={<EmployeeSkillRelationship />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
