import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import Components
import ArticleModal from '@/components/articles/ArticleModal/ArticleModal';
import FeaturedArticle from '@/components/articles/FeaturedArticle/FeaturedArticle';
import LiveNewsTicker from '@/components/articles/LiveNewsTicker/LiveNewsTicker';
import HorizontalScrollCards from '@/components/articles/HorizontalScrollCards/HorizontalScrollCards';
import ArticleSidebar from '@/components/articles/ArticleSidebar/ArticleSidebar';
import ArticleFilters from '@/components/articles/ArticleFilters/ArticleFilters';
import ArticleGrid from '@/components/articles/ArticleGrid/ArticleGrid';
import Advertisement from '@/components/articles/Advertisement/Advertisement';
import VideoShortsCarousel from '@/components/articles/VideoShortsCarousel/VideoShortsCarousel';

const translations = {
  en: { 
    topNews: 'Global Pulse News', 
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
    recommended: 'Recommended For You',
    videoShorts: 'Video Shorts',
    latestVideos: 'Latest Videos'
  },
  ar: { 
    topNews: 'جلوبال بولس نيوز', 
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
    recommended: 'مقترح لك',
    videoShorts: 'مقاطع فيديو قصيرة',
    latestVideos: 'أحدث الفيديوهات'
  },
  ur: { 
    topNews: 'گلوبل پلس نیوز', 
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
    politics: 'سیاسة',
    environment: 'ماحول',
    health: 'صحة',
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
    recommended: 'آپ کے لیے تجویز کردہ',
    videoShorts: 'ویڈیو شارٹس',
    latestVideos: 'تازہ ترین ویڈیوز'
  },
};

export default function Home() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const t = translations[language as 'en' | 'ar' | 'ur'];

  // Helper function to safely extract array data from API responses
  const extractArrayData = (data: any): any[] => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.articles && Array.isArray(data.articles)) return data.articles;
    if (data.videos && Array.isArray(data.videos)) return data.videos;
    if (data.advertisements && Array.isArray(data.advertisements)) return data.advertisements;
    if (data.success && Array.isArray(data.data)) return data.data;
    
    console.warn('No array data found in response:', data);
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      
      const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
      
      // Fetch articles
      const articlesResponse = await fetch(`${API_BASE_URL}/api/articles`);
      if (!articlesResponse.ok) throw new Error('Failed to load articles');
      const articlesData = await articlesResponse.json();
      const articlesArray = extractArrayData(articlesData);
      console.log(`✅ Successfully loaded ${articlesArray.length} articles`);
      setArticles(articlesArray);

      // Fetch videos
      const videosResponse = await fetch(`${API_BASE_URL}/api/videos`);
      if (!videosResponse.ok) throw new Error('Failed to load videos');
      const videosData = await videosResponse.json();
      const videosArray = extractArrayData(videosData);
      console.log(`✅ Successfully loaded ${videosArray.length} videos`);
      setVideos(videosArray);

      // Fetch advertisements from API
      try {
        console.log('📢 Fetching advertisements from API...');
        const adsResponse = await fetch(`${API_BASE_URL}/api/advertisements`);
        
        if (adsResponse.ok) {
          const adsData = await adsResponse.json();
          const adsArray = extractArrayData(adsData);
          console.log(`✅ Successfully loaded ${adsArray.length} advertisements from API`);
          setAdvertisements(adsArray);
        } else if (adsResponse.status === 404) {
          console.log('📢 Advertisements endpoint not found (404)');
          setAdvertisements([]);
        } else {
          console.warn('❌ Failed to fetch advertisements:', adsResponse.status);
          setAdvertisements([]);
        }
      } catch (adsError) {
        console.log('📢 Advertisements endpoint not available:', adsError);
        setAdvertisements([]);
      }

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Failed to load data from server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Process data
  const processedArticles = useMemo(() => {
    return articles.map(article => ({
      ...article,
      createdAt: article.createdAt ? new Date(article.createdAt).toISOString() : new Date().toISOString()
    }));
  }, [articles]);

  const processedVideos = useMemo(() => {
    return videos.map(video => ({
      ...video,
      isShort: video.isShort || (video.duration && video.duration < 60),
      createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString()
    }));
  }, [videos]);

  // Filter active advertisements
  const activeAdvertisements = useMemo(() => {
    console.log('🔍 Filtering active advertisements from:', advertisements.length);
    
    const activeAds = advertisements.filter(ad => {
      // Check if ad is active
      if (!ad.isActive) {
        return false;
      }
      
      // Check date range
      const now = new Date();
      const startDate = ad.startDate ? new Date(ad.startDate) : new Date();
      const endDate = ad.endDate ? new Date(ad.endDate) : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      
      return now >= startDate && now <= endDate;
    });
    
    console.log('🔍 Active advertisements after filtering:', activeAds.length);
    return activeAds;
  }, [advertisements]);

  // Get the LAST uploaded article (most recent by creation date) for main story
  const mainFeaturedArticle = useMemo(() => {
    const safeArticles = Array.isArray(processedArticles) ? processedArticles : [];
    if (safeArticles.length === 0) return null;
    
    // Sort by creation date DESC (newest first)
    const sortedByDate = [...safeArticles].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || a.publishedAt || a.published_at || Date.now());
      const dateB = new Date(b.createdAt || b.created_at || b.publishedAt || b.published_at || Date.now());
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('📅 Main story article date:', sortedByDate[0]?.createdAt);
    console.log('📅 Main story article title:', sortedByDate[0]?.title?.en);
    
    return sortedByDate[0];
  }, [processedArticles]);

  // Get remaining articles (excluding the main featured article)
  const remainingArticles = useMemo(() => {
    const safeArticles = Array.isArray(processedArticles) ? processedArticles : [];
    if (!mainFeaturedArticle) return safeArticles;
    return safeArticles.filter(article => article._id !== mainFeaturedArticle._id);
  }, [processedArticles, mainFeaturedArticle]);

  // Get trending articles (excluding main featured)
  const trendingArticles = useMemo(() => {
    return remainingArticles
      .filter(article => article?.isTrending)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 8);
  }, [remainingArticles]);

  // Get featured articles (excluding main featured)
  const featuredArticles = useMemo(() => {
    return remainingArticles
      .filter(article => article?.isFeatured)
      .slice(0, 8);
  }, [remainingArticles]);

  // Get shorts videos
  const shortsVideos = useMemo(() => {
    return processedVideos
      .filter(video => video.isShort)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);
  }, [processedVideos]);

  // Get latest videos
  const latestVideos = useMemo(() => {
    return processedVideos
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [processedVideos]);

  // Get live articles
  const liveArticles = useMemo(() => {
    return processedArticles.slice(0, 5);
  }, [processedArticles]);

  // Filter articles based on selected criteria
  const filteredArticles = useMemo(() => {
    let filtered = remainingArticles.filter(article => {
      if (!article) return false;
      
      const articleTitle = getDisplayText(article.title, language);
      const articleDescription = getDisplayText(article.description, language);
      
      const matchesSearch = searchQuery === '' || 
        articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        articleDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        article.category?.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });

    // Apply tab-specific filtering
    if (selectedTab === 'featured') {
      filtered = filtered.filter(article => article.isFeatured);
    } else if (selectedTab === 'popular') {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedTab === 'trending') {
      filtered = filtered.filter(article => article.isTrending);
    } else if (selectedTab === 'all') {
      // For 'all' tab, show newest articles first
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.publishedAt || a.published_at || Date.now());
        const dateB = new Date(b.createdAt || b.created_at || b.publishedAt || b.published_at || Date.now());
        return dateB.getTime() - dateA.getTime();
      });
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
  };

  const handleRefresh = () => {
    fetchData();
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

  if (error && articles.length === 0 && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-4xl mb-4">😔</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Content</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
        {/* Error Banner - Only shown if there's an error */}
        {error && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-red-600 dark:text-red-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Connection Issue
                  </p>
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="text-red-800 hover:text-red-900 dark:text-red-300 dark:hover:text-red-200 text-sm font-medium px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-md transition-colors w-full sm:w-auto text-center"
              >
                {t.refresh}
              </button>
            </div>
          </div>
        )}

        {/* Live News Ticker */}
        <div className="mb-4 sm:mb-6">
          {liveArticles.length > 0 && (
            <LiveNewsTicker articles={liveArticles} />
          )}
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Main Featured Article - LAST UPLOADED */}
            {mainFeaturedArticle && (
              <div className="mb-6 sm:mb-8">
                <FeaturedArticle 
                  article={mainFeaturedArticle}
                  onReadMore={handleReadMore}
                />
              </div>
            )}

            {/* Video Shorts Carousel */}
            {shortsVideos.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <VideoShortsCarousel 
                  videos={shortsVideos}
                  title={t.videoShorts}
                />
              </div>
            )}

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <HorizontalScrollCards 
                  articles={trendingArticles}
                  title={t.trending}
                  onReadMore={handleReadMore}
                  variant="trending"
                />
              </div>
            )}

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <HorizontalScrollCards 
                  articles={featuredArticles}
                  title={t.featured}
                  onReadMore={handleReadMore}
                  variant="featured"
                />
              </div>
            )}

            {/* Advertisement Section */}
            <div className="mb-6 sm:mb-8">
              {activeAdvertisements.length > 0 ? (
                <Advertisement 
                  ads={activeAdvertisements.filter(ad => ad.position === 'inline')}
                  position="inline" 
                />
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement space available</p>
                </div>
              )}
            </div>

            {/* Article Filters - Only tabs and category filters */}
            <div className="mb-4 sm:mb-6">
              <ArticleFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </div>

            {/* Main Articles Grid */}
            <div id="articles-section">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📰</div>
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-2">{t.noResults}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                    {articles.length === 0 
                      ? 'No articles available at the moment'
                      : 'Try changing your filter criteria'
                    }
                  </p>
                </div>
              ) : (
                <ArticleGrid
                  articles={filteredArticles}
                  onReadMore={handleReadMore}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Hidden on small screens, shown on large screens */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            <ArticleSidebar 
              articles={processedArticles}
              videos={latestVideos}
              onReadMore={handleReadMore}
              ads={activeAdvertisements.filter(ad => ad.position === 'sidebar')}
            />
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

// Helper function
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  return textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
};