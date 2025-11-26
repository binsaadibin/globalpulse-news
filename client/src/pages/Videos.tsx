import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';
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
  Grid, 
  List,
  Play,
  Radio,
  Youtube,
  Flame,
  Crown,
  Zap,
  ChevronLeft,
  ChevronRight,
  Circle,
  User,
  History
} from 'lucide-react';

const translations = {
  en: { 
    topVideos: 'Top Videos', 
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
    listView: 'List',
    shorts: 'Shorts',
    liveNow: 'Live Now',
    subscribe: 'Subscribe',
    watching: 'watching',
    trendingShorts: 'Trending Shorts',
    featuredStreams: 'Featured Streams',
    latestUploads: 'Latest Uploads',
    popularChannels: 'Popular Channels',
    liveStreams: 'Live Streams',
    recommendedChannels: 'Recommended Channels',
    liveNow: 'Live Now',
    yourChannels: 'Your Channels',
    exploreChannels: 'Explore Channels',
    exploreShorts: 'Explore Shorts',
    watchNow: 'Watch Now'
  },
  ar: { 
    topVideos: 'أهم الفيديوهات', 
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
    listView: 'قائمة',
    shorts: 'Shorts',
    liveNow: 'بث مباشر الآن',
    subscribe: 'اشترك',
    watching: 'مشاهدين',
    trendingShorts: 'Shorts الرائجة',
    featuredStreams: 'البثوث المميزة',
    latestUploads: 'آخر التحميلات',
    popularChannels: 'القنوات الشهيرة',
    liveStreams: 'البثوث المباشرة',
    recommendedChannels: 'القنوات الموصى بها',
    liveNow: 'بث مباشر الآن',
    yourChannels: 'قنواتك',
    exploreChannels: 'استكشف القنوات',
    exploreShorts: 'استكشف الShorts',
    watchNow: 'شاهد الآن'
  },
  ur: { 
    topVideos: 'اہم ویڈیوز', 
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
    listView: 'فہرست',
    shorts: 'شارٹس',
    liveNow: 'ابھی لائیو',
    subscribe: 'سبسکرائب کریں',
    watching: 'دیکھ رہے ہیں',
    trendingShorts: 'مقبول شارٹس',
    featuredStreams: 'نمایاں اسٹریمز',
    latestUploads: 'تازہ اپ لوڈز',
    popularChannels: 'مقبول چینلز',
    liveStreams: 'لائیو اسٹریمز',
    recommendedChannels: 'تجویز کردہ چینلز',
    liveNow: 'ابھی لائیو',
    yourChannels: 'آپ کے چینلز',
    exploreChannels: 'چینلز دریافت کریں',
    exploreShorts: 'شارٹس دریافت کریں',
    watchNow: 'ابھی دیکھیں'
  },
};

// YouTube Shorts Carousel Component
function ShortsCarousel({ videos, onVideoClick }: { 
  videos: any[]; 
  onVideoClick: (video: any) => void;
}) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="mb-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-full">
            <Youtube className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.trendingShorts}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t.exploreShorts}</p>
          </div>
          <Badge className="bg-red-600 text-white border-0 animate-pulse">
            HOT
          </Badge>
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
          {videos.map((video, index) => (
            <Card 
              key={video._id} 
              className="min-w-[280px] max-w-[280px] cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-b from-gray-900 to-black shadow-lg"
              onClick={() => onVideoClick(video)}
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl">
                <img 
                  src={video.imageUrl || video.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop'} 
                  alt={video.title?.en || 'Short video'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* YouTube Shorts Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-600 text-white text-xs border-0 font-bold">
                    SHORTS
                  </Badge>
                </div>
                
                {/* Index Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-black/70 text-white text-xs border-0">
                    #{index + 1}
                  </Badge>
                </div>
                
                {/* View Count */}
                <div className="absolute bottom-16 left-3">
                  <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center">
                    <Eye className="h-4 w-4 mr-1.5" />
                    {(video.views || 0).toLocaleString()} views
                  </div>
                </div>
                
                {/* Video Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-base line-clamp-2 leading-tight drop-shadow-lg">
                    {video.title?.en || video.title}
                  </h3>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-xl">
                  <div className="bg-red-600 rounded-full p-4 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Scroll Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 pointer-events-none rounded-l-2xl" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-red-50 to-transparent dark:from-red-950/20 pointer-events-none rounded-r-2xl" />
      </div>

      {/* View All Shorts Button */}
      <div className="text-center mt-6">
        <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2 rounded-full shadow-lg">
          <Play className="h-4 w-4 mr-2" />
          {t.watchNow}
        </Button>
      </div>
    </div>
  );
}

// Sidebar Channels Component
function SidebarChannels({ channels, onChannelClick }: { 
  channels: any[]; 
  onChannelClick: (channel: any) => void;
}) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.recommendedChannels}</h3>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            {t.seeAll}
          </Button>
        </div>
        <div className="space-y-3">
          {channels.map((channel, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => onChannelClick(channel)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{channel.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {channel.name}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {channel.subscribers}
                </p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs px-3">
                {t.subscribe}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Sidebar Live Streams Component
function SidebarLiveStreams({ streams, onStreamClick }: { 
  streams: any[]; 
  onStreamClick: (stream: any) => void;
}) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  if (streams.length === 0) return null;

  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-5 text-red-600" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.liveNow}</h3>
          </div>
          <Badge className="bg-red-600 text-white border-0 animate-pulse text-xs">
            LIVE
          </Badge>
        </div>
        <div className="space-y-3">
          {streams.slice(0, 3).map((stream) => (
            <div 
              key={stream._id}
              className="cursor-pointer group"
              onClick={() => onStreamClick(stream)}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <img 
                  src={stream.imageUrl || stream.thumbnail || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop'} 
                  alt={stream.title?.en || 'Live stream'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-600 text-white text-xs border-0 flex items-center">
                    <Circle className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse fill-white" />
                    LIVE
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {Math.floor(Math.random() * 5000).toLocaleString()}
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {stream.title?.en || stream.title}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Global Pulse Live</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions Sidebar Component
function QuickActionsSidebar() {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  const quickActions = [
    { icon: User, label: t.yourChannels, color: 'text-blue-600' },
    { icon: History, label: t.latestUploads, color: 'text-green-600' },
    { icon: Flame, label: t.trending, color: 'text-orange-600' },
    { icon: Star, label: t.featured, color: 'text-purple-600' },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">{t.exploreChannels}</h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
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

  const getVideoImageUrl = (video: any): string => {
    return video.imageUrl || video.thumbnail || video.coverImage || '';
  };

  const getVideoUrl = (video: any): string => {
    return video.videoUrl || video.url || video.mediaUrl || '';
  };

  // Enhanced video data processing
  const processedVideos = useMemo(() => {
    return videos.map(video => ({
      ...video,
      // Mark videos as shorts based on duration or title (backend integration)
      isShort: video.duration < 60 || 
               video.title?.en?.toLowerCase().includes('short') || 
               video.title?.ar?.includes('قصير') ||
               video.title?.ur?.includes('شارٹ') ||
               video.category === 'shorts',
      // Mark as live streams
      isLive: video.isLive || video.category === 'live',
      // Add mock duration for videos
      duration: video.duration || Math.floor(Math.random() * 600) + 60 // 1-10 minutes
    }));
  }, [videos]);

  // Filter videos for different sections - BACKEND INTEGRATED
  const shortsVideos = useMemo(() => {
    return processedVideos
      .filter(video => video.isShort)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 12);
  }, [processedVideos]);

  const liveStreams = useMemo(() => {
    return processedVideos
      .filter(video => video.isLive)
      .slice(0, 6);
  }, [processedVideos]);

  const trendingVideos = useMemo(() => {
    return processedVideos
      .filter(video => video?.isTrending && !video.isShort && !video.isLive)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 8);
  }, [processedVideos]);

  const featuredVideos = useMemo(() => {
    return processedVideos
      .filter(video => video?.isFeatured && !video.isShort && !video.isLive)
      .slice(0, 8);
  }, [processedVideos]);

  const filteredVideos = useMemo(() => {
    const safeVideos = Array.isArray(processedVideos) ? processedVideos : [];
    
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
    } else if (selectedTab === 'shorts') {
      filtered = filtered.filter(video => video.isShort);
    } else if (selectedTab === 'live') {
      filtered = filtered.filter(video => video.isLive);
    }

    return filtered;
  }, [processedVideos, searchQuery, categoryFilter, selectedTab, language]);

  // Mock channels data
  const popularChannels = [
    { name: 'Global Pulse News', subscribers: '2.1M subscribers' },
    { name: 'Tech Today', subscribers: '1.5M subscribers' },
    { name: 'Sports World', subscribers: '1.2M subscribers' },
    { name: 'Politics Now', subscribers: '900K subscribers' },
    { name: 'Health & Wellness', subscribers: '750K subscribers' },
    { name: 'Environment Watch', subscribers: '600K subscribers' },
  ];

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleChannelClick = (channel: any) => {
    // Navigate to channel page or filter by channel
    console.log('Channel clicked:', channel);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
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
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t.topVideos}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'شاهد أحدث الفيديوهات من جميع أنحاء العالم'
              : language === 'ur'
              ? 'دنیا بھر کی تازہ ترین ویڈیوز دیکھیں'
              : 'Watch the latest videos from around the world'
            }
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-semibold rounded-lg px-4 py-2 transition-all duration-300 active:scale-95 shadow-sm"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t.loading : t.refresh}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3/4 width */}
          <div className="lg:col-span-3">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-red-500 rounded-lg bg-white dark:bg-gray-900 w-full shadow-sm"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-red-500 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 w-full shadow-sm">
                    <SelectValue placeholder={t.filter} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-900">
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
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 ${viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 ${viewMode === 'list' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            {videos.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: BookOpen, color: 'text-gray-600', value: `${videos.length}+`, label: t.totalVideos },
                  { icon: Eye, color: 'text-gray-600', value: `${videos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}+`, label: t.dailyViews },
                  { icon: Users, color: 'text-gray-600', value: `${videos.reduce((sum, video) => sum + (video.likes || 0), 0).toLocaleString()}+`, label: t.viewers },
                  { icon: Clock, color: 'text-gray-600', value: '24/7', label: t.updated }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                    <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
                    <div className="text-base font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Content Tabs - TOP SECTION */}
            <div id="videos-section" className="mb-8">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-6 flex flex-wrap">
                  {[
                    { value: 'all', label: t.all, icon: null },
                    { value: 'trending', label: t.trending, icon: TrendingUp },
                    { value: 'featured', label: t.featured, icon: Star },
                    { value: 'shorts', label: t.shorts, icon: Zap },
                    { value: 'live', label: t.liveStreams, icon: Radio },
                    { value: 'popular', label: t.popular, icon: Flame }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md px-4 py-2 font-medium transition-all duration-300 flex-1 text-sm m-0.5 data-[state=active]:shadow-md"
                    >
                      {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {['all', 'trending', 'featured', 'shorts', 'live', 'popular'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    {filteredVideos.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">{t.noResults}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {videos.length === 0 
                            ? 'No videos available at the moment'
                            : 'Try changing your search or filter criteria'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className={`grid gap-4 ${
                        viewMode === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {filteredVideos.slice(0, 6).map((video) => (
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

            {/* SEPARATE SHORTS CAROUSEL - MIDDLE OF PAGE */}
            {shortsVideos.length > 0 && (
              <ShortsCarousel 
                videos={shortsVideos}
                onVideoClick={handleVideoClick}
              />
            )}

            {/* Continue with remaining videos */}
            {filteredVideos.length > 6 && (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredVideos.slice(6).map((video) => (
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
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            {/* Channels Sidebar */}
            <SidebarChannels 
              channels={popularChannels}
              onChannelClick={handleChannelClick}
            />

            {/* Live Streams Sidebar */}
            <SidebarLiveStreams 
              streams={liveStreams}
              onStreamClick={handleVideoClick}
            />

            {/* Quick Actions Sidebar */}
            <QuickActionsSidebar />
          </div>
        </div>
      </div>

      {/* Video Modal for playing videos */}
      {selectedVideo && (
        <div className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center ${isVideoModalOpen ? 'block' : 'hidden'}`}>
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={handleVideoModalClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(getVideoUrl(selectedVideo))}?autoplay=1&rel=0`}
                  title={getDisplayText(selectedVideo.title)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-4 bg-gray-900 text-white">
                <h3 className="text-xl font-bold mb-2">{getDisplayText(selectedVideo.title)}</h3>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>Global Pulse</span>
                  <div className="flex items-center space-x-4">
                    <span>{selectedVideo.views || 0} views</span>
                    <span>{new Date(selectedVideo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to extract YouTube ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
}