var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, User, Shield, Mail, Calendar, Eye, EyeOff, RefreshCw } from 'lucide-react';
import CreateUserForm from './CreateUserForm';
var API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
export default function UserManagement() {
    var _this = this;
    var toast = useToast().toast;
    var _a = useAuth(), getAuthHeaders = _a.getAuthHeaders, currentUser = _a.currentUser;
    var _b = useState([]), users = _b[0], setUsers = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), showCreateForm = _d[0], setShowCreateForm = _d[1];
    var _e = useState(false), refreshing = _e[0], setRefreshing = _e[1];
    useEffect(function () {
        fetchUsers();
    }, []);
    var fetchUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    console.log('📋 Fetching users from API...');
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/admin/users"), {
                            headers: getAuthHeaders()
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.success) {
                        console.log('✅ Successfully loaded users:', data.users.length);
                        setUsers(data.users);
                    }
                    else {
                        throw new Error(data.message || 'Failed to fetch users');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Fetch users error:', error_1);
                    errorMessage = 'Failed to load users';
                    if (error_1.message.includes('Failed to fetch')) {
                        errorMessage = 'Network error: Unable to connect to server';
                    }
                    else if (error_1.message.includes('401') || error_1.message.includes('403')) {
                        errorMessage = 'Access denied: You do not have permission to view users';
                    }
                    else if (error_1.message.includes('404')) {
                        errorMessage = 'Admin API endpoint not found. Please ensure the server is running.';
                    }
                    else {
                        errorMessage = error_1.message || 'Failed to load users';
                    }
                    toast({
                        title: 'Error',
                        description: errorMessage,
                        variant: 'destructive'
                    });
                    setUsers([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRefresh = function () {
        setRefreshing(true);
        fetchUsers();
    };
    var handleToggleActivation = function (userId, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var response, data_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('🔧 Toggling user activation:', userId);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/admin/users/").concat(userId, "/toggle-activation"), {
                            method: 'PATCH',
                            headers: getAuthHeaders()
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data_1 = _a.sent();
                    if (data_1.success) {
                        setUsers(users.map(function (user) {
                            return user._id === userId ? __assign(__assign({}, user), { isActive: data_1.isActive }) : user;
                        }));
                        toast({
                            title: 'Success',
                            description: data_1.message
                        });
                    }
                    else {
                        throw new Error(data_1.message || 'Failed to update user');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Toggle activation error:', error_2);
                    toast({
                        title: 'Error',
                        description: error_2.message || 'Failed to update user status',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteUser = function (userId, username) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete user \"".concat(username, "\"? This action cannot be undone."))) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    console.log('🗑️ Deleting user:', userId);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/admin/users/").concat(userId), {
                            method: 'DELETE',
                            headers: getAuthHeaders()
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        setUsers(users.filter(function (user) { return user._id !== userId; }));
                        toast({
                            title: 'Success',
                            description: data.message
                        });
                    }
                    else {
                        throw new Error(data.message || 'Failed to delete user');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('❌ Delete user error:', error_3);
                    toast({
                        title: 'Error',
                        description: error_3.message || 'Failed to delete user',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateUserSuccess = function () {
        setShowCreateForm(false);
        fetchUsers();
    };
    var getRoleBadgeVariant = function (role) {
        switch (role) {
            case 'admin': return 'default';
            case 'editor': return 'secondary';
            case 'viewer': return 'outline';
            default: return 'outline';
        }
    };
    var getRoleIcon = function (role) {
        return role === 'admin' ? <Shield className="h-3 w-3"/> : <User className="h-3 w-3"/>;
    };
    if (loading) {
        return (<div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading users...</div>
        </div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Create User Form */}
      {showCreateForm && (<CreateUserForm onSuccess={handleCreateUserSuccess} onCancel={function () { return setShowCreateForm(false); }}/>)}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions ({users.length} users)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
            <RefreshCw className={"h-4 w-4 ".concat(refreshing ? 'animate-spin' : '')}/>
            Refresh
          </Button>
          <Button onClick={function () { return setShowCreateForm(true); }} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            Add User
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(function (user) { return (<Card key={user._id} className={"border-l-4 ".concat(user.isActive
                ? 'border-l-green-500 hover:border-l-green-600'
                : 'border-l-red-500 hover:border-l-red-600', " transition-all duration-200 hover:shadow-lg")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={"p-2 rounded-full ".concat(user.role === 'admin'
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'bg-purple-100 dark:bg-purple-900')}>
                    {user.role === 'admin' ? (<Shield className="h-4 w-4 text-blue-600 dark:text-blue-400"/>) : (<User className="h-4 w-4 text-purple-600 dark:text-purple-400"/>)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0"/>
                      <span className="truncate">{user.email}</span>
                    </CardDescription>
                    <CardDescription className="truncate">
                      @{user.username}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 capitalize">
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
                  <Switch checked={user.isActive} onCheckedChange={function () { return handleToggleActivation(user._id, user.isActive); }} disabled={user._id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)}/>
                  <span className={"font-medium ".concat(user.isActive ? 'text-green-600' : 'text-red-600')}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3 w-3 flex-shrink-0"/>
                  <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.lastLogin && (<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Eye className="h-3 w-3 flex-shrink-0"/>
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>)}
                {!user.lastLogin && (<div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <EyeOff className="h-3 w-3 flex-shrink-0"/>
                    <span>Never logged in</span>
                  </div>)}
              </div>

              {/* Permissions */}
              {user.permissions && user.permissions.length > 0 && !user.permissions.includes('all') && (<div className="text-sm">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Permissions:</div>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map(function (permission, index) { return (<Badge key={index} variant="outline" className="text-xs">
                        {permission.replace(':', ' ')}
                      </Badge>); })}
                    {user.permissions.length > 3 && (<Badge variant="outline" className="text-xs">
                        +{user.permissions.length - 3} more
                      </Badge>)}
                  </div>
                </div>)}

              {user.permissions && user.permissions.includes('all') && (<div className="text-sm">
                  <Badge variant="default" className="text-xs">
                    All Permissions
                  </Badge>
                </div>)}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1" disabled={user._id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)} onClick={function () {
                toast({
                    title: 'Info',
                    description: 'Edit functionality coming soon'
                });
            }}>
                  <Edit className="h-3 w-3"/>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={function () { return handleDeleteUser(user._id, user.username); }} disabled={user._id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)}>
                  <Trash2 className="h-3 w-3"/>
                  Delete
                </Button>
              </div>

              {/* Current User Indicator */}
              {user._id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) && (<div className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
                  This is your account
                </div>)}
            </CardContent>
          </Card>); })}
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && (<Card>
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first user to the platform
            </p>
            <Button onClick={function () { return setShowCreateForm(true); }}>
              <Plus className="h-4 w-4 mr-2"/>
              Add Your First User
            </Button>
          </CardContent>
        </Card>)}

      {/* Stats Summary */}
      {users.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
                {users.filter(function (u) { return u.isActive; }).length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active Users</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {users.filter(function (u) { return u.role === 'admin'; }).length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Admins</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {users.filter(function (u) { return u.lastLogin; }).length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Have Logged In</div>
            </CardContent>
          </Card>
        </div>)}
    </div>);
}
