import { Network, Brain, Users } from "lucide-react";

const FeaturesSnapshot = () => {
  const features = [
    {
      icon: Network,
      title: "Dynamic Skills Taxonomy",
      description: "Interactive map of your organization's skill DNA."
    },
    {
      icon: Brain,
      title: "AI-Driven Insights", 
      description: "Predict skill gaps, future needs, and development paths."
    },
    {
      icon: Users,
      title: "Talent Mobility Tools",
      description: "Match people to roles, projects, and growth opportunities."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center space-y-4 p-6 rounded-2xl bg-gradient-card border border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSnapshot;