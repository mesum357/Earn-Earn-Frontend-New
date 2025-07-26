import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NetworkError from '@/components/NetworkError';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, networkError, checkAuth, retryConnection } = useAuth();
  const location = useLocation();

  // Re-verify authentication when component mounts
  useEffect(() => {
    console.log('ProtectedRoute: Verifying authentication status');
    checkAuth();
  }, [checkAuth]);

  // Show network error if there's a connectivity issue
  if (networkError && !loading) {
    return (
      <NetworkError 
        onRetry={retryConnection}
        message="Cannot connect to the authentication server. Please check your connection and try again."
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    
    // Use useEffect to handle redirect after delay
    useEffect(() => {
      const redirectTimer = setTimeout(() => {
        window.location.href = `/login?returnTo=${encodeURIComponent(location.pathname)}`;
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }, [location.pathname]);
    
    // Show brief explanation with alert
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="mb-4 bg-yellow-50 border-yellow-300">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You need to be logged in to access this page. Redirecting you to login...
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
