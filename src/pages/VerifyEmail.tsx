import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, Gift } from 'lucide-react';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }
      try {
        await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/verify-email?token=${token}`, { withCredentials: true });
        setStatus('success');
        setMessage('Your email has been verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      } catch (error: unknown) {
        setStatus('error');
        let errorMsg = 'Verification failed. Please try again or request a new link.';
        if (axios.isAxiosError(error) && error.response) {
          errorMsg = error.response.data?.error || errorMsg;
        }
        setMessage(errorMsg);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-large border-white/20 bg-white/95 backdrop-blur-sm text-center">
          <CardHeader className="space-y-4">
            <div className={`mx-auto p-3 rounded-2xl w-fit ${status === 'success' ? 'bg-gradient-to-r from-success to-success/80' : status === 'error' ? 'bg-gradient-to-r from-destructive to-destructive/80' : 'bg-gradient-primary'}`}>
              {status === 'success' ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : status === 'error' ? (
                <XCircle className="h-8 w-8 text-white" />
              ) : (
                <Gift className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {status === 'success' ? 'Email Verified!' : status === 'error' ? 'Verification Failed' : 'Verifying...'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {message}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'error' && (
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail; 