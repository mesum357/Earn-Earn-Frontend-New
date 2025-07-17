import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-warning/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              New prizes added daily!
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Win Prizes with Just{' '}
              <span className="bg-gradient-to-r from-secondary to-warning bg-clip-text text-transparent">
                $2!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              Try your luck. It might be your day! Join thousands of winners in our lucky draws.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="btn-secondary text-lg px-8 py-4 h-auto group"
              >
                Join the Lucky Draw Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
             <Button 
  size="lg"
  onClick={() => navigate('/login')}
  className="text-lg px-8 py-4 h-auto border border-white/30 text-white hover:bg-white/10 hover:border-white/50"
>
  <Gift className="mr-2 h-5 w-5" />
  View Prizes
</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">2,847</div>
                <div className="text-white/80 text-sm">Happy Winners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">$24,500</div>
                <div className="text-white/80 text-sm">Prizes Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">15</div>
                <div className="text-white/80 text-sm">Daily Draws</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative lg:ml-12">
              <img 
                src={heroImage} 
                alt="Lucky Draw Platform" 
                className="w-full h-auto rounded-3xl shadow-large"
              />
              <div className="absolute -top-4 -right-4 bg-warning rounded-full p-4 animate-bounce-in">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;