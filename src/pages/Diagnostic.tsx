import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { runAuthDiagnostic, checkBackendHealth, checkAuthStatus } from '@/lib/health-check';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Server, User, Globe, Cookie, ShieldAlert } from 'lucide-react';
import api from '@/lib/axios';

const Diagnostic = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [cookies, setCookies] = useState<string[]>([]);

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie.split(';').map(c => c.trim()));
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await runAuthDiagnostic();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    try {
      const healthResult = await checkBackendHealth();
      setResults(prev => ({ ...prev, health: healthResult, timestamp: new Date().toISOString() }));
    } catch (error) {
      console.error('Error checking health:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const authResult = await checkAuthStatus();
      setResults(prev => ({ ...prev, auth: authResult, timestamp: new Date().toISOString() }));
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'online' || status === 'authenticated' || status === 'success') {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
    } else if (status === 'partial' || status === 'checking') {
      return <Badge className="bg-yellow-500">{status}</Badge>;
    } else {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Authentication System Diagnostic</CardTitle>
              <CardDescription>
                Use this tool to diagnose authentication issues with the backend
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runDiagnostics} disabled={loading}>
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Run Full Diagnostic
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Server className="mr-2 h-5 w-5" /> Backend Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results?.health ? (
                      <>
                        <div className="mb-2">{getStatusBadge(results.health.status)}</div>
                        <p className="text-sm text-muted-foreground">{results.health.message}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={checkHealth}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" /> Check Again
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={checkHealth}
                      >
                        Check Backend
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5" /> Authentication Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results?.auth ? (
                      <>
                        <div className="mb-2">{getStatusBadge(results.auth.status)}</div>
                        <p className="text-sm text-muted-foreground">{results.auth.message || (results.auth.status === 'authenticated' ? 'Successfully authenticated' : 'Not authenticated')}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={checkAuth}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" /> Check Again
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={checkAuth}
                      >
                        Check Auth
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="mr-2 h-5 w-5" /> CORS Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results?.cors ? (
                      <>
                        <div className="mb-2">{getStatusBadge(results.cors.status)}</div>
                        <p className="text-sm text-muted-foreground">{results.cors.message}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Run the diagnostic to check CORS configuration</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShieldAlert className="mr-2 h-5 w-5" /> Current User Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-2">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>ID:</strong> {user._id}</p>
                        <Badge className="bg-green-500 mt-2">Logged In</Badge>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground">No user currently logged in</p>
                        <Badge variant="outline" className="mt-2">Logged Out</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Connection Tab */}
            <TabsContent value="connection">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Details</CardTitle>
                  <CardDescription>Information about your connection to the backend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">API Configuration</h3>
                      <div className="bg-muted p-3 rounded-md">
                        <p><strong>Base URL:</strong> {api.defaults.baseURL}</p>
                        <p><strong>withCredentials:</strong> {api.defaults.withCredentials ? 'true' : 'false'}</p>
                        <p><strong>Origin:</strong> {window.location.origin}</p>
                      </div>
                    </div>

                    {results?.health && (
                      <div>
                        <h3 className="font-medium mb-2">Backend Health</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <p><strong>Status:</strong> {results.health.status}</p>
                          <p><strong>Message:</strong> {results.health.message}</p>
                          {results.health.error && (
                            <div className="mt-2">
                              <p><strong>Error:</strong> {results.health.error.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {results?.cors && (
                      <div>
                        <h3 className="font-medium mb-2">CORS Configuration</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <p><strong>Status:</strong> {results.cors.status}</p>
                          <p><strong>Allow-Origin:</strong> {results.cors.headers?.allowOrigin || 'Not set'}</p>
                          <p><strong>Allow-Credentials:</strong> {results.cors.headers?.allowCredentials || 'Not set'}</p>
                          <p><strong>Allow-Methods:</strong> {results.cors.headers?.allowMethods || 'Not set'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Authentication Tab */}
            <TabsContent value="auth">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Details</CardTitle>
                  <CardDescription>Information about your authentication status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results?.auth && (
                      <div>
                        <h3 className="font-medium mb-2">Authentication Check</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <p><strong>Status:</strong> {results.auth.status}</p>
                          <p><strong>Message:</strong> {results.auth.message || 'No message'}</p>
                          {results.auth.user ? (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                              <p><strong>User:</strong> {results.auth.user.username}</p>
                              <p><strong>Email:</strong> {results.auth.user.email}</p>
                            </div>
                          ) : (
                            <p className="mt-2 text-yellow-600">No user data available</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium mb-2">Context User</h3>
                      <div className="bg-muted p-3 rounded-md">
                        {user ? (
                          <>
                            <p><strong>ID:</strong> {user._id}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                          </>
                        ) : (
                          <p>No user in context (not logged in)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cookies Tab */}
            <TabsContent value="cookies">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cookie className="mr-2 h-5 w-5" /> Browser Cookies
                  </CardTitle>
                  <CardDescription>
                    Cookies currently stored in your browser (may include session cookies)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cookies.length > 0 ? (
                    <div className="bg-muted p-3 rounded-md">
                      <ul className="space-y-1">
                        {cookies.map((cookie, index) => (
                          <li key={index} className="font-mono text-sm">{cookie}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No cookies found</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Note: HttpOnly cookies (commonly used for authentication) cannot be accessed by JavaScript and won't appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Diagnostic Data</CardTitle>
                  <CardDescription>
                    Complete diagnostic results for debugging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results ? (
                    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground">Run the diagnostic to see detailed results</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {results && (
            <div className="mt-4 text-xs text-muted-foreground">
              Last updated: {new Date(results.timestamp).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Diagnostic;
