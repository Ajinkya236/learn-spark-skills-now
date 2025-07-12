import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestimonialsSlider = () => {
  const testimonials = [
    {
      quote: "SkillSphere gave us a 360° view of workforce skills. We cut external hiring by 30%.",
      author: "Sarah Chen",
      title: "CHRO, Global Tech Enterprise",
      company: "TechCorp"
    },
    {
      quote: "The AI-powered skill mapping revolutionized how we approach talent development and project staffing.",
      author: "Michael Rodriguez",
      title: "Head of Learning & Development",
      company: "InnovateCo"
    },
    {
      quote: "Finally, a platform that actually understands the complexity of enterprise skill management.",
      author: "Dr. Amanda Foster",
      title: "VP of Human Resources",
      company: "FutureWorks"
    },
    {
      quote: "SkillSphere's predictive analytics helped us identify skill gaps before they became business problems.",
      author: "James Thompson",
      title: "Chief People Officer",
      company: "ScaleUp Inc"
    },
    {
      quote: "The ROI on upskilling improved by 40% within the first quarter of implementation.",
      author: "Lisa Park",
      title: "Director of Workforce Planning",
      company: "GlobalCorp"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how organizations are transforming their workforce with SkillSphere.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-elegant">
              <div className="relative">
                {/* Quote Icon */}
                <Quote className="h-12 w-12 text-primary/30 mb-6" />
                
                {/* Testimonial Content */}
                <div className="space-y-6">
                  <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                  
                  <div className="space-y-2">
                    <cite className="text-lg font-bold text-primary not-italic">
                      {testimonials[currentIndex].author}
                    </cite>
                    <div className="text-muted-foreground">
                      {testimonials[currentIndex].title} • {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button 
                variant="outline" 
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;