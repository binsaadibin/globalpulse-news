import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsCard from '@/components/NewsCard';
import ArticleModal from '@/components/ArticleModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, Star, Calendar, Users, ArrowRight, BookOpen, Eye, Clock, RefreshCw } from 'lucide-react';

const translations = {
  en: { 
    topNews: 'Top News', 
    featured: 'Featured', 
    trending: 'Trending',
    latest: 'Latest',
    popular: 'Popular',
    search: 'Search articles...', 
    filter: 'Filter by category', 
    all: 'All', 
    noResults: 'No articles found',
    loading: 'Loading articles...',
    readMore: 'Read More',
    seeAll: 'See All',
    breakingNews: 'Breaking News',
    topStories: 'Top Stories',
    featuredArticle: 'Featured Article',
    minutesRead: 'min read',
    views: 'views',
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
    latest: 'الأحدث',
    popular: 'الأكثر شهرة',
    search: 'ابحث عن المقالات...', 
    filter: 'تصفية حسب الفئة', 
    all: 'الكل', 
    noResults: 'لم يتم العثور على مقالات',
    loading: 'جاري تحميل المقالات...',
    readMore: 'اقرأ المزيد',
    seeAll: 'عرض الكل',
    breakingNews: 'أخبار عاجلة',
    topStories: 'أهم القصص',
    featuredArticle: 'مقال مميز',
    minutesRead: 'دقيقة قراءة',
    views: 'مشاهدة',
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
    latest: 'تازہ ترین',
    popular: 'مشہور',
    search: 'مضامین تلاش کریں...', 
    filter: 'زمرے کے لحاظ سے فلٹر کریں', 
    all: 'تمام', 
    noResults: 'کوئی مضمون نہیں ملا',
    loading: 'مضامین لوڈ ہو رہے ہیں...',
    readMore: 'مزید پڑھیں',
    seeAll: 'سب دیکھیں',
    breakingNews: 'بریکنگ نیوز',
    topStories: 'اہم کہانیاں',
    featuredArticle: 'نمایاں مضمون',
    minutesRead: 'منٹ کی قرات',
    views: 'ویوز',
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

  // Fetch articles from backend
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      
      const response = await fetch('https://globalpulse-news-production-31ee.up.railway.app/api/articles');
      
      if (response.ok) {
        const data = await response.json();
        console.log('📰 Fetched articles from API:', data.length);
        setArticles(data);
      } else {
        throw new Error('Failed to fetch articles');
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

  // Helper function to safely extract text
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

  const filteredArticles = useMemo(() => {
    let filtered = articles.filter(article => {
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
    }

    return filtered;
  }, [articles, searchQuery, categoryFilter, selectedTab, language]);

  // Get trending articles
  const trendingArticles = useMemo(() => {
    return [...articles]
      .filter(article => article.isTrending || (article.views || 0) > 100)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [articles]);

  const handleReadMore = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleSeeAllTrending = () => {
    setSelectedTab('popular');
    setCategoryFilter('all');
    setSearchQuery('');
    setTimeout(() => {
      document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const handleModalClose = () => {
    closeModal();
    fetchArticles();
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
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section - Justified text for mobile */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight text-justify sm:text-center">
            {t.topNews}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light px-2 leading-relaxed text-justify sm:text-center">
            {language === 'ar' 
              ? 'ابق على اطلاع بأحدث الأخبار والقصص من جميع أنحاء العالم'
              : language === 'ur'
              ? 'دنیا بھر کی تازہ ترین خبروں اور کہانیوں سے باخبر رہیں'
              : 'Stay informed with the latest news and stories from around the world'
            }
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 active:scale-95 text-xs sm:text-sm"
            size="sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t.loading : t.refresh}
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 focus:border-gray-500 rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 w-full"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-gray-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 transition-all duration-300 w-full">
                <SelectValue placeholder={t.filter} />
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

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {[
            { icon: BookOpen, color: 'text-gray-600', value: `${articles.length}+`, label: t.totalArticles },
            { icon: Eye, color: 'text-gray-600', value: '15K+', label: t.dailyViews },
            { icon: Users, color: 'text-gray-600', value: '50K+', label: t.readers },
            { icon: Clock, color: 'text-gray-600', value: '24/7', label: t.updated }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} mx-auto mb-1`} />
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trending Section */}
        {trendingArticles.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t.trending}</h2>
              </div>
              <Button 
                onClick={handleSeeAllTrending}
                variant="outline"
                className="border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg px-2 sm:px-3 py-1 transition-all duration-300 active:scale-95 w-full sm:w-auto text-xs sm:text-sm"
                size="sm"
              >
                {t.seeAll}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trendingArticles.map((article) => (
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
          </div>
        )}

        {/* Main Content Tabs */}
        <div id="articles-section">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6">
            <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-4 sm:mb-6 flex flex-wrap sm:flex-nowrap">
              {[
                { value: 'all', label: t.all, icon: null },
                { value: 'featured', label: t.featured, icon: Star },
                { value: 'popular', label: t.popular, icon: TrendingUp }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md px-2 sm:px-3 py-1.5 font-medium transition-all duration-300 flex-1 text-xs sm:text-sm m-0.5"
                >
                  {tab.icon && <tab.icon className="h-3 w-3 mr-1" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {['all', 'featured', 'popular'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                      {tabValue === 'featured' ? (
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      ) : tabValue === 'popular' ? (
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      ) : (
                        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-2 text-justify sm:text-center">
                        {t.noResults}
                      </p>
                      {articles.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-justify sm:text-center">
                          {language === 'ar' 
                            ? 'حاول تغيير معايير البحث أو التصفية'
                            : language === 'ur'
                            ? 'اپنے سرچ یا فلٹر کے معیارات کو تبدیل کرنے کی کوشش کریں'
                            : 'Try changing your search or filter criteria'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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