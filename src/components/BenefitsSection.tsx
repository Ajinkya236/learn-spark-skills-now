import { BookOpen, Target, Users, Zap, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Our advanced RAG technology ensures you get the most accurate, up-to-date information tailored to your learning needs."
  },
  {
    icon: Target,
    title: "Personalized Experience",
    description: "Switch between General Purpose mode for broad exploration and SkilLLs mode for focused skill development."
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Get immediate answers to your questions with context-aware responses that adapt to your learning progress."
  },
  {
    icon: BookOpen,
    title: "Comprehensive Knowledge",
    description: "Access a vast repository of information across all subjects, from basic concepts to advanced topics."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your learning journey with intelligent insights and personalized recommendations for improvement."
  },
  {
    icon: Users,
    title: "Research & Practice",
    description: "Perfect for students, professionals, and lifelong learners who want to research topics and practice skills effectively."
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">SkilLLs AI</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the next generation of learning with our innovative AI chatbot 
            designed specifically for education, research, and skill development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 border-0 bg-gradient-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;