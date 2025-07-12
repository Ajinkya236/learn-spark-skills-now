import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSnapshot from "@/components/FeaturesSnapshot";
import PlatformPreview from "@/components/PlatformPreview";
import PersonasSection from "@/components/PersonasSection";
import AIHighlights from "@/components/AIHighlights";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSnapshot />
      <PlatformPreview />
      <PersonasSection />
      <AIHighlights />
      <TestimonialsSlider />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
