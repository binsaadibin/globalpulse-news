import { Link, useLocation } from 'wouter';
import { Globe, Menu, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import GlobalSearch from './GlobalSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const translations = {
  en: { home: 'Home', videos: 'Videos', dashboard: 'Dashboard', title: 'GlobalPulse News', logout: 'Logout', login: 'Login' },
  ar: { home: 'الرئيسية', videos: 'فيديوهات', dashboard: 'لوحة التحكم', title: 'أخبار جلوبال بالس', logout: 'تسجيل الخروج', login: 'تسجيل الدخول' },
  ur: { home: 'ہوم', videos: 'ویڈیوز', dashboard: 'ڈیش بورڈ', title: 'گلوبل پلس نیوز', logout: 'لاگ آؤٹ', login: 'لاگ ان' },
};

export default function Header() {
  const { language } = useLanguage();
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Global search:', query);
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2" data-testid="link-home">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t.title}</span>
          </a>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <GlobalSearch onSearch={handleSearch} />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <a>
              <Button variant="ghost" data-testid="link-nav-home" className="rounded-md">
                {t.home}
              </Button>
            </a>
          </Link>
          <Link href="/videos">
            <a>
              <Button variant="ghost" data-testid="link-nav-videos" className="rounded-md">
                {t.videos}
              </Button>
            </a>
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard">
              <a>
                <Button variant="ghost" data-testid="link-nav-dashboard" className="rounded-md">
                  {t.dashboard}
                </Button>
              </a>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <ThemeToggle />
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="rounded-md hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          ) : (
            <Link href="/login">
              <a>
                <Button variant="ghost" size="sm" data-testid="button-login" className="rounded-md hidden md:flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t.login}
                </Button>
              </a>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden" data-testid="mobile-menu">
          <nav className="flex flex-col gap-2 p-4">
            <div className="mb-3 md:hidden">
              <GlobalSearch onSearch={handleSearch} />
            </div>
            <Link href="/">
              <a>
                <Button variant="ghost" className="w-full justify-start rounded-md" data-testid="link-mobile-home">
                  {t.home}
                </Button>
              </a>
            </Link>
            <Link href="/videos">
              <a>
                <Button variant="ghost" className="w-full justify-start rounded-md" data-testid="link-mobile-videos">
                  {t.videos}
                </Button>
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <a>
                  <Button variant="ghost" className="w-full justify-start rounded-md" data-testid="link-mobile-dashboard">
                    {t.dashboard}
                  </Button>
                </a>
              </Link>
            )}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start rounded-md"
                data-testid="button-mobile-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            ) : (
              <Link href="/login">
                <a>
                  <Button variant="ghost" className="w-full justify-start rounded-md" data-testid="button-mobile-login">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.login}
                  </Button>
                </a>
              </Link>
            )}
            <div className="mt-2 sm:hidden">
              <LanguageSelector />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
