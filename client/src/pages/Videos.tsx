import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, Youtube, Facebook, Instagram, Music, X, RefreshCw } from 'lucide-react';

const translations = {
  en: { 
    videos: 'News & Broadcasts', 
    watch: 'Watch Now', 
    search: 'Search broadcasts...', 
    filter: 'Filter by platform', 
    all: 'All Platforms', 
    noResults: 'No broadcasts found',
    loading: 'Loading broadcasts...',
    youtube: 'YouTube',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    views: 'views',
    tryAgain: 'Try Again',
    featured: 'Featured Broadcasts',
    enjoy: 'Stay updated with the latest news broadcasts and video content',
    clearFilters: 'Clear Filters',
    activeFilters: 'Active Filters',
    refresh: 'Refresh'
  },
  ar: { 
    videos: 'الأخبار والبثوث', 
    watch: 'شاهد الآن', 
    search: 'ابحث في البثوث...', 
    filter: 'تصفية حسب المنصة', 
    all: 'جميع المنصات', 
    noResults: 'لم يتم العثور على بثوث',
    loading: 'جاري تحميل البثوث...',
    youtube: 'يوتيوب',
    facebook: 'فيسبوك',
    tiktok: 'تيك توك',
    instagram: 'إنستغرام',
    views: 'مشاهدة',
    tryAgain: 'حاول مرة أخرى',
    featured: 'البثوث المميزة',
    enjoy: 'ابق على اطلاع بأحدث بثوث الأخبار والمحتوى المرئي',
    clearFilters: 'مسح الفلاتر',
    activeFilters: 'الفلاتر النشطة',
    refresh: 'تحديث'
  },
  ur: { 
    videos: 'خبریں اور نشریات', 
    watch: 'ابھی دیکھیں', 
    search: 'نشریات تلاش کریں...', 
    filter: 'پلیٹ فارم کے مطابق فلٹر کریں', 
    all: 'تمام پلیٹ فارمز', 
    noResults: 'کوئی نشریات نہیں ملی',
    loading: 'نشریات لوڈ ہو رہی ہیں...',
    youtube: 'یوٹیوب',
    facebook: 'فیس بک',
    tiktok: 'ٹک ٹاک',
    instagram: 'انسٹاگرام',
    views: 'ویوز',
    tryAgain: 'دوبارہ کوشش کریں',
    featured: 'نمایاں نشریات',
    enjoy: 'تازہ ترین خبروں کی نشریات اور ویڈیو مواد سے اپ ڈیٹ رہیں',
    clearFilters: 'فلٹرز صاف کریں',
    activeFilters: 'فعال فلٹرز',
    refresh: 'ریفریش'
  },
};

// Helper function to safely extract text from multilingual objects
const getDisplayText = (textObject: any, currentLanguage: string = 'en'): string => {
  if (!textObject) return '';
  
  if (typeof textObject === 'string') {
    return textObject;
  }
  
  // Handle multilingual object
  return textObject[currentLanguage] || textObject.en || textObject.ar || textObject.ur || '';
};

const formatPlatform = (platform: string, t: any) => {
  const platformMap: { [key: string]: string } = {
    youtube: t.youtube,
    facebook: t.facebook,
    tiktok: t.tiktok,
    instagram: t.instagram
  };
  return platformMap[platform] || platform;
};

export default function Videos() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const t = translations[language];

  // Fetch ONLY real videos from backend
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      
      const response = await fetch('https://globalpulse-news-production-31ee.up.railway.app/api/videos');
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎬 Fetched videos from API:', data.length);
        setVideos(data);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setError('Failed to load broadcasts from server');
      setVideos([]); // NO MOCK DATA
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (videos.length === 0) return [];
    
    const filtered = videos.filter(video => {
      // Safely extract text for filtering
      const videoTitle = getDisplayText(video.title, language);
      const videoDescription = getDisplayText(video.description, language);
      
      const matchesSearch = searchQuery === '' ||
        videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        videoDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = platformFilter === 'all' ||
        (video.platform?.toLowerCase() === platformFilter.toLowerCase());

      return matchesSearch && matchesPlatform;
    });
    
    return filtered;
  }, [videos, searchQuery, platformFilter, language]);

  const clearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setShowMobileFilters(false);
  };

  const hasActiveFilters = searchQuery !== '' || platformFilter !== 'all';

  const handleRefresh = () => {
    fetchVideos();
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{t.loading}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
              <Button 
                onClick={fetchVideos}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 text-sm font-semibold mb-4 border-0">
            <Play className="h-4 w-4 mr-2" />
            {t.featured}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            {t.videos}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light px-4">
            {t.enjoy}
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-900/20 font-semibold rounded-lg px-4 py-2 transition-all duration-300"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t.loading : t.refresh}
          </Button>
        </div>

        {/* No Videos Message */}
        {videos.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <Play className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.noResults}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {language === 'ar' 
                  ? 'لا توجد بثوث متاحة حالياً'
                  : language === 'ur'
                  ? 'فی الحال کوئی نشریات دستیاب نہیں ہیں'
                  : 'No broadcasts available at the moment'
                }
              </p>
              <Button 
                onClick={handleRefresh}
                className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.refresh}
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter Section - Only show if we have videos */}
        {videos.length > 0 && (
          <>
            {/* ... (keep your existing search and filter UI) ... */}
          </>
        )}

        {/* Videos Grid - Only show if we have videos */}
        {videos.length > 0 && filteredVideos.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <Play className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-2">{t.noResults}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === 'ar' 
                  ? 'حاول تغيير معايير البحث أو التصفية'
                  : language === 'ur'
                  ? 'اپنے سرچ یا فلٹر کے معیارات کو تبدیل کرنے کی کوشش کریں'
                  : 'Try changing your search or filter criteria'
                }
              </p>
              {hasActiveFilters && (
                <Button 
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  {t.clearFilters}
                </Button>
              )}
            </div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video._id}
                title={getDisplayText(video.title, language)}
                platform={formatPlatform(video.platform, t)}
                videoUrl={video.videoUrl}
                description={getDisplayText(video.description, language)}
                views={video.views || 0}
                createdAt={video.createdAt}
                language={language}
                videoId={video._id}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}