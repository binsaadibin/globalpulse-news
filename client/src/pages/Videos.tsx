import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Import Components
import VideoModal from '@/components/videos/VideoPlayer/VideoModal';
import ShortsCarousel from '@/components/videos/ShortsCarousel/ShortsCarousel';
import FeaturedVideo from '@/components/videos/FeaturedVideo/FeaturedVideo';
import VideoSidebar from '@/components/videos/VideoSidebar/VideoSidebar';
import VideoGrid from '@/components/videos/VideoGrid/VideoGrid';

const translations = {
  en: { 
    featured: 'Featured', 
    trending: 'Trending',
    popular: 'Popular',
    search: 'Search videos...', 
    all: 'All', 
    noResults: 'No videos found',
    loading: 'Loading videos...',
    totalVideos: 'Total Videos',
    views: 'Views',
    likes: 'Likes',
    liveStreams: 'Live Streams',
    shorts: 'Shorts',
    allCategories: 'All Categories',
    sortBy: 'Sort By',
    newest: 'Newest First',
    oldest: 'Oldest First',
    mostViewed: 'Most Viewed',
    mostLiked: 'Most Liked',
    refresh: 'Refresh',
    technology: 'Technology',
    business: 'Business',
    sports: 'Sports',
    politics: 'Politics',
    environment: 'Environment',
    health: 'Health',
    news: 'News',
    entertainment: 'Entertainment'
  },
  ar: { 
    featured: 'مميز', 
    trending: 'الشائع',
    popular: 'الأكثر شهرة',
    search: 'ابحث عن الفيديوهات...', 
    all: 'الكل', 
    noResults: 'لم يتم العثور على فيديوهات',
    loading: 'جاري تحميل الفيديوهات...',
    totalVideos: 'إجمالي الفيديوهات',
    views: 'المشاهدات',
    likes: 'الإعجابات',
    liveStreams: 'البثوث المباشرة',
    shorts: 'المقاطع القصيرة',
    allCategories: 'جميع الفئات',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث أولاً',
    oldest: 'الأقدم أولاً',
    mostViewed: 'الأكثر مشاهدة',
    mostLiked: 'الأكثر إعجاباً',
    refresh: 'تحديث',
    technology: 'تكنولوجيا',
    business: 'أعمال',
    sports: 'رياضة',
    politics: 'سياسة',
    environment: 'بيئة',
    health: 'صحة',
    news: 'أخبار',
    entertainment: 'ترفيه'
  },
  ur: { 
    featured: 'نمایاں', 
    trending: 'مقبول',
    popular: 'مشہور',
    search: 'ویڈیوز تلاش کریں...', 
    all: 'تمام', 
    noResults: 'کوئی ویڈیو نہیں ملا',
    loading: 'ویڈیوز لوڈ ہو رہی ہیں...',
    totalVideos: 'کل ویڈیوز',
    views: 'ویوز',
    likes: 'لائکس',
    liveStreams: 'لائیو اسٹریمز',
    shorts: 'شارٹس',
    allCategories: 'تمام زمرے',
    sortBy: 'ترتیب دیں بذریعہ',
    newest: 'تازہ ترین پہلے',
    oldest: 'پرانی پہلے',
    mostViewed: 'سب سے زیادہ دیکھا گیا',
    mostLiked: 'سب سے زیادہ پسند کیا گیا',
    refresh: 'ریفریش',
    technology: 'ٹیکنالوجی',
    business: 'کاروبار',
    sports: 'کھیل',
    politics: 'سیاسة',
    environment: 'ماحول',
    health: 'صحة',
    news: 'خبریں',
    entertainment: 'تفریح'
  },
};

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

// Helper function
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  return textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
};

export default function Videos() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const t = translations[language as 'en' | 'ar' | 'ur'];

  // Fetch all videos from backend
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/videos`;
      console.log('🌐 Fetching all videos from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Loaded videos:', result.data?.length || result.length);
        
        let videosArray = Array.isArray(result.data) ? result.data : 
                         Array.isArray(result) ? result : [];
        setVideos(videosArray);
      } else {
        throw new Error(`Failed to load videos: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setError('Failed to load videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Process videos once
  const processedVideos = useMemo(() => {
    return videos.map(video => ({
      ...video,
      isLive: video.isLive || false,
      isShort: video.isShort || false,
      isFeatured: video.isFeatured || false,
      isTrending: video.isTrending || false,
      views: video.views || 0,
      likes: video.likes || 0,
      thumbnail: video.thumbnail || video.imageUrl,
      title: getDisplayText(video.title, language),
      description: getDisplayText(video.description, language)
    }));
  }, [videos, language]);

  // Get main featured video - LIVE first, then latest uploaded
  const mainFeaturedVideo = useMemo(() => {
    // First try to find a live video
    const liveVideo = processedVideos.find(video => video.isLive);
    if (liveVideo) return liveVideo;
    
    // Then try featured video
    const featuredVideo = processedVideos.find(video => video.isFeatured);
    if (featuredVideo) return featuredVideo;
    
    // Then return most recent
    return processedVideos
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  }, [processedVideos]);

  // Get featured content
  const featuredContent = useMemo(() => {
    const shorts = processedVideos.filter(video => video.isShort);
    const liveStreams = processedVideos.filter(video => video.isLive);
    const trending = processedVideos.filter(video => video.isTrending);

    return { shorts, liveStreams, trending };
  }, [processedVideos]);

  // Single filter function for all videos based on selected tab
  const filteredVideos = useMemo(() => {
    let filtered = [...processedVideos];

    // Apply tab-specific filtering
    switch (selectedTab) {
      case 'featured':
        filtered = filtered.filter(video => video.isFeatured);
        break;
      case 'trending':
        filtered = filtered.filter(video => video.isTrending);
        break;
      case 'popular':
        filtered = filtered.filter(video => (video.views || 0) > 1000);
        break;
      case 'live':
        filtered = filtered.filter(video => video.isLive);
        break;
      case 'shorts':
        filtered = filtered.filter(video => video.isShort);
        break;
      // 'all' shows all videos
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(video => 
        video.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Always sort by newest first (removed sort option)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [processedVideos, selectedTab, categoryFilter]);

  // Tab counts
  const getTabCount = (tabValue: string) => {
    switch (tabValue) {
      case 'all': return processedVideos.length;
      case 'featured': return processedVideos.filter(v => v.isFeatured).length;
      case 'trending': return processedVideos.filter(v => v.isTrending).length;
      case 'popular': return processedVideos.filter(v => (v.views || 0) > 1000).length;
      case 'live': return processedVideos.filter(v => v.isLive).length;
      case 'shorts': return processedVideos.filter(v => v.isShort).length;
      default: return processedVideos.length;
    }
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* Category Filter Chips - Horizontal Scroll on Mobile */}
        <div className="mb-6">
          <div className="flex items-center mb-2 px-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category:</h3>
          </div>
          
          {/* Scrollable container for mobile */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {['all', 'technology', 'business', 'sports', 'politics', 'environment', 'health', 'news', 'entertainment'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      categoryFilter === category 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category === 'all' ? t.allCategories : t[category as keyof typeof t]}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gradient fade effect on edges for mobile */}
            <div className="pointer-events-none absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent"></div>
            <div className="pointer-events-none absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent"></div>
          </div>
        </div>

        {/* Main Content with Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content - Now on LEFT */}
          <div className="lg:col-span-3">
            {/* Main Featured Video */}
            {mainFeaturedVideo && (
              <div className="mb-8">
                <FeaturedVideo 
                  video={mainFeaturedVideo}
                  onVideoClick={handleVideoClick}
                />
              </div>
            )}

            {/* Shorts Carousel */}
            {featuredContent.shorts.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-600 p-2 rounded-full">
                    <span className="text-white font-bold text-xs sm:text-sm">Shorts</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.shorts}</h2>
                  <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                    {featuredContent.shorts.length}
                  </Badge>
                </div>
                <ShortsCarousel 
                  shorts={featuredContent.shorts}
                  onShortClick={handleVideoClick}
                />
              </div>
            )}

            {/* Videos Grid with Tabs - Mobile Friendly */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                {/* Mobile-friendly tabs - Scrollable on mobile */}
                <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                  <TabsList className="w-full min-w-max bg-transparent p-1 gap-1 inline-flex">
                    {[
                      { value: 'all', label: t.all },
                      { value: 'featured', label: t.featured },
                      { value: 'trending', label: t.trending },
                      { value: 'popular', label: t.popular },
                      { value: 'live', label: t.liveStreams },
                      { value: 'shorts', label: t.shorts }
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.value}
                        value={tab.value} 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <span>{tab.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {getTabCount(tab.value)}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value={selectedTab} className="mt-6">
                  {filteredVideos.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎬</div>
                      <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-2">{t.noResults}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                        {videos.length === 0 
                          ? 'No videos available at the moment'
                          : 'Try changing your filter criteria'
                        }
                      </p>
                    </div>
                  ) : (
                    <VideoGrid
                      videos={filteredVideos}
                      onVideoClick={handleVideoClick}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar with Advertisement - Now on RIGHT */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6">
              <VideoSidebar 
                videos={processedVideos}
                onVideoClick={handleVideoClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
}