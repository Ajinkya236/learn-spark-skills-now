import { Globe, Network } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <Network className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse"></div>
      </div>
      <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        SkillSphere
      </span>
    </div>
  );
};

export default Logo;