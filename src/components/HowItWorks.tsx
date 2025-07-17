import { UserPlus, CreditCard, Gift } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds. No hidden fees or commitments.",
    color: "primary"
  },
  {
    icon: CreditCard,
    title: "Choose Your Draw",
    description: "Pick from our amazing prizes starting at just $2. Every entry counts!",
    color: "secondary"
  },
  {
    icon: Gift,
    title: "Win & Celebrate",
    description: "Get notified instantly if you win. Prizes delivered straight to you!",
    color: "success"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple! Follow these three easy steps to begin winning amazing prizes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="lucky-card text-center relative z-10 group-hover:shadow-colored">
                <div className={`
                  w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                  ${step.color === 'primary' ? 'bg-gradient-primary' : 
                    step.color === 'secondary' ? 'bg-gradient-secondary' : 
                    'bg-gradient-to-r from-success to-success/80'} 
                  shadow-medium group-hover:scale-110 transition-transform duration-300
                `}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="absolute -top-2 -right-2 bg-accent text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-medium">
                  {index + 1}
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-6 py-3 text-primary font-medium">
            <Gift className="w-5 h-5 mr-2" />
            Start winning in under 2 minutes!
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;