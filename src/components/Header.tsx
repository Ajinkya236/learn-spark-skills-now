import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { useState } from "react";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors py-2">
                Home
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;