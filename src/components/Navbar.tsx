import { useState } from 'react';
import { Menu, X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Gift className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EasyEarn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="btn-primary"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-primary/10 py-4 space-y-2 animate-slide-up">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
            >
              Login
            </Button>
            <Button 
              className="w-full btn-primary"
              onClick={() => {
                navigate('/signup');
                setIsOpen(false);
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;