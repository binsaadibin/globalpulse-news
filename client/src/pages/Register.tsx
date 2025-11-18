import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
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

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const t = translations[language as keyof typeof translations];
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsDontMatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.passwordRequirements);
      return;
    }

    if (!formData.email.includes('@')) {
      setError(t.invalidEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          setLocation('/login');
        }, 3000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error: any) {
      setError(t.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-6 relative">
            <Button
              variant="ghost"
              className="absolute left-4 top-4"
              onClick={() => setLocation('/login')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToLogin}
            </Button>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.title}
            </CardTitle>
            <CardDescription className="text-base">{t.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success && (
              <div className="flex items-center gap-3 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{t.success}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t.firstName}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t.lastName}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t.username}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      className="pl-10"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.registering : t.register}
                </Button>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3" />
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
    </div>
  );
}