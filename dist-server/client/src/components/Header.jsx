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
import { Link, useLocation } from 'wouter';
import { Globe, LogOut, LogIn, Home, Video, LayoutDashboard, User, ChevronUp, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import GlobalSearch from './GlobalSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
var translations = {
    en: {
        home: 'Home',
        videos: 'Videos',
        dashboard: 'Dashboard',
        admin: 'Admin Panel',
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
        admin: 'لوحة الإدارة',
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
        admin: 'ایڈمن پینل',
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
var API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
// BodyPadding component to handle mobile padding
function BodyPadding() {
    useEffect(function () {
        var updatePadding = function () {
            if (window.innerWidth >= 768) {
                document.body.style.paddingBottom = '0';
            }
            else {
                document.body.style.paddingBottom = '80px';
            }
        };
        updatePadding();
        window.addEventListener('resize', updatePadding);
        return function () {
            document.body.style.paddingBottom = '0';
            window.removeEventListener('resize', updatePadding);
        };
    }, []);
    return null;
}
export default function Header() {
    var _this = this;
    var _a = useLanguage(), language = _a.language, direction = _a.direction;
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, logout = _b.logout, currentUser = _b.currentUser; // Remove hasRole
    var _c = useLocation(), location = _c[0], setLocation = _c[1];
    var t = translations[language];
    var _d = useState(false), mobileMenuOpen = _d[0], setMobileMenuOpen = _d[1];
    var _e = useState(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = useState(false), isScrolled = _f[0], setIsScrolled = _f[1];
    var _g = useState(false), isSearching = _g[0], setIsSearching = _g[1];
    var _h = useState([]), searchResults = _h[0], setSearchResults = _h[1];
    var _j = useState(false), showSearchResults = _j[0], setShowSearchResults = _j[1];
    // Check if user is admin - FIXED: Use currentUser.role instead of hasRole
    var isAdmin = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin';
    useEffect(function () {
        var handleScroll = function () {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return function () { return window.removeEventListener('scroll', handleScroll); };
    }, []);
    useEffect(function () {
        setMobileMenuOpen(false);
        setShowSearchResults(false);
    }, [location]);
    useEffect(function () {
        var handleClickOutside = function (event) {
            var searchElement = document.querySelector('[data-testid="global-search"]');
            if (searchElement && !searchElement.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    useEffect(function () {
        if (mobileMenuOpen) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [mobileMenuOpen]);
    var handleSearch = function (query) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setSearchQuery(query);
                    if (!query.trim()) {
                        setSearchResults([]);
                        setShowSearchResults(false);
                        return [2 /*return*/];
                    }
                    setIsSearching(true);
                    setShowSearchResults(true);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/search?q=").concat(encodeURIComponent(query.trim())))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setSearchResults(data.data || []);
                    return [3 /*break*/, 4];
                case 3:
                    setSearchResults([]);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Search error:', error_1);
                    setSearchResults([]);
                    return [3 /*break*/, 7];
                case 6:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleSearchSubmit = function (query) {
        if (query.trim()) {
            setLocation("/search?q=".concat(encodeURIComponent(query.trim())));
            setShowSearchResults(false);
            setMobileMenuOpen(false);
        }
    };
    var handleLogout = function () {
        logout();
        setMobileMenuOpen(false);
        setLocation('/');
    };
    var handleNavigation = function (path) {
        setLocation(path);
        setMobileMenuOpen(false);
    };
    var toggleMobileMenu = function () {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    var NavigationButton = function (_a) {
        var href = _a.href, Icon = _a.icon, label = _a.label, testId = _a.testId;
        var isActive = location === href;
        return (<button onClick={function () { return handleNavigation(href); }} className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]" data-testid={testId}>
        <div className={"p-2 rounded-full transition-all duration-200 ".concat(isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}>
          <Icon className="h-5 w-5"/>
        </div>
        <span className={"text-xs font-medium transition-all duration-200 ".concat(isActive ? 'text-primary' : 'text-muted-foreground')}>
          {label}
        </span>
      </button>);
    };
    return (<>
      <BodyPadding />
      
      <header className={"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ".concat(isScrolled ? 'shadow-sm border-border/40' : 'border-border')} dir={direction}>
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 hover:bg-accent/50 rounded-lg px-3 py-2 transition-colors duration-200 cursor-pointer">
                <Globe className="h-6 w-6 text-primary"/>
                <span className="text-lg font-bold whitespace-nowrap hidden sm:block">{t.title}</span>
                <span className="text-lg font-bold whitespace-nowrap sm:hidden">GP News</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="w-full" data-testid="global-search">
              <GlobalSearch onSearch={handleSearch} onSubmit={handleSearchSubmit} placeholder={t.search} loading={isSearching}/>
              
              {showSearchResults && searchQuery.trim() && (<div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (<div className="p-4 text-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      {t.searching}
                    </div>) : searchResults.length > 0 ? (<div className="py-2">
                      {searchResults.slice(0, 5).map(function (result, index) { return (<button key={index} onClick={function () { return handleNavigation(result.url); }} className="flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b border-border last:border-b-0 w-full text-left">
                          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                          </div>
                        </button>); })}
                      <div className="p-3 border-t border-border">
                        <Button variant="outline" size="sm" className="w-full" onClick={function () { return handleSearchSubmit(searchQuery); }}>
                          {t.viewAll}
                        </Button>
                      </div>
                    </div>) : (<div className="p-4 text-center text-muted-foreground">
                      {t.noResults}
                    </div>)}
                </div>)}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button variant={location === '/' ? 'default' : 'ghost'} onClick={function () { return handleNavigation('/'); }} className="rounded-lg font-medium">
              {t.home}
            </Button>
            <Button variant={location === '/videos' ? 'default' : 'ghost'} onClick={function () { return handleNavigation('/videos'); }} className="rounded-lg font-medium">
              {t.videos}
            </Button>
            {isAuthenticated && (<Button variant={location === '/dashboard' ? 'default' : 'ghost'} onClick={function () { return handleNavigation('/dashboard'); }} className="rounded-lg font-medium">
                {t.dashboard}
              </Button>)}
            {/* FIXED: Use isAdmin instead of hasRole */}
            {isAdmin && (<Button variant={location === '/admin' ? 'default' : 'ghost'} onClick={function () { return handleNavigation('/admin'); }} className="rounded-lg font-medium">
                <Shield className="h-4 w-4 mr-2"/>
                {t.admin}
              </Button>)}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <ThemeToggle />
            {isAuthenticated ? (<div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden lg:block">
                  Welcome, {currentUser === null || currentUser === void 0 ? void 0 : currentUser.username}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-lg hidden md:flex font-medium">
                  <LogOut className="h-4 w-4 mr-2"/>
                  {t.logout}
                </Button>
              </div>) : (<Button variant="ghost" size="sm" onClick={function () { return handleNavigation('/login'); }} className="rounded-lg hidden md:flex font-medium">
                <LogIn className="h-4 w-4 mr-2"/>
                {t.login}
              </Button>)}
          </div>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <NavigationButton href="/" icon={Home} label={t.home} testId="bottom-nav-home"/>
            <NavigationButton href="/videos" icon={Video} label={t.videos} testId="bottom-nav-videos"/>
            {isAuthenticated ? (<NavigationButton href="/dashboard" icon={LayoutDashboard} label={t.dashboard} testId="bottom-nav-dashboard"/>) : (<NavigationButton href="/login" icon={User} label={t.login} testId="bottom-nav-login"/>)}
            
            <button onClick={toggleMobileMenu} className={"flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px] ".concat(mobileMenuOpen ? 'text-primary' : 'text-muted-foreground')} data-testid="bottom-nav-more">
              <div className={"p-2 rounded-full transition-all duration-200 ".concat(mobileMenuOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>
                <ChevronUp className={"h-5 w-5 transition-transform duration-200 ".concat(mobileMenuOpen ? 'rotate-180' : '')}/>
              </div>
              <span className="text-xs font-medium">{t.menu}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (<div className="animate-in slide-in-from-bottom duration-200 border-t border-border bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col gap-3">
                <div data-testid="global-search">
                  <GlobalSearch onSearch={handleSearch} onSubmit={handleSearchSubmit} placeholder={t.search} compact={true} loading={isSearching}/>
                  
                  {showSearchResults && searchQuery.trim() && (<div className="absolute left-4 right-4 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {isSearching ? (<div className="p-3 text-center text-muted-foreground">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-1"></div>
                          <p className="text-xs">{t.searching}</p>
                        </div>) : searchResults.length > 0 ? (<div className="py-2">
                          {searchResults.slice(0, 3).map(function (result, index) { return (<button key={index} onClick={function () {
                            handleNavigation(result.url);
                            setShowSearchResults(false);
                        }} className="flex items-center gap-2 p-2 hover:bg-accent transition-colors border-b border-border last:border-b-0 w-full text-left">
                              <Search className="h-3 w-3 text-muted-foreground flex-shrink-0"/>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{result.title}</p>
                              </div>
                            </button>); })}
                          <div className="p-2 border-t border-border">
                            <Button variant="outline" size="sm" className="w-full text-xs py-1 h-8" onClick={function () { return handleSearchSubmit(searchQuery); }}>
                              {t.viewAll}
                            </Button>
                          </div>
                        </div>) : (<div className="p-3 text-center text-muted-foreground text-xs">
                          {t.noResults}
                        </div>)}
                    </div>)}
                </div>
                
                {/* FIXED: Use isAdmin instead of hasRole */}
                {isAdmin && (<Button variant={location === '/admin' ? 'default' : 'outline'} onClick={function () { return handleNavigation('/admin'); }} className="w-full justify-start" size="sm">
                    <Shield className="h-4 w-4 mr-2"/>
                    {t.admin}
                  </Button>)}
                
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex-1">
                    <LanguageSelector compact={true}/>
                  </div>
                  <ThemeToggle />
                  {isAuthenticated && (<div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {currentUser === null || currentUser === void 0 ? void 0 : currentUser.username}
                      </span>
                      <Button variant="outline" size="sm" onClick={handleLogout} className="whitespace-nowrap">
                        <LogOut className="h-4 w-4"/>
                      </Button>
                    </div>)}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </>);
}
