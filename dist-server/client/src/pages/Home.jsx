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
import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsCard from '@/components/NewsCard';
import ArticleModal from '@/components/ArticleModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star, BookOpen, Eye, Users, Clock, ArrowRight, RefreshCw } from 'lucide-react';
var translations = {
    en: {
        topNews: 'Top News',
        featured: 'Featured',
        trending: 'Trending',
        popular: 'Popular',
        search: 'Search articles...',
        filter: 'Filter by category',
        all: 'All',
        noResults: 'No articles found',
        loading: 'Loading articles...',
        seeAll: 'See All',
        totalArticles: 'Total Articles',
        dailyViews: 'Daily Views',
        readers: 'Readers',
        updated: 'Updated',
        technology: 'Technology',
        business: 'Business',
        sports: 'Sports',
        politics: 'Politics',
        environment: 'Environment',
        health: 'Health',
        refresh: 'Refresh',
        tryAgain: 'Try Again'
    },
    ar: {
        topNews: 'أهم الأخبار',
        featured: 'مميز',
        trending: 'الشائع',
        popular: 'الأكثر شهرة',
        search: 'ابحث عن المقالات...',
        filter: 'تصفية حسب الفئة',
        all: 'الكل',
        noResults: 'لم يتم العثور على مقالات',
        loading: 'جاري تحميل المقالات...',
        seeAll: 'عرض الكل',
        totalArticles: 'إجمالي المقالات',
        dailyViews: 'المشاهدات اليومية',
        readers: 'القراء',
        updated: 'محدث',
        technology: 'تكنولوجيا',
        business: 'أعمال',
        sports: 'رياضة',
        politics: 'سياسة',
        environment: 'بيئة',
        health: 'صحة',
        refresh: 'تحديث',
        tryAgain: 'حاول مرة أخرى'
    },
    ur: {
        topNews: 'اہم خبریں',
        featured: 'نمایاں',
        trending: 'مقبول',
        popular: 'مشہور',
        search: 'مضامین تلاش کریں...',
        filter: 'زمرے کے لحاظ سے فلٹر کریں',
        all: 'تمام',
        noResults: 'کوئی مضمون نہیں ملا',
        loading: 'مضامین لوڈ ہو رہے ہیں...',
        seeAll: 'سب دیکھیں',
        totalArticles: 'کل مضامین',
        dailyViews: 'روزانہ ویوز',
        readers: 'قارئین',
        updated: 'اپ ڈیٹڈ',
        technology: 'ٹیکنالوجی',
        business: 'کاروبار',
        sports: 'کھیل',
        politics: 'سیاست',
        environment: 'ماحول',
        health: 'صحت',
        refresh: 'ریفریش',
        tryAgain: 'دوبارہ کوشش کریں'
    },
};
export default function Home() {
    var _this = this;
    var language = useLanguage().language;
    var _a = useState('all'), selectedTab = _a[0], setSelectedTab = _a[1];
    var _b = useState(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = useState('all'), categoryFilter = _c[0], setCategoryFilter = _c[1];
    var _d = useState([]), articles = _d[0], setArticles = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var _g = useState(null), selectedArticle = _g[0], setSelectedArticle = _g[1];
    var _h = useState(false), isModalOpen = _h[0], setIsModalOpen = _h[1];
    var _j = useState(false), refreshing = _j[0], setRefreshing = _j[1];
    var t = translations[language];
    var fetchArticles = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, result, articlesArray, errorText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    setLoading(true);
                    setRefreshing(true);
                    setError(null);
                    console.log('🔍 Fetching articles from API...');
                    return [4 /*yield*/, fetch('https://globalpulse-news-production-31ee.up.railway.app/api/articles')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    console.log('📰 Raw API response:', result);
                    articlesArray = [];
                    if (Array.isArray(result)) {
                        articlesArray = result;
                    }
                    else if (result && Array.isArray(result.data)) {
                        articlesArray = result.data;
                    }
                    else if (result && Array.isArray(result.articles)) {
                        articlesArray = result.articles;
                    }
                    else {
                        console.warn('⚠️ API response structure unexpected:', result);
                        articlesArray = [];
                    }
                    console.log("\u2705 Successfully loaded ".concat(articlesArray.length, " articles from backend"));
                    setArticles(articlesArray);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    errorText = _a.sent();
                    throw new Error("HTTP ".concat(response.status, ": ").concat(errorText));
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('❌ Error fetching articles:', error_1);
                    setError('Failed to load articles from server');
                    setArticles([]); // Empty array - no default content
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchArticles();
    }, []);
    var getDisplayText = function (textObject) {
        if (!textObject)
            return 'No description available';
        if (typeof textObject === 'string')
            return textObject;
        var text = textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
        if (!text.trim())
            return 'No description available';
        return text;
    };
    var formatCategory = function (cat) {
        var categoryMap = {
            technology: t.technology,
            business: t.business,
            sports: t.sports,
            politics: t.politics,
            environment: t.environment,
            health: t.health
        };
        return categoryMap[cat] || cat;
    };
    var filteredArticles = useMemo(function () {
        var safeArticles = Array.isArray(articles) ? articles : [];
        var filtered = safeArticles.filter(function (article) {
            var _a;
            if (!article)
                return false;
            var articleTitle = getDisplayText(article.title);
            var articleDescription = getDisplayText(article.description);
            var matchesSearch = searchQuery === '' ||
                articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                articleDescription.toLowerCase().includes(searchQuery.toLowerCase());
            var matchesCategory = categoryFilter === 'all' ||
                ((_a = article.category) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === categoryFilter.toLowerCase();
            return matchesSearch && matchesCategory;
        });
        if (selectedTab === 'featured') {
            filtered = filtered.filter(function (article) { return article.isFeatured; });
        }
        else if (selectedTab === 'popular') {
            filtered = filtered.sort(function (a, b) { return (b.views || 0) - (a.views || 0); });
        }
        else if (selectedTab === 'trending') {
            filtered = filtered.filter(function (article) { return article.isTrending; });
        }
        return filtered;
    }, [articles, searchQuery, categoryFilter, selectedTab, language]);
    var trendingArticles = useMemo(function () {
        var safeArticles = Array.isArray(articles) ? articles : [];
        return safeArticles
            .filter(function (article) { return article === null || article === void 0 ? void 0 : article.isTrending; })
            .sort(function (a, b) { return ((b === null || b === void 0 ? void 0 : b.views) || 0) - ((a === null || a === void 0 ? void 0 : a.views) || 0); })
            .slice(0, 4);
    }, [articles]);
    var featuredArticles = useMemo(function () {
        var safeArticles = Array.isArray(articles) ? articles : [];
        return safeArticles
            .filter(function (article) { return article === null || article === void 0 ? void 0 : article.isFeatured; })
            .slice(0, 4);
    }, [articles]);
    var handleReadMore = function (article) {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };
    var closeModal = function () {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };
    var handleSeeAllTrending = function () {
        setSelectedTab('trending');
        setCategoryFilter('all');
        setSearchQuery('');
        setTimeout(function () {
            var _a;
            (_a = document.getElementById('articles-section')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    var handleSeeAllFeatured = function () {
        setSelectedTab('featured');
        setCategoryFilter('all');
        setSearchQuery('');
        setTimeout(function () {
            var _a;
            (_a = document.getElementById('articles-section')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    var handleTabChange = function (value) {
        setSelectedTab(value);
    };
    var handleModalClose = function () {
        closeModal();
        fetchArticles();
    };
    var handleRefresh = function () {
        fetchArticles();
    };
    if (loading && !refreshing) {
        return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{t.loading}</div>
            </div>
          </div>
        </div>
      </div>);
    }
    if (error && articles.length === 0) {
        return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
              <Button onClick={fetchArticles} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95" size="lg">
                <RefreshCw className="h-5 w-5 mr-2"/>
                {t.tryAgain}
              </Button>
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight text-justify sm:text-center">
            {t.topNews}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light px-2 leading-relaxed text-justify sm:text-center">
            {language === 'ar'
            ? 'ابق على اطلاع بأحدث الأخبار والقصص من جميع أنحاء العالم'
            : language === 'ur'
                ? 'دنیا بھر کی تازہ ترین خبروں اور کہانیوں سے باخبر رہیں'
                : 'Stay informed with the latest news and stories from around the world'}
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 active:scale-95 text-xs sm:text-sm" size="sm">
            <RefreshCw className={"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ".concat(refreshing ? 'animate-spin' : '')}/>
            {refreshing ? t.loading : t.refresh}
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400"/>
            <Input type="search" placeholder={t.search} value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 focus:border-gray-500 rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 w-full"/>
          </div>
          <div className="w-full sm:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-gray-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 transition-all duration-300 w-full">
                <SelectValue placeholder={t.filter}/>
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 max-h-60">
                <SelectItem value="all" className="text-xs sm:text-sm py-2">{t.all}</SelectItem>
                <SelectItem value="technology" className="text-xs sm:text-sm py-2">🚀 {t.technology}</SelectItem>
                <SelectItem value="business" className="text-xs sm:text-sm py-2">💼 {t.business}</SelectItem>
                <SelectItem value="sports" className="text-xs sm:text-sm py-2">⚽ {t.sports}</SelectItem>
                <SelectItem value="politics" className="text-xs sm:text-sm py-2">🏛️ {t.politics}</SelectItem>
                <SelectItem value="environment" className="text-xs sm:text-sm py-2">🌱 {t.environment}</SelectItem>
                <SelectItem value="health" className="text-xs sm:text-sm py-2">❤️ {t.health}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Section - Only show if we have articles */}
        {articles.length > 0 && (<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            {[
                { icon: BookOpen, color: 'text-gray-600', value: "".concat(articles.length, "+"), label: t.totalArticles },
                { icon: Eye, color: 'text-gray-600', value: "".concat(articles.reduce(function (sum, article) { return sum + (article.views || 0); }, 0).toLocaleString(), "+"), label: t.dailyViews },
                { icon: Users, color: 'text-gray-600', value: "".concat(articles.reduce(function (sum, article) { return sum + (article.likes || 0); }, 0).toLocaleString(), "+"), label: t.readers },
                { icon: Clock, color: 'text-gray-600', value: '24/7', label: t.updated }
            ].map(function (stat, index) { return (<div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <stat.icon className={"h-4 w-4 sm:h-5 sm:w-5 ".concat(stat.color, " mx-auto mb-1")}/>
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>); })}
          </div>)}

        {/* Trending Section - Only show if we have trending articles */}
        {trendingArticles.length > 0 && (<div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"/>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t.trending}</h2>
              </div>
              <Button onClick={handleSeeAllTrending} variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg px-2 sm:px-3 py-1 transition-all duration-300 active:scale-95 w-full sm:w-auto text-xs sm:text-sm" size="sm">
                {t.seeAll}
                <ArrowRight className="h-3 w-3 ml-1"/>
              </Button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trendingArticles.map(function (article) { return (<NewsCard key={article._id} title={getDisplayText(article.title)} description={getDisplayText(article.description)} category={formatCategory(article.category)} imageUrl={article.imageUrl} timeAgo={new Date(article.createdAt).toLocaleDateString()} views={article.views || 0} readTime={article.readTime || '5 min read'} onReadMore={function () { return handleReadMore(article); }} compact={true} isTrending={article.isTrending} isFeatured={article.isFeatured}/>); })}
            </div>
          </div>)}

        {/* Featured Section - Only show if we have featured articles */}
        {featuredArticles.length > 0 && (<div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"/>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t.featured}</h2>
              </div>
              <Button onClick={handleSeeAllFeatured} variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg px-2 sm:px-3 py-1 transition-all duration-300 active:scale-95 w-full sm:w-auto text-xs sm:text-sm" size="sm">
                {t.seeAll}
                <ArrowRight className="h-3 w-3 ml-1"/>
              </Button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredArticles.map(function (article) { return (<NewsCard key={article._id} title={getDisplayText(article.title)} description={getDisplayText(article.description)} category={formatCategory(article.category)} imageUrl={article.imageUrl} timeAgo={new Date(article.createdAt).toLocaleDateString()} views={article.views || 0} readTime={article.readTime || '5 min read'} onReadMore={function () { return handleReadMore(article); }} compact={true} isTrending={article.isTrending} isFeatured={article.isFeatured}/>); })}
            </div>
          </div>)}

        {/* Main Content Tabs */}
        <div id="articles-section">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6">
            <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-4 sm:mb-6 flex flex-wrap sm:flex-nowrap">
              {[
            { value: 'all', label: t.all, icon: null },
            { value: 'featured', label: t.featured, icon: Star },
            { value: 'trending', label: t.trending, icon: TrendingUp },
            { value: 'popular', label: t.popular, icon: TrendingUp }
        ].map(function (tab) { return (<TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md px-2 sm:px-3 py-1.5 font-medium transition-all duration-300 flex-1 text-xs sm:text-sm m-0.5">
                  {tab.icon && <tab.icon className="h-3 w-3 mr-1"/>}
                  {tab.label}
                </TabsTrigger>); })}
            </TabsList>

            {['all', 'featured', 'trending', 'popular'].map(function (tabValue) { return (<TabsContent key={tabValue} value={tabValue} className="mt-0">
                {filteredArticles.length === 0 ? (<div className="text-center py-6 sm:py-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                      {tabValue === 'featured' ? (<Star className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2"/>) : tabValue === 'trending' ? (<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2"/>) : tabValue === 'popular' ? (<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2"/>) : (<Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2"/>)}
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-2 text-justify sm:text-center">
                        {t.noResults}
                      </p>
                      {articles.length === 0 ? (<p className="text-xs text-gray-500 dark:text-gray-400 text-justify sm:text-center">
                          {language === 'ar'
                        ? 'لا توجد مقالات متاحة حالياً'
                        : language === 'ur'
                            ? 'فی الحال کوئی مضامین دستیاب نہیں ہیں'
                            : 'No articles available at the moment'}
                        </p>) : (<p className="text-xs text-gray-500 dark:text-gray-400 text-justify sm:text-center">
                          {language === 'ar'
                        ? 'حاول تغيير معايير البحث أو التصفية'
                        : language === 'ur'
                            ? 'اپنے سرچ یا فلٹر کے معیارات کو تبدیل کرنے کی کوشش کریں'
                            : 'Try changing your search or filter criteria'}
                        </p>)}
                    </div>
                  </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filteredArticles.map(function (article) { return (<NewsCard key={article._id} title={getDisplayText(article.title)} description={getDisplayText(article.description)} category={formatCategory(article.category)} imageUrl={article.imageUrl} timeAgo={new Date(article.createdAt).toLocaleDateString()} views={article.views || 0} readTime={article.readTime || '5 min read'} onReadMore={function () { return handleReadMore(article); }} compact={true} isTrending={article.isTrending} isFeatured={article.isFeatured}/>); })}
                  </div>)}
              </TabsContent>); })}
          </Tabs>
        </div>

        {/* Article Modal */}
        <ArticleModal article={selectedArticle} isOpen={isModalOpen} onClose={handleModalClose}/>
      </div>
    </div>);
}
