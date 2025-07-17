import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import giftBox from '@/assets/gift-box.jpg';
import phonePrize from '@/assets/phone-prize.jpg';

const prizes = [
  {
    id: 1,
    title: "Mystery Gift Box",
    price: "$2",
    image: giftBox,
    participants: 1247,
    timeLeft: "2h 15m",
    featured: false,
    description: "Surprise gift worth $10-50! Could be electronics, gift cards, or exclusive merchandise.",
    gradient: "from-primary to-primary-light"
  },
  {
    id: 2,
    title: "iPhone 15 Pro",
    price: "$5",
    image: phonePrize,
    participants: 3891,
    timeLeft: "5h 42m",
    featured: true,
    description: "Brand new iPhone 15 Pro 256GB in your choice of color. Unlocked and ready to use.",
    gradient: "from-accent to-accent/80"
  }
];

const PrizePreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Live Draws
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Today's Featured Prizes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of participants competing for these amazing prizes. New draws start every few hours!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {prizes.map((prize) => (
            <div key={prize.id} className="group relative">
              <div className={`lucky-card overflow-hidden ${prize.featured ? 'winner-glow' : ''} group-hover:scale-[1.02]`}>
                {prize.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-warning text-warning-foreground animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Hot Prize
                    </Badge>
                  </div>
                )}

                <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                  <img 
                    src={prize.image} 
                    alt={prize.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${prize.gradient} opacity-20`}></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">
                      {prize.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {prize.price}
                      </div>
                      <div className="text-sm text-muted-foreground">per entry</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {prize.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {prize.participants.toLocaleString()} entries
                    </div>
                    <div className="flex items-center text-warning font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {prize.timeLeft} left
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full btn-primary text-lg"
                      onClick={() => navigate('/signup')}
                    >
                      Enter Draw Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/login')}
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
          >
            View All Available Prizes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PrizePreview;