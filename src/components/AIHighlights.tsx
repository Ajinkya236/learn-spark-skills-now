import { Zap, TrendingUp, Target, BarChart3 } from "lucide-react";

const AIHighlights = () => {
  const highlights = [
    {
      icon: Zap,
      title: "Skill Inference Engine",
      description: "Auto-detect skills from resumes, assessments, and activity logs."
    },
    {
      icon: TrendingUp,
      title: "Labor Market Data Integration", 
      description: "Align your workforce with emerging market trends."
    },
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "Suggests content, roles, projects, and mentors using AI."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Dashboards to monitor upskilling ROI and organizational readiness."
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              AI That Actually
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Works for You
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced artificial intelligence capabilities designed for enterprise-scale workforce intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <highlight.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-left space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{highlight.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHighlights;