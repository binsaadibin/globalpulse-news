import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, User, Shield, Mail, Calendar, Eye, EyeOff, RefreshCw } from 'lucide-react';
import CreateUserForm from './CreateUserForm';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

export default function UserManagement() {
  const { toast } = useToast();
  const { getAuthHeaders, currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching users from API...');

      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('✅ Successfully loaded users:', data.users.length);
        setUsers(data.users);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      console.error('❌ Fetch users error:', error);
      
      let errorMessage = 'Failed to load users';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to server';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Access denied: You do not have permission to view users';
      } else if (error.message.includes('404')) {
        errorMessage = 'Admin API endpoint not found. Please ensure the server is running.';
      } else {
        errorMessage = error.message || 'Failed to load users';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });

      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleToggleActivation = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('🔧 Toggling user activation:', userId);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-activation`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: data.isActive } : user
        ));
        
        toast({
          title: 'Success',
          description: data.message
        });
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error: any) {
      console.error('❌ Toggle activation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', userId);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        
        toast({
          title: 'Success',
          description: data.message
        });
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('❌ Delete user error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const handleCreateUserSuccess = () => {
    setShowCreateForm(false);
    fetchUsers();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      {showCreateForm && (
        <CreateUserForm 
          onSuccess={handleCreateUserSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions ({users.length} users)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id} className={`border-l-4 ${
            user.isActive 
              ? 'border-l-green-500 hover:border-l-green-600' 
              : 'border-l-red-500 hover:border-l-red-600'
          } transition-all duration-200 hover:shadow-lg`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </CardDescription>
                    <CardDescription className="truncate">
                      @{user.username}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={getRoleBadgeVariant(user.role)} 
                  className="flex items-center gap-1 capitalize"
                >
                  {getRoleIcon(user.role)}
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status Toggle */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={() => handleToggleActivation(user._id, user.isActive)}
                    disabled={user._id === currentUser?.id}
                  />
                  <span className={`font-medium ${
                    user.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Eye className="h-3 w-3 flex-shrink-0" />
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>
                )}
                {!user.lastLogin && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <EyeOff className="h-3 w-3 flex-shrink-0" />
                    <span>Never logged in</span>
                  </div>
                )}
              </div>

              {/* Permissions */}
              {user.permissions && user.permissions.length > 0 && !user.permissions.includes('all') && (
                <div className="text-sm">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Permissions:</div>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission.replace(':', ' ')}
                      </Badge>
                    ))}
                    {user.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {user.permissions && user.permissions.includes('all') && (
                <div className="text-sm">
                  <Badge variant="default" className="text-xs">
                    All Permissions
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center gap-1"
                  disabled={user._id === currentUser?.id}
                  onClick={() => {
                    toast({
                      title: 'Info',
                      description: 'Edit functionality coming soon'
                    });
                  }}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteUser(user._id, user.username)}
                  disabled={user._id === currentUser?.id}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>

              {/* Current User Indicator */}
              {user._id === currentUser?.id && (
                <div className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
                  This is your account
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first user to the platform
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First User
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {users.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Users</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active Users</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Admins</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {users.filter(u => u.lastLogin).length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Have Logged In</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}