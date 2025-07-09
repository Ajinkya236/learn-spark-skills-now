import { Brain, Sparkles } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Brain className="h-8 w-8 text-primary" />
        <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-glow-pulse" />
      </div>
      <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        SkilLLs AI
      </span>
    </div>
  );
};

export default Logo;