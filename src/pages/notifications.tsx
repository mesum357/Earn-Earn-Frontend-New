import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertCircle, Info, Gift, Clock, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  recipientType: string;
  createdAt: string;
  read?: boolean;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app';
      console.log('Fetching notifications from:', apiUrl);
      
      const response = await axios.get(
        `${apiUrl}/api/user/notifications`,
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('Notifications response:', response.data);
      
      if (response.data.success) {
        const enrichedNotifications = response.data.notifications.map((n: Notification) => ({
          ...n,
          read: n.read || false
        }));
        setNotifications(enrichedNotifications);
      } else {
        console.error('API returned success: false');
        setError('Failed to load notifications');
        setNotifications([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        console.log('Authentication error, redirecting to login');
        navigate('/login');
        return;
      }
      
      // Set error message for display
      if (error.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load notifications. Please try again.');
      }
      
      // For other errors, show empty state but don't keep loading
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('User found, fetching notifications');
    fetchNotifications();
  }, [user]); // Remove fetchNotifications from dependencies to prevent infinite loop

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app'}/api/user/notifications/${notificationId}/read`,
        {},
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app'}/api/user/notifications/read-all`,
        {},
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'promotion':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'referral_bonus':
        return <Gift className="h-5 w-5 text-green-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      general: "bg-blue-50 text-blue-700 border-blue-200",
      promotion: "bg-purple-50 text-purple-700 border-purple-200",
      system: "bg-orange-50 text-orange-700 border-orange-200",
      warning: "bg-red-50 text-red-700 border-red-200",
      referral_bonus: "bg-green-50 text-green-700 border-green-200",
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || colors.general}>
        {type}
      </Badge>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="mt-2 text-gray-600">Stay updated with the latest news and updates</p>
              </div>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Read</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{readCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({readCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {error ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Error Loading Notifications
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      {error}
                    </p>
                    <Button onClick={fetchNotifications} variant="outline">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'all' ? 'No notifications yet' : 
                       activeTab === 'unread' ? 'No unread notifications' : 
                       'No read notifications'}
                    </h3>
                    <p className="text-gray-500 text-center">
                      {activeTab === 'all' ? 'You\'ll see notifications here when they arrive' :
                       activeTab === 'unread' ? 'All caught up! No unread notifications' :
                       'No notifications have been marked as read yet'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification._id} 
                      className={`transition-all duration-200 ${
                        !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className={`text-lg font-medium ${
                                    !notification.read ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{notification.message}</p>
                                <div className="flex items-center space-x-4">
                                  {getTypeBadge(notification.type)}
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {getTimeAgo(notification.createdAt)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification._id)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 