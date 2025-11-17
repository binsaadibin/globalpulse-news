import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star, BookOpen, Eye, Users, Clock, ArrowRight, RefreshCw, Grid, List } from 'lucide-react';

const translations = {
  en: { 
    topNews: 'Top Videos', 
    featured: 'Featured', 
    trending: 'Trending',
    popular: 'Popular',
    search: 'Search videos...', 
    filter: 'Filter by category', 
    all: 'All', 
    noResults: 'No videos found',
    loading: 'Loading videos...',
    seeAll: 'See All',
    totalVideos: 'Total Videos',
    dailyViews: 'Daily Views',
    viewers: 'Viewers',
    updated: 'Updated',
    technology: 'Technology',
    business: 'Business',
    sports: 'Sports',
    politics: 'Politics',
    environment: 'Environment',
    health: 'Health',
    refresh: 'Refresh',
    tryAgain: 'Try Again',
    gridView: 'Grid',
    listView: 'List'
  },
  ar: { 
    topNews: 'أهم الفيديوهات', 
    featured: 'مميز', 
    trending: 'الشائع',
    popular: 'الأكثر شهرة',
    search: 'ابحث عن الفيديوهات...', 
    filter: 'تصفية حسب الفئة', 
    all: 'الكل', 
    noResults: 'لم يتم العثور على فيديوهات',
    loading: 'جاري تحميل الفيديوهات...',
    seeAll: 'عرض الكل',
    totalVideos: 'إجمالي الفيديوهات',
    dailyViews: 'المشاهدات اليومية',
    viewers: 'المشاهدين',
    updated: 'محدث',
    technology: 'تكنولوجيا',
    business: 'أعمال',
    sports: 'رياضة',
    politics: 'سياسة',
    environment: 'بيئة',
    health: 'صحة',
    refresh: 'تحديث',
    tryAgain: 'حاول مرة أخرى',
    gridView: 'شبكة',
    listView: 'قائمة'
  },
  ur: { 
    topNews: 'اہم ویڈیوز', 
    featured: 'نمایاں', 
    trending: 'مقبول',
    popular: 'مشہور',
    search: 'ویڈیوز تلاش کریں...', 
    filter: 'زمرے کے لحاظ سے فلٹر کریں', 
    all: 'تمام', 
    noResults: 'کوئی ویڈیو نہیں ملا',
    loading: 'ویڈیوز لوڈ ہو رہی ہیں...',
    seeAll: 'سب دیکھیں',
    totalVideos: 'کل ویڈیوز',
    dailyViews: 'روزانہ ویوز',
    viewers: 'ناظرین',
    updated: 'اپ ڈیٹڈ',
    technology: 'ٹیکنالوجی',
    business: 'کاروبار',
    sports: 'کھیل',
    politics: 'سیاست',
    environment: 'ماحول',
    health: 'صحت',
    refresh: 'ریفریش',
    tryAgain: 'دوبارہ کوشش کریں',
    gridView: 'گریڈ',
    listView: 'فہرست'
  },
};

export default function Videos() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const t = translations[language as 'en' | 'ar' | 'ur'];

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      
      console.log('🔍 Fetching videos from API...');
      const response = await fetch('https://globalpulse-news-production-31ee.up.railway.app/api/videos');
      
      if (response.ok) {
        const result = await response.json();
        console.log('🎬 Raw API response:', result);
        
        // Handle different response formats
        let videosArray = [];
        
        if (Array.isArray(result)) {
          videosArray = result;
        } else if (result && Array.isArray(result.data)) {
          videosArray = result.data;
        } else if (result && Array.isArray(result.videos)) {
          videosArray = result.videos;
        } else {
          console.warn('⚠️ API response structure unexpected:', result);
          videosArray = [];
        }
        
        console.log(`✅ Successfully loaded ${videosArray.length} videos from backend`);
        
        // Log video details for debugging
        videosArray.forEach((video: any, index: number) => {
          console.log(`🎥 Video ${index + 1}:`, {
            id: video._id,
            title: video.title,
            videoUrl: video.videoUrl,
            imageUrl: video.imageUrl,
            thumbnail: video.thumbnail,
            hasVideoUrl: !!video.videoUrl,
            hasImageUrl: !!video.imageUrl,
            hasThumbnail: !!video.thumbnail
          });
        });
        
        setVideos(videosArray);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setError('Failed to load videos from server');
      setVideos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    
    const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
    
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

  // Function to get the best available image URL for a video
  const getVideoImageUrl = (video: any): string => {
    return video.imageUrl || video.thumbnail || video.coverImage || '';
  };

  // Function to get the video URL
  const getVideoUrl = (video: any): string => {
    return video.videoUrl || video.url || video.mediaUrl || '';
  };

  const filteredVideos = useMemo(() => {
    const safeVideos = Array.isArray(videos) ? videos : [];
    
    let filtered = safeVideos.filter(video => {
      if (!video) return false;
      
      const videoTitle = getDisplayText(video.title);
      
      const matchesSearch = searchQuery === '' || 
        videoTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        video.category?.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });

    if (selectedTab === 'featured') {
      filtered = filtered.filter(video => video.isFeatured);
    } else if (selectedTab === 'popular') {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedTab === 'trending') {
      filtered = filtered.filter(video => video.isTrending);
    }

    return filtered;
  }, [videos, searchQuery, categoryFilter, selectedTab, language]);

  const trendingVideos = useMemo(() => {
    const safeVideos = Array.isArray(videos) ? videos : [];
    return safeVideos
      .filter(video => video?.isTrending)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 4);
  }, [videos]);

  const featuredVideos = useMemo(() => {
    const safeVideos = Array.isArray(videos) ? videos : [];
    return safeVideos
      .filter(video => video?.isFeatured)
      .slice(0, 4);
  }, [videos]);

  const handleSeeAllTrending = () => {
    setSelectedTab('trending');
    setCategoryFilter('all');
    setSearchQuery('');
    setTimeout(() => {
      document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSeeAllFeatured = () => {
    setSelectedTab('featured');
    setCategoryFilter('all');
    setSearchQuery('');
    setTimeout(() => {
      document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const handleRefresh = () => {
    fetchVideos();
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
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

  if (error && videos.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
              <Button 
                onClick={fetchVideos}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95"
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {t.topNews}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            {language === 'ar' 
              ? 'شاهد أحدث الفيديوهات من جميع أنحاء العالم'
              : language === 'ur'
              ? 'دنیا بھر کی تازہ ترین ویڈیوز دیکھیں'
              : 'Watch the latest videos from around the world'
            }
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 active:scale-95 text-xs sm:text-sm"
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
              className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 focus:border-red-500 rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 w-full"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-red-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 transition-all duration-300 w-full">
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
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Section - Only show if we have videos */}
        {videos.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            {[
              { icon: BookOpen, color: 'text-gray-600', value: `${videos.length}+`, label: t.totalVideos },
              { icon: Eye, color: 'text-gray-600', value: `${videos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}+`, label: t.dailyViews },
              { icon: Users, color: 'text-gray-600', value: `${videos.reduce((sum, video) => sum + (video.likes || 0), 0).toLocaleString()}+`, label: t.viewers },
              { icon: Clock, color: 'text-gray-600', value: '24/7', label: t.updated }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3 md:p-4 text-center border border-gray-200 dark:border-gray-700">
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} mx-auto mb-1`} />
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Trending Section - Only show if we have trending videos */}
        {trendingVideos.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t.trending}</h2>
              </div>
              <Button 
                onClick={handleSeeAllTrending}
                variant="ghost"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg px-2 sm:px-3 py-1 transition-all duration-300 active:scale-95 w-full sm:w-auto text-xs sm:text-sm"
                size="sm"
              >
                {t.seeAll}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className={`grid gap-3 sm:gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {trendingVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  title={getDisplayText(video.title)}
                  platform={video.platform || 'youtube'}
                  videoUrl={getVideoUrl(video)}
                  views={video.views || 0}
                  createdAt={video.createdAt}
                  language={language}
                  videoId={video._id}
                  thumbnailUrl={getVideoImageUrl(video)}
                  className={viewMode === 'list' ? 'flex-row h-32' : ''}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured Section - Only show if we have featured videos */}
        {featuredVideos.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t.featured}</h2>
              </div>
              <Button 
                onClick={handleSeeAllFeatured}
                variant="ghost"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg px-2 sm:px-3 py-1 transition-all duration-300 active:scale-95 w-full sm:w-auto text-xs sm:text-sm"
                size="sm"
              >
                {t.seeAll}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className={`grid gap-3 sm:gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {featuredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  title={getDisplayText(video.title)}
                  platform={video.platform || 'youtube'}
                  videoUrl={getVideoUrl(video)}
                  views={video.views || 0}
                  createdAt={video.createdAt}
                  language={language}
                  videoId={video._id}
                  thumbnailUrl={getVideoImageUrl(video)}
                  className={viewMode === 'list' ? 'flex-row h-32' : ''}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <div id="videos-section">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6">
            <TabsList className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-4 sm:mb-6 flex flex-wrap sm:flex-nowrap">
              {[
                { value: 'all', label: t.all, icon: null },
                { value: 'featured', label: t.featured, icon: Star },
                { value: 'trending', label: t.trending, icon: TrendingUp },
                { value: 'popular', label: t.popular, icon: TrendingUp }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md px-2 sm:px-3 py-1.5 font-medium transition-all duration-300 flex-1 text-xs sm:text-sm m-0.5"
                >
                  {tab.icon && <tab.icon className="h-3 w-3 mr-1" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {['all', 'featured', 'trending', 'popular'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                      {tabValue === 'featured' ? (
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      ) : tabValue === 'trending' ? (
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      ) : tabValue === 'popular' ? (
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      ) : (
                        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-2">
                        {t.noResults}
                      </p>
                      {videos.length === 0 ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'ar' 
                            ? 'لا توجد فيديوهات متاحة حالياً'
                            : language === 'ur'
                            ? 'فی الحال کوئی ویڈیوز دستیاب نہیں ہیں'
                            : 'No videos available at the moment'
                          }
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  <div className={`grid gap-3 sm:gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video._id}
                        title={getDisplayText(video.title)}
                        platform={video.platform || 'youtube'}
                        videoUrl={getVideoUrl(video)}
                        views={video.views || 0}
                        createdAt={video.createdAt}
                        language={language}
                        videoId={video._id}
                        thumbnailUrl={getVideoImageUrl(video)}
                        className={viewMode === 'list' ? 'flex-row h-32' : ''}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}