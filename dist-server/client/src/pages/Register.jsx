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
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
var translations = {
    en: {
        title: 'Create Account',
        description: 'Join GlobalPulse News platform',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        register: 'Create Account',
        registering: 'Creating Account...',
        success: 'Registration successful! Waiting for admin approval.',
        backToLogin: 'Back to Login',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign in',
        securityNote: 'Your information is securely encrypted',
        networkError: 'Network error. Please try again.',
        passwordRequirements: 'Password must be at least 6 characters',
        passwordsDontMatch: 'Passwords do not match',
        invalidEmail: 'Please enter a valid email address'
    },
    ar: {
        title: 'إنشاء حساب',
        description: 'انضم إلى منصة جلوبال بالس نيوز',
        firstName: 'الاسم الأول',
        lastName: 'الاسم الأخير',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        register: 'إنشاء حساب',
        registering: 'جاري إنشاء الحساب...',
        success: 'تم التسجيل بنجاح! في انتظار موافقة المسؤول.',
        backToLogin: 'العودة إلى تسجيل الدخول',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول',
        securityNote: 'معلوماتك مشفرة بأمان',
        networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
        passwordRequirements: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        passwordsDontMatch: 'كلمات المرور غير متطابقة',
        invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح'
    },
    ur: {
        title: 'اکاؤنٹ بنائیں',
        description: 'گلوبل پلس نیوز پلیٹ فارم میں شامل ہوں',
        firstName: 'پہلا نام',
        lastName: 'آخری نام',
        username: 'صارف نام',
        email: 'ای میل',
        password: 'پاس ورڈ',
        confirmPassword: 'پاس ورڈ کی تصدیق کریں',
        register: 'اکاؤنٹ بنائیں',
        registering: 'اکاؤنٹ بن رہا ہے...',
        success: 'رجسٹریشن کامیاب! ایڈمن کی منظوری کا انتظار ہے۔',
        backToLogin: 'لاگ ان پر واپس جائیں',
        alreadyHaveAccount: 'پہلے سے ہی اکاؤنٹ ہے؟',
        signIn: 'سائن ان',
        securityNote: 'آپ کی معلومات محفوظ طریقے سے انکرپٹ کی گئی ہیں',
        networkError: 'نیٹ ورک خرابی۔ براہ کرم دوبارہ کوشش کریں۔',
        passwordRequirements: 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے',
        passwordsDontMatch: 'پاس ورڈ مماثل نہیں ہیں',
        invalidEmail: 'براہ کرم درست ای میل ایڈریس درج کریں'
    }
};
export default function Register() {
    var _this = this;
    var language = useLanguage().language;
    var _a = useLocation(), setLocation = _a[1];
    var t = translations[language];
    var _b = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = useState(false), showConfirmPassword = _d[0], setShowConfirmPassword = _d[1];
    var _e = useState(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var _f = useState(false), success = _f[0], setSuccess = _f[1];
    var _g = useState(null), error = _g[0], setError = _g[1];
    var API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    // Validation
                    if (formData.password !== formData.confirmPassword) {
                        setError(t.passwordsDontMatch);
                        return [2 /*return*/];
                    }
                    if (formData.password.length < 6) {
                        setError(t.passwordRequirements);
                        return [2 /*return*/];
                    }
                    if (!formData.email.includes('@')) {
                        setError(t.invalidEmail);
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/auth/register"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                username: formData.username,
                                email: formData.email,
                                password: formData.password
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok && data.success) {
                        setSuccess(true);
                        setTimeout(function () {
                            setLocation('/login');
                        }, 3000);
                    }
                    else {
                        setError(data.message || 'Registration failed');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    setError(t.networkError);
                    return [3 /*break*/, 6];
                case 5:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        setError(null);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-6 relative">
            <Button variant="ghost" className="absolute left-4 top-4" onClick={function () { return setLocation('/login'); }}>
              <ArrowLeft className="h-4 w-4 mr-2"/>
              {t.backToLogin}
            </Button>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.title}
            </CardTitle>
            <CardDescription className="text-base">{t.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success && (<div className="flex items-center gap-3 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0"/>
                <span>{t.success}</span>
              </div>)}

            {error && (<div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0"/>
                <span>{error}</span>
              </div>)}

            {!success && (<form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t.firstName}</Label>
                    <Input id="firstName" value={formData.firstName} onChange={function (e) { return handleInputChange('firstName', e.target.value); }} required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t.lastName}</Label>
                    <Input id="lastName" value={formData.lastName} onChange={function (e) { return handleInputChange('lastName', e.target.value); }} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t.username}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input id="username" className="pl-10" value={formData.username} onChange={function (e) { return handleInputChange('username', e.target.value); }} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input id="email" type="email" className="pl-10" value={formData.email} onChange={function (e) { return handleInputChange('email', e.target.value); }} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input id="password" type={showPassword ? 'text' : 'password'} className="pl-10 pr-10" value={formData.password} onChange={function (e) { return handleInputChange('password', e.target.value); }} required/>
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={function () { return setShowPassword(!showPassword); }}>
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className="pl-10 pr-10" value={formData.confirmPassword} onChange={function (e) { return handleInputChange('confirmPassword', e.target.value); }} required/>
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={function () { return setShowConfirmPassword(!showConfirmPassword); }}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t.registering : t.register}
                </Button>
              </form>)}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3"/>
              <span>{t.securityNote}</span>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t.alreadyHaveAccount}{' '}
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto">
                  {t.signIn}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);
}
