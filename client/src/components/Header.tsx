import { Link, useLocation } from 'wouter';
import { Globe, Menu, LogOut, LogIn, X, Home, Video, LayoutDashboard, User, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import GlobalSearch from './GlobalSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const translations = {
  en: { 
    home: 'Home', 
    videos: 'Videos', 
    dashboard: 'Dashboard', 
    title: 'GlobalPulse News', 
    logout: 'Logout', 
    login: 'Login',
    search: 'Search news and videos...',
    menu: 'More',
    searchError: 'Search failed. Please try again.',
    noResults: 'No results found.',
    searching: 'Searching...',
    viewAll: 'View All Results'
  },
  ar: { 
    home: 'الرئيسية', 
    videos: 'فيديوهات', 
    dashboard: 'لوحة التحكم', 
    title: 'أخبار جلوبال بالس', 
    logout: 'تسجيل الخروج', 
    login: 'تسجيل الدخول',
    search: 'ابحث في الأخبار والفيديوهات...',
    menu: 'المزيد',
    searchError: 'فشل البحث. يرجى المحاولة مرة أخرى.',
    noResults: 'لم يتم العثور على نتائج.',
    searching: 'جاري البحث...',
    viewAll: 'عرض كل النتائج'
  },
  ur: { 
    home: 'ہوم', 
    videos: 'ویڈیوز', 
    dashboard: 'ڈیش بورڈ', 
    title: 'گلوبل پلس نیوز', 
    logout: 'لاگ آؤٹ', 
    login: 'لاگ ان',
    search: 'خبریں اور ویڈیوز تلاش کریں...',
    menu: 'مزید',
    searchError: 'تلاش ناکام ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
    noResults: 'کوئی نتائج نہیں ملے۔',
    searching: 'تلاش ہو رہی ہے...',
    viewAll: 'تمام نتائج دیکھیں'
  },
};

// API service for search
const searchAPI = {
  async searchContent(query: string, language: string) {
    try {
      // Simulate API call - replace with your actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API response
      const mockResults = [
        {
          id: 1,
          title: `Breaking News: ${query}`,
          description: `Latest updates about ${query} from around the world`,
          url: `/news/1`,
          type: 'news',
          date: new Date().toISOString()
        },
        {
          id: 2,
          title: `Video Report: ${query}`,
          description: `Watch this comprehensive video report about ${query}`,
          url: `/videos/1`,
          type: 'video',
          duration: '5:30'
        },
        {
          id: 3,
          title: `Analysis: Understanding ${query}`,
          description: `In-depth analysis and insights about ${query}`,
          url: `/news/2`,
          type: 'news',
          date: new Date().toISOString()
        }
      ];

      return {
        success: true,
        data: mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        )
      };
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  }
};

export default function Header() {
  const { language, direction } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchResults(false);
  }, [location]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchElement = document.querySelector('[data-testid="global-search"]');
      if (searchElement && !searchElement.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to top when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [mobileMenuOpen]);

  const handleSearch = async (query: string) => {
    try {
      setSearchQuery(query);
      
      if (!query.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      setShowSearchResults(true);

      // Call backend API
      const results = await searchAPI.searchContent(query.trim(), language);
      
      setSearchResults(results.data || []);
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}&lang=${language}`);
      setShowSearchResults(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    const newMenuState = !mobileMenuOpen;
    setMobileMenuOpen(newMenuState);
    
    // Scroll to top when opening the menu
    if (newMenuState) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const NavigationButton = ({ href, icon: Icon, label, testId }: { href: string; icon: any; label: string; testId: string }) => {
    const isActive = location === href;
    
    return (
      <button
        onClick={() => handleNavigation(href)}
        className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]"
      >
        <div className={`p-2 rounded-full transition-all duration-200 ${
          isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs font-medium transition-all duration-200 ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
          isScrolled ? 'shadow-sm border-border/40' : 'border-border'
        }`}
        dir={direction}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:bg-accent/50 rounded-lg px-3 py-2 transition-colors duration-200">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold whitespace-nowrap hidden sm:block">{t.title}</span>
              <span className="text-lg font-bold whitespace-nowrap sm:hidden">GP News</span>
            </a>
          </Link>

          {/* Desktop Search with Results */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="w-full" data-testid="global-search">
              <GlobalSearch 
                onSearch={handleSearch}
                onSubmit={handleSearchSubmit}
                placeholder={t.search}
                loading={isSearching}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      {t.searching}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.slice(0, 5).map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(result.url)}
                          className="flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b border-border last:border-b-0 w-full text-left"
                        >
                          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                          </div>
                        </button>
                      ))}
                      {/* View all results */}
                      <div className="p-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleSearchSubmit(searchQuery)}
                        >
                          {t.viewAll}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {t.noResults}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation - Only show on desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/')}
              className="rounded-lg font-medium"
            >
              {t.home}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/videos')}
              className="rounded-lg font-medium"
            >
              {t.videos}
            </Button>
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/dashboard')}
                className="rounded-lg font-medium"
              >
                {t.dashboard}
              </Button>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-lg hidden md:flex font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/login')}
                className="rounded-lg hidden md:flex font-medium"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t.login}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - Only shown on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Home, Videos, Dashboard/Login - Only shown on mobile */}
            <NavigationButton href="/" icon={Home} label={t.home} testId="bottom-nav-home" />
            <NavigationButton href="/videos" icon={Video} label={t.videos} testId="bottom-nav-videos" />
            {isAuthenticated ? (
              <NavigationButton href="/dashboard" icon={LayoutDashboard} label={t.dashboard} testId="bottom-nav-dashboard" />
            ) : (
              <NavigationButton href="/login" icon={User} label={t.login} testId="bottom-nav-login" />
            )}
            
            {/* More Options Button */}
            <button 
              onClick={toggleMobileMenu}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px] ${
                mobileMenuOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                mobileMenuOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}>
                <ChevronUp className={`h-5 w-5 transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`} />
              </div>
              <span className="text-xs font-medium">{t.menu}</span>
            </button>
          </div>
        </div>

        {/* Expanded More Options - Only shown on mobile when menu is open */}
        {mobileMenuOpen && (
          <div className="animate-in slide-in-from-bottom duration-200 border-t border-border bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col gap-3">
                {/* Mobile Search */}
                <div data-testid="global-search">
                  <GlobalSearch 
                    onSearch={handleSearch}
                    onSubmit={handleSearchSubmit}
                    placeholder={t.search}
                    compact={true}
                    loading={isSearching}
                  />
                  
                  {/* Mobile Search Results */}
                  {showSearchResults && searchQuery.trim() && (
                    <div className="absolute left-4 right-4 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-3 text-center text-muted-foreground">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-1"></div>
                          <p className="text-xs">{t.searching}</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.slice(0, 3).map((result, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                handleNavigation(result.url);
                                setShowSearchResults(false);
                              }}
                              className="flex items-center gap-2 p-2 hover:bg-accent transition-colors border-b border-border last:border-b-0 w-full text-left"
                            >
                              <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{result.title}</p>
                              </div>
                            </button>
                          ))}
                          <div className="p-2 border-t border-border">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs py-1 h-8"
                              onClick={() => handleSearchSubmit(searchQuery)}
                            >
                              {t.viewAll}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 text-center text-muted-foreground text-xs">
                          {t.noResults}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Language and Theme in One Line */}
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex-1">
                    <LanguageSelector compact={true} />
                  </div>
                  <ThemeToggle />
                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="whitespace-nowrap"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add padding to main content to account for bottom navigation */}
      <style jsx global>{`
        body {
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          body {
            padding-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}