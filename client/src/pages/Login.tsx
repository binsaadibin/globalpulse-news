import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle2, Globe, Ban, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  en: {
    title: 'Welcome Back',
    description: 'Sign in to your GlobalPulse News account',
    username: 'Username',
    password: 'Password',
    login: 'Sign In',
    loggingIn: 'Signing in...',
    invalidCredentials: 'Invalid username or password',
    accountDeactivated: 'Account is deactivated. Please contact administrator.',
    loginSuccess: 'Welcome back!',
    backToHome: 'Back to Home',
    or: 'or continue with',
    demoCredentials: 'Demo Accounts',
    adminUser: 'Administrator',
    editorUser: 'Content Editor',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    securityNote: 'Your credentials are securely encrypted',
    loading: 'Checking authentication...',
    networkError: 'Network error. Please try again.',
    passwordRequirements: 'Password must be at least 6 characters',
    success: 'Success! Redirecting...',
    contactAdmin: 'Contact Administrator',
    loginToContinue: 'Login to continue to your dashboard',
    secureAccess: 'Secure access to your news platform'
  },
  ar: {
    title: 'مرحباً بعودتك',
    description: 'سجل الدخول إلى حسابك في جلوبال بالس نيوز',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    accountDeactivated: 'الحساب معطل. يرجى الاتصال بالمسؤول.',
    loginSuccess: 'مرحباً بعودتك!',
    backToHome: 'العودة إلى الرئيسية',
    or: 'أو تابع باستخدام',
    demoCredentials: 'حسابات تجريبية',
    adminUser: 'مدير النظام',
    editorUser: 'محرر المحتوى',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: 'ليس لديك حساب؟',
    signUp: 'إنشاء حساب',
    securityNote: 'بيانات الاعتماد الخاصة بك مشفرة بأمان',
    loading: 'جاري التحقق من المصادقة...',
    networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    passwordRequirements: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    success: 'نجاح! جاري التوجيه...',
    contactAdmin: 'اتصل بالمسؤول',
    loginToContinue: 'سجل الدخول للمتابعة إلى لوحة التحكم',
    secureAccess: 'وصول آمن إلى منصة الأخبار الخاصة بك'
  },
  ur: {
    title: 'خوش آمدید',
    description: 'اپنے گلوبل پلس نیوز اکاؤنٹ میں سائن ان کریں',
    username: 'صارف نام',
    password: 'پاس ورڈ',
    login: 'سائن ان',
    loggingIn: 'سائن ان ہو رہا ہے...',
    invalidCredentials: 'غلط صارف نام یا پاس ورڈ',
    accountDeactivated: 'اکاؤنٹ غیر فعال ہے۔ براہ کرم ایڈمنسٹریٹر سے رابطہ کریں۔',
    loginSuccess: 'خوش آمدید!',
    backToHome: 'ہوم پر واپس جائیں',
    or: 'یا جاری رکھیں',
    demoCredentials: 'ڈیمو اکاؤنٹس',
    adminUser: 'ایڈمنسٹریٹر',
    editorUser: 'کنٹینٹ ایڈیٹر',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    rememberMe: 'مجھے یاد رکھیں',
    noAccount: 'اکاؤنٹ نہیں ہے؟',
    signUp: 'سائن اپ',
    securityNote: 'آپ کی credentials محفوظ طریقے سے انکرپٹ کی گئی ہیں',
    loading: 'تصدیق کی جا رہی ہے...',
    networkError: 'نیٹ ورک خرابی۔ براہ کرم دوبارہ کوشش کریں۔',
    passwordRequirements: 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے',
    success: 'کامیابی! ری ڈائریکٹ ہو رہا ہے...',
    contactAdmin: 'ایڈمنسٹریٹر سے رابطہ کریں',
    loginToContinue: 'اپنے ڈیش بورڈ پر جانے کے لیے لاگ ان کریں',
    secureAccess: 'آپ کی نیوز پلیٹ فارم تک محفوظ رسائی'
  }
};

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

export default function Login() {
  const { language, direction } = useLanguage();
  const { login, loading, error, clearError } = useAuth();
  const [, setLocation] = useLocation();
  const t = translations[language as keyof typeof translations];
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Clear errors when form changes
  useEffect(() => {
    if (error) clearError();
    setValidationErrors({});
  }, [formData.username, formData.password]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = t.passwordRequirements;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        setSuccess(true);
        // Show success message before redirect
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fillDemoCredentials = (type: 'admin' | 'editor') => {
    const credentials = type === 'admin' 
      ? { username: 'globalplus', password: 'globalplus@4455' }
      : { username: 'haroonosmani', password: 'haroon@1324' };
    
    setFormData(prev => ({
      ...prev,
      ...credentials
    }));
    clearError();
    setValidationErrors({});
  };

  const isLoading = loading || isSubmitting;

  // Check if error is account deactivation
  const isAccountDeactivated = error?.toLowerCase().includes('deactivated') || 
                              error?.toLowerCase().includes('inactive');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
              <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 relative z-10" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GlobalPulse
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.secureAccess}</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg py-2 px-4">
            {t.loginToContinue}
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <CardHeader className="text-center space-y-2 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6 text-blue-600" />
              {t.title}
            </CardTitle>
            <CardDescription className="text-base">{t.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 animate-in fade-in duration-300">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{t.success}</span>
                  <div className="text-xs mt-1 opacity-75">{t.loginSuccess}</div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`flex items-start gap-3 p-4 text-sm rounded-lg border animate-in fade-in duration-300 ${
                isAccountDeactivated 
                  ? 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800'
              }`}>
                {isAccountDeactivated ? (
                  <Ban className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className="font-medium">{error}</span>
                  {isAccountDeactivated && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
                        onClick={() => {
                          window.location.href = 'mailto:admin@globalpulse.com?subject=Account%20Deactivation%20Request&body=Hello,%20my%20account%20has%20been%20deactivated.%20Please%20reactivate%20it.';
                        }}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        {t.contactAdmin}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.username}
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter your username"
                    className={cn(
                      "pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 transition-all duration-200",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      validationErrors.username && "border-red-500 focus:border-red-500 focus:ring-red-500",
                      error && "border-red-300 dark:border-red-700"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-in fade-in">{validationErrors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.password}
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {t.forgotPassword}
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={cn(
                      "pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 transition-all duration-200",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      validationErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-500",
                      error && "border-red-300 dark:border-red-700"
                    )}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-in fade-in">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  {t.rememberMe}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 h-12 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t.loggingIn}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <span className="text-base">{t.login}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Accounts Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 font-medium">
                    {t.demoCredentials}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto py-4 justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 transition-all duration-200"
                  onClick={() => fillDemoCredentials('admin')}
                  disabled={isLoading}
                >
                  <div className="flex items-start gap-3 text-left w-full">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{t.adminUser}</div>
                      <div className="text-xs text-gray-500 mt-1">globalplus / globalplus@4455</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto py-4 justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20 transition-all duration-200"
                  onClick={() => fillDemoCredentials('editor')}
                  disabled={isLoading}
                >
                  <div className="flex items-start gap-3 text-left w-full">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{t.editorUser}</div>
                      <div className="text-xs text-gray-500 mt-1">haroonosmani / haroon@1324</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <Shield className="h-3 w-3 text-green-500" />
              <span>{t.securityNote}</span>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-4 pt-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.noAccount}{' '}
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  {t.signUp}
                </Button>
              </div>
              
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
                  <span className="flex items-center gap-2">
                    ← {t.backToHome}
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}