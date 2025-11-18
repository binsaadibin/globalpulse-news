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
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Lock, User, Shield, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
var translations = {
    en: {
        title: 'Welcome Back',
        description: 'Sign in to your GlobalPulse News account',
        username: 'Username',
        password: 'Password',
        login: 'Sign In',
        loggingIn: 'Signing in...',
        invalidCredentials: 'Invalid username or password',
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
        success: 'Success! Redirecting...'
    },
    ar: {
        title: 'مرحباً بعودتك',
        description: 'سجل الدخول إلى حسابك في جلوبال بالس نيوز',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        login: 'تسجيل الدخول',
        loggingIn: 'جاري تسجيل الدخول...',
        invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
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
        success: 'نجاح! جاري التوجيه...'
    },
    ur: {
        title: 'خوش آمدید',
        description: 'اپنے گلوبل پلس نیوز اکاؤنٹ میں سائن ان کریں',
        username: 'صارف نام',
        password: 'پاس ورڈ',
        login: 'سائن ان',
        loggingIn: 'سائن ان ہو رہا ہے...',
        invalidCredentials: 'غلط صارف نام یا پاس ورڈ',
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
        success: 'کامیابی! ری ڈائریکٹ ہو رہا ہے...'
    }
};
export default function Login() {
    var _this = this;
    var _a = useLanguage(), language = _a.language, direction = _a.direction;
    var _b = useAuth(), login = _b.login, loading = _b.loading, error = _b.error, clearError = _b.clearError;
    var _c = useLocation(), setLocation = _c[1];
    var t = translations[language];
    var _d = useState({
        username: '',
        password: '',
        rememberMe: false
    }), formData = _d[0], setFormData = _d[1];
    var _e = useState(false), showPassword = _e[0], setShowPassword = _e[1];
    var _f = useState({}), validationErrors = _f[0], setValidationErrors = _f[1];
    var _g = useState(false), isSubmitting = _g[0], setIsSubmitting = _g[1];
    var _h = useState(false), success = _h[0], setSuccess = _h[1];
    // Clear errors when form changes
    useEffect(function () {
        if (error)
            clearError();
        setValidationErrors({});
    }, [formData.username, formData.password]);
    var validateForm = function () {
        var errors = {};
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        else if (formData.password.length < 6) {
            errors.password = t.passwordRequirements;
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    setSuccess(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, login(formData.username, formData.password)];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setSuccess(true);
                        // Show success message before redirect
                        setTimeout(function () {
                            setLocation('/dashboard');
                        }, 1000);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('Login error:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var fillDemoCredentials = function (type) {
        var credentials = type === 'admin'
            ? { username: 'globalplus', password: 'globalplus@4455' }
            : { username: 'haroonosmani', password: 'haroon@1324' };
        setFormData(function (prev) { return (__assign(__assign({}, prev), credentials)); });
        clearError();
        setValidationErrors({});
    };
    var isLoading = loading || isSubmitting;
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Globe className="h-10 w-10 text-blue-600 dark:text-blue-400"/>
              <div className="absolute -top-1 -right-1">
                <Shield className="h-5 w-5 text-green-500 fill-green-500"/>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GlobalPulse</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure News Platform</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Trusted by journalists and readers worldwide
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.title}
            </CardTitle>
            <CardDescription className="text-base">{t.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {success && (<div className="flex items-center gap-3 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0"/>
                <span>{t.success}</span>
              </div>)}

            {/* Error Message */}
            {error && (<div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0"/>
                <span>{error}</span>
              </div>)}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t.username}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input id="username" type="text" value={formData.username} onChange={function (e) { return handleInputChange('username', e.target.value); }} placeholder="Enter your username" className={cn("pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 transition-all duration-200", validationErrors.username && "border-red-500 focus:border-red-500 focus:ring-red-500")} disabled={isLoading}/>
                </div>
                {validationErrors.username && (<p className="text-sm text-red-600 dark:text-red-400">{validationErrors.username}</p>)}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.password}
                  </Label>
                  <Button type="button" variant="link" className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700">
                    {t.forgotPassword}
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={function (e) { return handleInputChange('password', e.target.value); }} placeholder="Enter your password" className={cn("pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 transition-all duration-200", validationErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-500")} disabled={isLoading}/>
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600" onClick={function () { return setShowPassword(!showPassword); }} disabled={isLoading}>
                    {showPassword ? (<EyeOff className="h-4 w-4"/>) : (<Eye className="h-4 w-4"/>)}
                  </Button>
                </div>
                {validationErrors.password && (<p className="text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>)}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="rememberMe" checked={formData.rememberMe} onChange={function (e) { return handleInputChange('rememberMe', e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled={isLoading}/>
                <Label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400">
                  {t.rememberMe}
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 h-12 transition-all duration-200 shadow-lg hover:shadow-xl" disabled={isLoading}>
                {isLoading ? (<div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t.loggingIn}
                  </div>) : (<div className="flex items-center gap-2">
                    <Shield className="h-4 w-4"/>
                    {t.login}
                  </div>)}
              </Button>
            </form>

            {/* Demo Accounts Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"/>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 font-medium">
                    {t.demoCredentials}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button type="button" variant="outline" className="h-auto py-3 justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20" onClick={function () { return fillDemoCredentials('admin'); }} disabled={isLoading}>
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{t.adminUser}</div>
                      <div className="text-xs text-gray-500 mt-0.5">globalplus / globalplus@4455</div>
                    </div>
                  </div>
                </Button>
                
                <Button type="button" variant="outline" className="h-auto py-3 justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20" onClick={function () { return fillDemoCredentials('editor'); }} disabled={isLoading}>
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{t.editorUser}</div>
                      <div className="text-xs text-gray-500 mt-0.5">haroonosmani / haroon@1324</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3"/>
              <span>{t.securityNote}</span>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.noAccount}{' '}
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                  {t.signUp}
                </Button>
              </div>
              
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {t.backToHome}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);
}
