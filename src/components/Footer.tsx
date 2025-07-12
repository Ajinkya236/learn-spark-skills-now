import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="text-sm text-muted-foreground text-center md:text-right">
            © 2025 SkillSphere. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;