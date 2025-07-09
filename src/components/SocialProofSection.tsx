import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Research Scientist",
    quote: "SkilLLs AI has revolutionized how I approach research. The RAG technology provides incredibly accurate and current information.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Computer Science Student",
    quote: "The SkilLLs mode helped me master Python in just weeks. The personalized learning approach is phenomenal.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "Marketing Professional",
    quote: "Perfect for continuous learning. I use General Purpose mode to explore new topics and SkilLLs mode to develop specific skills.",
    rating: 5,
    avatar: "EW"
  }
];

const stats = [
  { number: "50K+", label: "Active Learners" },
  { number: "1M+", label: "Questions Answered" },
  { number: "95%", label: "Satisfaction Rate" },
  { number: "24/7", label: "Available" }
];

const SocialProofSection = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Loved by <span className="bg-gradient-primary bg-clip-text text-transparent">Learners</span> Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students, professionals, and researchers who are accelerating their learning with SkilLLs AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover:shadow-elegant transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-primary/60" />
                  
                  <p className="text-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;