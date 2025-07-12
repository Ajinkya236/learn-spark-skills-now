
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { BackButton } from "./BackButton";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-jio-blue backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-jio-white hover:bg-jio-blue/80" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-4">
            <Logo />
            <BackButton />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-jio-white hover:text-jio-white/80 transition-colors font-medium font-inter">
              Home
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-jio-white text-jio-white hover:bg-jio-white hover:text-jio-blue font-inter font-semibold"
            >
              Request a Demo
            </Button>
          </div>

          {/* Mobile spacing */}
          <div className="w-10 md:hidden"></div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-jio-white/20 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#home" className="text-jio-white hover:text-jio-white/80 transition-colors py-2 font-inter">
                Home
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-jio-white/20">
                <Button 
                  variant="outline" 
                  className="border-jio-white text-jio-white hover:bg-jio-white hover:text-jio-blue font-inter font-semibold"
                >
                  Request a Demo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
