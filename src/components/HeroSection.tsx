import { Button } from "@/components/ui/button";
import { Play, Network, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        {/* Neural network background animation */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Redefine Skills.
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Reimagine Workforce Potential.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered Skills Intelligence to map, measure, and mobilize talent with precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" variant="hero" className="group text-lg px-8 py-4">
                Get Started Free
                <Zap className="ml-2 h-5 w-5 group-hover:animate-pulse" />
              </Button>
              <Button size="xl" variant="outline" className="group text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Product Tour
              </Button>
            </div>
          </div>

          {/* Hero Visual - 3D Interactive Graph */}
          <div className="relative animate-scale-in">
            <div className="relative z-10 bg-gradient-card rounded-3xl p-8 shadow-elegant">
              {/* Skill Graph Visualization */}
              <div className="relative w-full h-96 bg-background/50 rounded-2xl overflow-hidden">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                    <Network className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                
                {/* Skill Nodes */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-accent rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-primary/70 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-accent/70 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-1/3 right-1/3 w-7 h-7 bg-primary rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/6 left-1/2 w-5 h-5 bg-accent/80 rounded-full animate-bounce delay-200"></div>
                <div className="absolute bottom-1/6 right-1/2 w-9 h-9 bg-primary/80 rounded-full animate-bounce delay-800"></div>
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="75%" y2="33%" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="67%" y2="67%" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="50%" y2="17%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="50%" y2="83%" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3" />
                </svg>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-full opacity-30 animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;