import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/forgot-password`,
        { email },
        { withCredentials: true }
      );
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: 'Reset link sent!',
        description: response.data.message || 'Check your email for password reset instructions.',
      });
    } catch (error: unknown) {
      setIsLoading(false);
      let errorMsg = 'Failed to send reset link. Please try again.';
      if (axios.isAxiosError(error) && error.response) {
        errorMsg = error.response.data?.error || errorMsg;
      }
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="shadow-large border-white/20 bg-white/95 backdrop-blur-sm text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto bg-gradient-to-r from-success to-success/80 p-3 rounded-2xl w-fit">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We've sent a password reset link to your email
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-success/10 rounded-xl p-4">
                <Mail className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Reset instructions sent to:
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or click below to resend.
                </p>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Resend Email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-large border-white/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-gradient-primary p-3 rounded-2xl w-fit">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email address and we'll send you a reset link
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a reset link to this email address
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                If you don't have an account,{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;