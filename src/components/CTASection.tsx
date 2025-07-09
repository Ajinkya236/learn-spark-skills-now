import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary animate-glow-pulse" />
                <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                  Ready to Transform Your Learning?
                </span>
                <Sparkles className="h-6 w-6 text-primary animate-glow-pulse" />
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                Start Your
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI Learning Journey
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join the future of education today. Experience personalized learning, 
                instant answers, and skill mastery like never before.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-6">
                Trusted by learners from leading institutions
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-semibold">Stanford</div>
                <div className="text-lg font-semibold">MIT</div>
                <div className="text-lg font-semibold">Harvard</div>
                <div className="text-lg font-semibold">Oxford</div>
                <div className="text-lg font-semibold">Cambridge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;