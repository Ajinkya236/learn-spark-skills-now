
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* 3D Interactive Graph Visual */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="relative w-96 h-96">
          {/* Animated nodes representing skills network */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full animate-pulse transform -translate-x-2 -translate-y-2"></div>
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-secondary rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-accent rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse delay-500"></div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
            <line x1="192" y1="192" x2="128" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.3" className="animate-pulse" />
            <line x1="192" y1="192" x2="256" y2="288" stroke="currentColor" strokeWidth="1" opacity="0.3" className="animate-pulse delay-75" />
            <line x1="192" y1="192" x2="96" y2="288" stroke="currentColor" strokeWidth="1" opacity="0.3" className="animate-pulse delay-150" />
            <line x1="192" y1="192" x2="288" y2="128" stroke="currentColor" strokeWidth="1" opacity="0.3" className="animate-pulse delay-300" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Redefine Skills.
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Reimagine Workforce Potential.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered Skills Intelligence to map, measure, and mobilize talent with precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Watch Product Tour
            </Button>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              ✨ No credit card required • 🚀 Setup in minutes • 🔒 Enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
