import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Users, Settings, BarChart3, FileText, Video, Eye, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import UserManagement from '@/components/admin/UserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';

const translations = {
  en: {
    title: 'Admin Panel',
    description: 'Manage your platform and user accounts',
    users: 'Users',
    analytics: 'Analytics',
    settings: 'Settings',
    overview: 'Overview',
    platformStats: 'Platform Statistics',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    totalArticles: 'Total Articles',
    totalVideos: 'Total Videos',
    totalViews: 'Total Views',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    manageUsers: 'Manage Users',
    viewAnalytics: 'View Analytics',
    systemSettings: 'System Settings',
    backToDashboard: 'Back to Dashboard',
    adminOnly: 'Admin Only',
    welcomeAdmin: 'Welcome, Administrator',
    platformOverview: 'Platform Overview',
    userManagement: 'User Management',
    contentManagement: 'Content Management',
    systemManagement: 'System Management'
  },
  ar: {
    title: 'لوحة الإدارة',
    description: 'إدارة منصتك وحسابات المستخدمين',
    users: 'المستخدمين',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    overview: 'نظرة عامة',
    platformStats: 'إحصائيات المنصة',
    totalUsers: 'إجمالي المستخدمين',
    activeUsers: 'المستخدمين النشطين',
    totalArticles: 'إجمالي المقالات',
    totalVideos: 'إجمالي الفيديوهات',
    totalViews: 'إجمالي المشاهدات',
    recentActivity: 'النشاط الحديث',
    quickActions: 'إجراءات سريعة',
    manageUsers: 'إدارة المستخدمين',
    viewAnalytics: 'عرض التحليلات',
    systemSettings: 'إعدادات النظام',
    backToDashboard: 'العودة للوحة التحكم',
    adminOnly: 'للمسؤولين فقط',
    welcomeAdmin: 'مرحباً، المسؤول',
    platformOverview: 'نظرة عامة على المنصة',
    userManagement: 'إدارة المستخدمين',
    contentManagement: 'إدارة المحتوى',
    systemManagement: 'إدارة النظام'
  },
  ur: {
    title: 'ایڈمن پینل',
    description: 'اپنے پلیٹ فارم اور صارف اکاؤنٹس کا انتظام کریں',
    users: 'صارفین',
    analytics: 'تجزیات',
    settings: 'ترتیبات',
    overview: 'جائزہ',
    platformStats: 'پلیٹ فارم کے اعداد و شمار',
    totalUsers: 'کل صارفین',
    activeUsers: 'فعال صارفین',
    totalArticles: 'کل مضامین',
    totalVideos: 'کل ویڈیوز',
    totalViews: 'کل ویوز',
    recentActivity: 'حالیہ سرگرمی',
    quickActions: 'فوری اقدامات',
    manageUsers: 'صارفین کا انتظام',
    viewAnalytics: 'تجزیات دیکھیں',
    systemSettings: 'سسٹم کی ترتیبات',
    backToDashboard: 'ڈیش بورڈ پر واپس جائیں',
    adminOnly: 'صرف ایڈمن کے لیے',
    welcomeAdmin: 'خوش آمدید، ایڈمنسٹریٹر',
    platformOverview: 'پلیٹ فارم کا جائزہ',
    userManagement: 'صارفین کا انتظام',
    contentManagement: 'مواد کا انتظام',
    systemManagement: 'سسٹم مینجمنٹ'
  }
};

// Mock data for demonstration - in real app, fetch from API
const mockStats = {
  totalUsers: 15,
  activeUsers: 12,
  totalArticles: 47,
  totalVideos: 23,
  totalViews: 15420,
  recentLogins: 8
};

const recentActivities = [
  { id: 1, user: 'globalplus', action: 'logged in', time: '2 minutes ago', type: 'login' },
  { id: 2, user: 'haroonosmani', action: 'created new article', time: '15 minutes ago', type: 'create' },
  { id: 3, user: 'globalnews', action: 'updated user permissions', time: '1 hour ago', type: 'update' },
  { id: 4, user: 'editor1', action: 'uploaded new video', time: '2 hours ago', type: 'upload' },
  { id: 5, user: 'globalplus', action: 'deactivated user account', time: '3 hours ago', type: 'deactivate' }
];

export default function Admin() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const t = translations[language as keyof typeof translations];
  const [stats, setStats] = useState(mockStats);

  // In a real app, you would fetch these stats from your API
  useEffect(() => {
    // fetchAdminStats().then(setStats);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'create': return <FileText className="h-4 w-4 text-green-500" />;
      case 'update': return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'upload': return <Video className="h-4 w-4 text-purple-500" />;
      case 'deactivate': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'create': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'update': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'upload': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'deactivate': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t.backToDashboard}
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t.welcomeAdmin}, <strong>{currentUser?.username}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <Badge variant="default" className="px-3 py-1 text-sm">
                <Shield className="h-3 w-3 mr-1" />
                {t.adminOnly}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {t.description}
            </p>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t.overview}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.users}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t.analytics}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t.settings}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Platform Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                      <p className="text-blue-100 text-sm font-medium">{t.totalUsers}</p>
                      <p className="text-xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Eye className="h-6 w-6 mx-auto mb-2 text-green-200" />
                      <p className="text-green-100 text-sm font-medium">{t.activeUsers}</p>
                      <p className="text-xl font-bold">{stats.activeUsers}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2 text-purple-200" />
                      <p className="text-purple-100 text-sm font-medium">{t.totalArticles}</p>
                      <p className="text-xl font-bold">{stats.totalArticles}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Video className="h-6 w-6 mx-auto mb-2 text-orange-200" />
                      <p className="text-orange-100 text-sm font-medium">{t.totalVideos}</p>
                      <p className="text-xl font-bold">{stats.totalVideos}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-red-200" />
                      <p className="text-red-100 text-sm font-medium">{t.totalViews}</p>
                      <p className="text-xl font-bold">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <BarChart3 className="h-6 w-6 mx-auto mb-2 text-indigo-200" />
                      <p className="text-indigo-100 text-sm font-medium">Recent Logins</p>
                      <p className="text-xl font-bold">{stats.recentLogins}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {t.recentActivity}
                    </CardTitle>
                    <CardDescription>
                      Latest activities across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div 
                          key={activity.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              <strong>{activity.user}</strong> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {t.quickActions}
                    </CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <Link href="/admin#users">
                        <Button 
                          variant="outline" 
                          className="w-full h-16 justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                              <div className="font-medium">{t.manageUsers}</div>
                              <div className="text-xs text-gray-500">Add, edit, or remove users</div>
                            </div>
                          </div>
                        </Button>
                      </Link>

                      <Link href="/admin#analytics">
                        <Button 
                          variant="outline" 
                          className="w-full h-16 justify-start border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <div>
                              <div className="font-medium">{t.viewAnalytics}</div>
                              <div className="text-xs text-gray-500">Platform performance metrics</div>
                            </div>
                          </div>
                        </Button>
                      </Link>

                      <Link href="/admin#settings">
                        <Button 
                          variant="outline" 
                          className="w-full h-16 justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <div>
                              <div className="font-medium">{t.systemSettings}</div>
                              <div className="text-xs text-gray-500">Configure platform settings</div>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Management Areas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Users className="h-5 w-5" />
                      {t.userManagement}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Manage user accounts, roles, and permissions across the platform.
                    </p>
                    <Link href="/admin#users">
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Users
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <FileText className="h-5 w-5" />
                      {t.contentManagement}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Oversee all articles, videos, and media content on the platform.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Content
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Settings className="h-5 w-5" />
                      {t.systemManagement}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Configure system settings, backups, and platform configuration.
                    </p>
                    <Link href="/admin#settings">
                      <Button variant="outline" size="sm" className="w-full">
                        System Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Analytics
                  </CardTitle>
                  <CardDescription>
                    Detailed analytics and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Advanced analytics features are coming soon. This section will include detailed charts, 
                      user engagement metrics, and content performance analysis.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">87%</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">User Engagement</div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.4K</div>
                        <div className="text-sm text-green-600 dark:text-green-400">Daily Views</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure platform-wide settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      System Configuration
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      System settings and configuration panel will be available in the next update. 
                      This will include platform customization, security settings, and integration options.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}