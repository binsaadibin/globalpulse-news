import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsCard from '@/components/NewsCard';
import ArticleModal from '@/components/ArticleModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Star, 
  BookOpen, 
  Eye, 
  Users, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  Play,
  ChevronLeft,
  ChevronRight,
  Radio,
  Megaphone,
  Zap,
  Flame,
  Crown
} from 'lucide-react';

const translations = {
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
    tryAgain: 'Try Again',
    liveNews: 'Live News',
    breakingNews: 'Breaking News',
    advertisement: 'Advertisement',
    readMore: 'Read More',
    latestUpdates: 'Latest Updates',
    topStories: 'Top Stories',
    mainStory: 'Main Story',
    justIn: 'Just In',
    hotTopics: 'Hot Topics',
    exclusive: 'Exclusive',
    recommended: 'Recommended For You'
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
    tryAgain: 'حاول مرة أخرى',
    liveNews: 'أخبار مباشرة',
    breakingNews: 'أخبار عاجلة',
    advertisement: 'إعلان',
    readMore: 'اقرأ المزيد',
    latestUpdates: 'آخر التحديثات',
    topStories: 'أهم القصص',
    mainStory: 'القصة الرئيسية',
    justIn: 'وصل الآن',
    hotTopics: 'المواضيع الساخنة',
    exclusive: 'حصري',
    recommended: 'مقترح لك'
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
    tryAgain: 'دوبارہ کوشش کریں',
    liveNews: 'براہ راست خبریں',
    breakingNews: 'بریکنگ نیوز',
    advertisement: 'اشتہار',
    readMore: 'مزید پڑھیں',
    latestUpdates: 'تازہ ترین اپ ڈیٹس',
    topStories: 'اہم کہانیاں',
    mainStory: 'مرکزی کہانی',
    justIn: 'ابھی ابھی',
    hotTopics: 'گرم موضوعات',
    exclusive: 'خصوصی',
    recommended: 'آپ کے لیے تجویز کردہ'
  },
};

// Horizontal Scroll Cards Component
function HorizontalScrollCards({ articles, title, onReadMore, variant = 'default' }: { 
  articles: any[]; 
  title: string;
  onReadMore: (article: any) => void;
  variant?: 'default' | 'trending' | 'featured';
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className={`mb-8 ${variant === 'trending' ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800' : variant === 'featured' ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {variant === 'trending' && <Flame className="h-6 w-6 text-orange-500" />}
          {variant === 'featured' && <Crown className="h-6 w-6 text-purple-500" />}
          {variant === 'default' && <Zap className="h-6 w-6 text-blue-500" />}
          <h2 className={`text-2xl font-bold ${variant === 'trending' ? 'text-orange-900 dark:text-orange-100' : variant === 'featured' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h2>
          {variant === 'trending' && (
            <Badge className="bg-orange-500 text-white animate-pulse">HOT</Badge>
          )}
          {variant === 'featured' && (
            <Badge className="bg-purple-500 text-white">EXCLUSIVE</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => scroll('left')} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => scroll('right')} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article) => (
            <Card 
              key={article._id} 
              className={`min-w-[300px] max-w-[300px] cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 ${
                variant === 'trending' ? 'bg-white dark:bg-gray-800 shadow-lg' : 
                variant === 'featured' ? 'bg-white dark:bg-gray-800 shadow-lg' : 
                'bg-white dark:bg-gray-800 shadow-md'
              }`}
              onClick={() => onReadMore(article)}
            >
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'} 
                  alt={article.title?.en || 'News image'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  <Badge className={`text-xs ${
                    variant === 'trending' ? 'bg-orange-500 text-white' : 
                    variant === 'featured' ? 'bg-purple-500 text-white' : 
                    'bg-blue-500 text-white'
                  }`}>
                    {article.category}
                  </Badge>
                  {article.isTrending && variant !== 'trending' && (
                    <Badge className="bg-red-500 text-white text-xs">TRENDING</Badge>
                  )}
                  {article.isFeatured && variant !== 'featured' && (
                    <Badge className="bg-green-500 text-white text-xs">FEATURED</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight text-sm">
                  {article.title?.en || article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{article.views || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Live News Ticker Component
function LiveNewsTicker({ articles }: { articles: any[] }) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];
  
  const liveArticles = articles.slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 mb-8 rounded-lg shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-red-700 px-4 py-1 rounded-full shadow-md">
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-bold">{t.liveNews}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {liveArticles.map((article, index) => (
                <span key={article._id} className="mx-6 text-sm font-medium">
                  {article.title?.en || article.title}
                  {index < liveArticles.length - 1 && ' • '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Advertisement Component
function Advertisement({ position, className = '' }: { position: string; className?: string }) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  const adContent = {
    sidebar: {
      title: 'Premium Business Suite',
      description: 'Transform your workflow with our enterprise solutions',
      cta: 'Get Started',
      gradient: 'from-blue-500 to-purple-600'
    },
    inline: {
      title: 'Special Limited Offer',
      description: '50% off on annual subscriptions',
      cta: 'Claim Offer',
      gradient: 'from-green-500 to-teal-600'
    }
  };

  const ad = position === 'sidebar' ? adContent.sidebar : adContent.inline;

  return (
    <Card className={`bg-gradient-to-br ${ad.gradient} text-white border-0 shadow-xl ${className}`}>
      <CardContent className="p-6 text-center">
        <Megaphone className="h-8 w-8 text-white mx-auto mb-3 opacity-90" />
        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs mb-2">
          {t.advertisement}
        </Badge>
        <h4 className="font-bold text-white mb-2 text-lg">{ad.title}</h4>
        <p className="text-white/90 text-sm mb-4">{ad.description}</p>
        <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
          {ad.cta}
        </Button>
      </CardContent>
    </Card>
  );
}

// Latest News Grid Component
function LatestNewsGrid({ articles, onReadMore }: { articles: any[]; onReadMore: (article: any) => void }) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  if (articles.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.latestUpdates}</h2>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          {articles.length} {t.totalArticles}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <Card 
            key={article._id} 
            className="cursor-pointer group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg overflow-hidden"
            onClick={() => onReadMore(article)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'} 
                alt={article.title?.en || 'News image'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <Badge className="absolute top-2 left-2 bg-black/70 text-white text-xs border-0">
                {article.category}
              </Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title?.en || article.title}
              </h3>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const t = translations[language as 'en' | 'ar' | 'ur'];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      
      console.log('🔍 Fetching articles from API...');
      const response = await fetch('https://globalpulse-news-production-31ee.up.railway.app/api/articles');
      
      if (response.ok) {
        const result = await response.json();
        console.log('📰 Raw API response:', result);
        
        let articlesArray = [];
        
        if (Array.isArray(result)) {
          articlesArray = result;
        } else if (result && Array.isArray(result.data)) {
          articlesArray = result.data;
        } else if (result && Array.isArray(result.articles)) {
          articlesArray = result.articles;
        } else {
          console.warn('⚠️ API response structure unexpected:', result);
          articlesArray = [];
        }
        
        console.log(`✅ Successfully loaded ${articlesArray.length} articles from backend`);
        setArticles(articlesArray);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      setError('Failed to load articles from server');
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return 'No description available';
    if (typeof textObject === 'string') return textObject;
    
    const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
    
    if (!text.trim()) return 'No description available';
    
    return text;
  };

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      technology: t.technology,
      business: t.business,
      sports: t.sports,
      politics: t.politics,
      environment: t.environment,
      health: t.health
    };
    return categoryMap[cat] || cat;
  };

  // Get main featured article (latest or most important)
  const mainFeaturedArticle = useMemo(() => {
    const safeArticles = Array.isArray(articles) ? articles : [];
    return safeArticles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  }, [articles]);

  // Get remaining articles (excluding main featured)
  const remainingArticles = useMemo(() => {
    const safeArticles = Array.isArray(articles) ? articles : [];
    if (!mainFeaturedArticle) return safeArticles;
    return safeArticles.filter(article => article._id !== mainFeaturedArticle._id);
  }, [articles, mainFeaturedArticle]);

  // Data for horizontal scroll sections
  const trendingArticles = useMemo(() => {
    return remainingArticles
      .filter(article => article?.isTrending)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 8);
  }, [remainingArticles]);

  const featuredArticles = useMemo(() => {
    return remainingArticles
      .filter(article => article?.isFeatured)
      .slice(0, 8);
  }, [remainingArticles]);

  const latestArticles = useMemo(() => {
    return remainingArticles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);
  }, [remainingArticles]);

  // Filtered articles for main content
  const filteredArticles = useMemo(() => {
    const safeArticles = Array.isArray(remainingArticles) ? remainingArticles : [];
    
    let filtered = safeArticles.filter(article => {
      if (!article) return false;
      
      const articleTitle = getDisplayText(article.title);
      const articleDescription = getDisplayText(article.description);
      
      const matchesSearch = searchQuery === '' || 
        articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        articleDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        article.category?.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });

    if (selectedTab === 'featured') {
      filtered = filtered.filter(article => article.isFeatured);
    } else if (selectedTab === 'popular') {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedTab === 'trending') {
      filtered = filtered.filter(article => article.isTrending);
    }

    return filtered;
  }, [remainingArticles, searchQuery, categoryFilter, selectedTab, language]);

  const handleReadMore = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    fetchArticles(); // Refresh to get updated views/likes
  };

  const handleRefresh = () => {
    fetchArticles();
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{t.loading}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
              <Button 
                onClick={fetchArticles}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                {t.tryAgain}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.topNews}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'ابق على اطلاع بأحدث الأخبار والقصص من جميع أنحاء العالم'
              : language === 'ur'
              ? 'دنیا بھر کی تازہ ترین خبروں اور کہانیوں سے باخبر رہیں'
              : 'Stay informed with the latest news and stories from around the world'
            }
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold rounded-lg px-4 py-2 transition-all duration-300 active:scale-95 shadow-md"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t.loading : t.refresh}
          </Button>
        </div>

        {/* Live News Ticker */}
        {articles.length > 0 && <LiveNewsTicker articles={articles} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Main Featured Article */}
            {mainFeaturedArticle && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    {t.breakingNews}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.mainStory}</h2>
                </div>
                <Card className="overflow-hidden shadow-2xl border-0 bg-white dark:bg-gray-800 cursor-pointer group" onClick={() => handleReadMore(mainFeaturedArticle)}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative aspect-video md:aspect-auto">
                      <img 
                        src={mainFeaturedArticle.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'} 
                        alt={getDisplayText(mainFeaturedArticle.title)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm mb-2">
                          {formatCategory(mainFeaturedArticle.category)}
                        </Badge>
                        <Badge className="bg-red-600 text-white">LATEST</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {getDisplayText(mainFeaturedArticle.title)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4 text-lg">
                        {getDisplayText(mainFeaturedArticle.description)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(mainFeaturedArticle.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {mainFeaturedArticle.views || 0} views
                          </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                          {t.readMore} <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Trending Articles Horizontal Scroll */}
            {trendingArticles.length > 0 && (
              <HorizontalScrollCards 
                articles={trendingArticles}
                title={t.trending}
                onReadMore={handleReadMore}
                variant="trending"
              />
            )}

            {/* Featured Articles Horizontal Scroll */}
            {featuredArticles.length > 0 && (
              <HorizontalScrollCards 
                articles={featuredArticles}
                title={t.featured}
                onReadMore={handleReadMore}
                variant="featured"
              />
            )}

            {/* Advertisement - Inline */}
            <Advertisement position="inline" className="my-8" />

            {/* Latest News Grid */}
            {latestArticles.length > 0 && (
              <LatestNewsGrid 
                articles={latestArticles}
                onReadMore={handleReadMore}
              />
            )}

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-lg bg-white dark:bg-gray-800 w-full shadow-sm"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 w-full shadow-sm">
                    <SelectValue placeholder={t.filter} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800">
                    <SelectItem value="all">{t.all}</SelectItem>
                    <SelectItem value="technology">🚀 {t.technology}</SelectItem>
                    <SelectItem value="business">💼 {t.business}</SelectItem>
                    <SelectItem value="sports">⚽ {t.sports}</SelectItem>
                    <SelectItem value="politics">🏛️ {t.politics}</SelectItem>
                    <SelectItem value="environment">🌱 {t.environment}</SelectItem>
                    <SelectItem value="health">❤️ {t.health}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Articles Grid with Tabs */}
            <div id="articles-section">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-6 flex flex-wrap shadow-sm">
                  {[
                    { value: 'all', label: t.all },
                    { value: 'featured', label: t.featured, icon: Star },
                    { value: 'trending', label: t.trending, icon: TrendingUp },
                    { value: 'popular', label: t.popular, icon: Eye }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md px-4 py-2 font-medium transition-all duration-300 flex-1 text-sm m-0.5 data-[state=active]:shadow-md"
                    >
                      {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {['all', 'featured', 'trending', 'popular'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    {filteredArticles.length === 0 ? (
                      <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">{t.noResults}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {articles.length === 0 
                            ? 'No articles available at the moment'
                            : 'Try changing your search or filter criteria'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                          <NewsCard
                            key={article._id}
                            title={getDisplayText(article.title)}
                            description={getDisplayText(article.description)}
                            category={formatCategory(article.category)}
                            imageUrl={article.imageUrl}
                            timeAgo={new Date(article.createdAt).toLocaleDateString()}
                            views={article.views || 0}
                            readTime={article.readTime || '5 min read'}
                            onReadMore={() => handleReadMore(article)}
                            compact={true}
                            isTrending={article.isTrending}
                            isFeatured={article.isFeatured}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Advertisement - Sidebar */}
            <Advertisement position="sidebar" />

            {/* Live News Section */}
            <Card className="border-l-4 border-l-red-500 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Radio className="h-5 w-5 text-red-600 animate-pulse" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{t.liveNews}</h3>
                </div>
                <div className="space-y-3">
                  {articles.slice(0, 6).map((article) => (
                    <div 
                      key={article._id} 
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 border-l-2 border-l-red-400"
                      onClick={() => handleReadMore(article)}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            {getDisplayText(article.title)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(article.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Section */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{t.recommended}</h3>
                </div>
                <div className="space-y-3">
                  {articles.slice(0, 4).map((article) => (
                    <div 
                      key={article._id} 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleReadMore(article)}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'} 
                          alt={getDisplayText(article.title)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {getDisplayText(article.title)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </div>
  );
}