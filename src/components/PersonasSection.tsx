import { GraduationCap, User, Users, Trophy } from "lucide-react";

const PersonasSection = () => {
  const personas = [
    {
      icon: GraduationCap,
      title: "L&D Admin",
      description: "Configure taxonomies. Assess org-wide skill gaps. Deploy targeted upskilling.",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: User,
      title: "Employee Learner", 
      description: "Track your skill growth. See your career journey. Get personalized recommendations.",
      gradient: "from-accent to-primary"
    },
    {
      icon: Users,
      title: "Team Manager",
      description: "Find in-house experts. Build high-performing project teams.",
      gradient: "from-primary-glow to-accent"
    },
    {
      icon: Trophy,
      title: "L&D Head",
      description: "Get AI-powered insights. Align workforce capabilities with business priorities.",
      gradient: "from-accent to-primary-glow"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Built for Every Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              SkillSphere adapts to your unique perspective and responsibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personas.map((persona, index) => (
              <div 
                key={index}
                className="bg-gradient-card rounded-2xl p-6 border border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${persona.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <persona.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{persona.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {persona.description}
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

export default PersonasSection;