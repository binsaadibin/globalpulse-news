import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

const translations = {
  en: {
    title: 'Admin Login',
    description: 'Sign in to access the dashboard',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    error: 'Invalid credentials',
    success: 'Login successful!',
  },
  ar: {
    title: 'تسجيل دخول المسؤول',
    description: 'قم بتسجيل الدخول للوصول إلى لوحة التحكم',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    error: 'بيانات اعتماد غير صالحة',
    success: 'تم تسجيل الدخول بنجاح!',
  },
  ur: {
    title: 'ایڈمن لاگ ان',
    description: 'ڈیش بورڈ تک رسائی کے لیے سائن ان کریں',
    username: 'صارف نام',
    password: 'پاس ورڈ',
    login: 'لاگ ان',
    error: 'غلط اسناد',
    success: 'کامیابی سے لاگ ان ہوگئے!',
  },
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => { // ← Added async
    e.preventDefault();
    const success = await login(username, password); // ← Added await
    
    if (success) {
      toast({
        title: t.success,
        description: `Welcome ${username}`,
      });
      setLocation('/dashboard');
    } else {
      toast({
        title: t.error,
        description: 'Please check your credentials',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t.username}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  placeholder="admin1"
                  required
                  data-testid="input-username"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  data-testid="input-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" data-testid="button-login">
              {t.login}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo: admin1/admin123, admin2/admin456, editor1/editor123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}