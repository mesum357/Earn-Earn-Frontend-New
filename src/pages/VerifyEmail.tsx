import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, ArrowLeft, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const token = searchParams.get('token');
  const error = searchParams.get('error');
  const success = searchParams.get('success');

  // Handle token verification
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    // If we have a token but no error/success, the backend should have already processed it
    // and redirected us with the result. If we're still here with a token, it means
    // the backend didn't process it properly, so we'll handle it via API
    if (token && !error && !success) {
      setVerifying(true);
      const verifyToken = async () => {
        try {
          const response = await api.post('/api/verify-email', { token });
          setVerificationResult({
            success: true,
            message: response.data.message
          });
        } catch (error: any) {
          setVerificationResult({
            success: false,
            message: error.response?.data?.error || 'Verification failed'
          });
        } finally {
          setVerifying(false);
        }
      };

      verifyToken();
    }
  }, [token, error, success]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsResending(true);
    try {
      const response = await api.post('/api/resend-verification', { email });
      toast({
        title: 'Email sent!',
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send email',
        description: error.response?.data?.error || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Show verification result if we have one
  if (verificationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-pink-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm max-w-md w-full relative z-10">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
              {verificationResult.success ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : (
                <XCircle className="h-10 w-10 text-white" />
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {verificationResult.success ? 'Email Verified!' : 'Verification Failed'}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {verificationResult.message}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {verificationResult.success ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Success!</h3>
                    <p className="text-green-700 text-sm">Your email has been verified successfully</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm mb-6">
                  You can now log in to your account and start earning rewards!
                </p>
                <Link to="/login" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Verification Failed</h3>
                    <p className="text-red-700 text-sm">We couldn't verify your email</p>
                  </div>
                </div>
                <p className="text-red-800 text-sm mb-6">
                  The verification link may have expired or is invalid. Please try again or contact support.
                </p>
                <div className="space-y-3">
                  <Link to="/verify-email" className="block">
                    <Button variant="outline" className="w-full h-12 border-red-300 text-red-700 hover:bg-red-50 font-semibold rounded-lg">
                      Try Again
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while verifying
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-pink-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm max-w-md w-full relative z-10">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Verifying Your Email</h2>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-pink-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">Email Verification</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Verify your email to complete registration
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Verification Error</h3>
                    <p className="text-red-700 text-sm">Something went wrong</p>
                  </div>
                </div>
                <p className="text-red-800 text-sm mb-6">{error}</p>
                <div className="space-y-3">
                  <Link to="/verify-email" className="block">
                    <Button variant="outline" className="w-full h-12 border-red-300 text-red-700 hover:bg-red-50 font-semibold rounded-lg">
                      Try Again
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Success!</h3>
                    <p className="text-green-700 text-sm">Email verified successfully</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm mb-6">{success}</p>
                <Link to="/login" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            )}

            {!error && !success && (
              <>
                <div className="space-y-4">
                  {!token ? (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-900">No Verification Token</h3>
                          <p className="text-orange-700 text-sm">Missing verification information</p>
                        </div>
                      </div>
                      <p className="text-orange-800 text-sm mb-4">
                        It looks like you don't have a verification token. This usually means:
                      </p>
                      <ul className="text-orange-800 text-sm space-y-1 mb-4">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                          <span>You haven't registered yet</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                          <span>Your verification link has expired</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                          <span>You've already verified your email</span>
                        </li>
                      </ul>
                      <Link to="/login" className="block">
                        <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                          Go to Login
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-900">Check Your Email</h3>
                            <p className="text-blue-700 text-sm">Verification link sent</p>
                          </div>
                        </div>
                        <p className="text-blue-800 text-sm">
                          We've sent a verification link to your email address. 
                          Click the link to verify your account and complete your registration.
                        </p>
                      </div>

                      
                    </>
                  )}
                </div>

                {!error && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-4 text-gray-900">Didn't receive the email?</h3>
                    <form onSubmit={handleResendVerification} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isResending}
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Resend Verification Email
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Already verified?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail; 