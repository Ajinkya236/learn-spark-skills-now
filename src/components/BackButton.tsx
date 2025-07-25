
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on dashboard or landing page
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // Navigate back in history or to dashboard as fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-inter mr-4"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
};
