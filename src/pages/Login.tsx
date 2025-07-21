import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Eye, EyeOff, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/axios';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Get return URL from query params or location state
  const params = new URLSearchParams(location.search);
  const returnTo = params.get('returnTo');
  const from = returnTo || location.state?.from?.pathname || '/dashboard';

// Check if the API is reachable
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Simple health check to the backend
        await api.get('/health', { timeout: 5000 });
        setApiStatus('online');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      console.log(`Attempting to login with email: ${email}`);
      await login(email, password);
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to your account.',
      });
      
      console.log(`Login successful, redirecting to ${from}`);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      let errorMsg = 'Login failed. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error
          errorMsg = error.response.data?.error || errorMsg;
          console.error(`Login failed with status ${error.response.status}:`, error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          errorMsg = 'No response from server. Please check your connection.';
          console.error('Login failed - no response:', error.request);
        } else {
          // Request setup failed
          errorMsg = `Request failed: ${error.message}`;
          console.error('Login request setup failed:', error.message);
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      setLoginError(errorMsg);
      
      toast({
        title: 'Login failed',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue your lucky streak
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {apiStatus === 'offline' && (
              <Alert className="mb-4 bg-yellow-50 border-yellow-300">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  We're having trouble connecting to our servers. Please try again later.
                </AlertDescription>
              </Alert>
            )}
            
            {loginError && (
              <Alert className="mb-4 bg-destructive/10 border-destructive/30">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-destructive">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                  disabled={apiStatus === 'offline'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  className="h-12 pr-12"
                  disabled={apiStatus === 'offline'}
                />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary h-12 text-lg"
                disabled={isLoading || apiStatus === 'offline'}
              >
                {isLoading ? "Signing in..." : apiStatus === 'checking' ? "Checking connection..." : apiStatus === 'offline' ? "Service Unavailable" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Sign up now
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;