import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const PlatformPreview = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              See SkillSphere in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how AI transforms your workforce strategy.
            </p>
          </div>

          {/* Demo Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gradient-card rounded-3xl p-2 shadow-elegant">
              <div className="bg-background/50 rounded-2xl aspect-video flex items-center justify-center">
                <Button size="xl" variant="hero" className="group">
                  <Play className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Watch 60-Second Demo
                </Button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/20 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreview;