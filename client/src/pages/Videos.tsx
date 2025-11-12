import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, Youtube, Facebook, Instagram, Music, X } from 'lucide-react';

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
    activeFilters: 'Active Filters'
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
    activeFilters: 'الفلاتر النشطة'
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
    activeFilters: 'فعال فلٹرز'
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

const getPlatformIcon = (platform: string) => {
  const icons: { [key: string]: any } = {
    youtube: Youtube,
    facebook: Facebook,
    tiktok: Music,
    instagram: Instagram
  };
  return icons[platform] || Play;
};

// Function to format view counts dynamically
const formatViews = (views: number, language: string): string => {
  if (views >= 1000000) {
    const millions = (views / 1000000).toFixed(1);
    return language === 'ar' 
      ? `${millions} مليون` 
      : language === 'ur' 
      ? `${millions} ملین` 
      : `${millions}M`;
  } else if (views >= 1000) {
    const thousands = (views / 1000).toFixed(1);
    return language === 'ar' 
      ? `${thousands} ألف` 
      : language === 'ur' 
      ? `${thousands} ہزار` 
      : `${thousands}K`;
  }
  return views.toString();
};

export default function Videos() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const t = translations[language];

  // Fetch ONLY real videos from backend - NO MOCK DATA
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/videos');
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎬 Fetched videos from API:', data.length);
        // Use ONLY the data from API, no mock data
        setVideos(data);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setError('Failed to load broadcasts from server');
      setVideos([]); // Set empty array instead of mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
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

  if (loading) {
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
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <Button 
              onClick={fetchVideos}
              className="mt-4 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white"
            >
              {t.tryAgain}
            </Button>
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

        {/* Active Filters Display - Mobile & Desktop */}
        {hasActiveFilters && (
          <div className="mb-6 px-4 md:px-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.activeFilters}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Search: "{searchQuery}"
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {platformFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {formatPlatform(platformFilter, t)}
                        <button 
                          onClick={() => setPlatformFilter('all')}
                          className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t.clearFilters}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 px-4 md:px-0">
          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-base border-2 border-gray-200 dark:border-gray-600 focus:border-blue-400 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`px-3 border-2 ${
                showMobileFilters 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Panel */}
          {showMobileFilters && (
            <div className="md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t.filter}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-400 rounded-xl px-3 py-2 bg-white dark:bg-gray-800">
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <SelectItem value="all" className="py-2">{t.all}</SelectItem>
                  <SelectItem value="youtube" className="py-2">
                    {t.youtube}
                  </SelectItem>
                  <SelectItem value="facebook" className="py-2">
                    {t.facebook}
                  </SelectItem>
                  <SelectItem value="tiktok" className="py-2">
                    {t.tiktok}
                  </SelectItem>
                  <SelectItem value="instagram" className="py-2">
                    {t.instagram}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Desktop Search and Filter */}
          <div className="hidden md:flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-3 min-w-[250px]">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-xl px-4 py-3 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300">
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-xl bg-white dark:bg-gray-800">
                  <SelectItem value="all" className="text-lg py-3">{t.all}</SelectItem>
                  <SelectItem value="youtube" className="text-lg py-3 flex items-center gap-2">
                    {t.youtube}
                  </SelectItem>
                  <SelectItem value="facebook" className="text-lg py-3 flex items-center gap-2">
                    {t.facebook}
                  </SelectItem>
                  <SelectItem value="tiktok" className="text-lg py-3 flex items-center gap-2">
                    {t.tiktok}
                  </SelectItem>
                  <SelectItem value="instagram" className="text-lg py-3 flex items-center gap-2">
                    {t.instagram}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 md:px-0 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredVideos.length} {language === 'ar' ? 'بث' : language === 'ur' ? 'نشریات' : 'broadcasts'} found
            {hasActiveFilters && ` (filtered from ${videos.length})`}
          </p>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <Play className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-2">{t.noResults}</p>
              {videos.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {language === 'ar' 
                    ? 'حاول تغيير معايير البحث أو التصفية'
                    : language === 'ur'
                    ? 'اپنے سرچ یا فلٹر کے معیارات کو تبدیل کرنے کی کوشش کریں'
                    : 'Try changing your search or filter criteria'
                  }
                </p>
              )}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video._id}
                title={getDisplayText(video.title, language)}
                platform={formatPlatform(video.platform, t)}
                videoUrl={video.videoUrl}
                description={getDisplayText(video.description, language)}
                views={video.views || 0} // Use actual views from backend
                createdAt={video.createdAt}
                language={language}
                videoId={video._id} // Pass the video ID for tracking
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}