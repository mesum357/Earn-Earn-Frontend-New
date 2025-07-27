import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

const NetworkError = ({ 
  onRetry, 
  message = "Unable to connect to the server. This might be due to network issues or server maintenance." 
}: NetworkErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Connection Error</CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Please check:</p>
            <ul className="mt-2 text-left space-y-1">
              <li>• Your internet connection</li>
              <li>• Server status</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
          
          {onRetry && (
            <Button onClick={onRetry} className="w-full" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh Page
          </Button>
          
          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>Frontend: {window.location.origin}</p>
            <p>Backend: {import.meta.env.VITE_API_URL}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkError;
