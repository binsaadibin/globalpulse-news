import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Radio, Play, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

interface VideoSidebarProps {
  videos: any[];
  onVideoClick: (video: any) => void;
}

const translations = {
  en: {
    trendingNow: 'Trending Now',
    liveNow: 'Live Now',
    advertisement: 'Advertisement',
    sponsored: 'Sponsored Content',
    learnMore: 'Learn More',
    featured: 'Featured',
    popularVideos: 'Popular Videos'
  },
  ar: {
    trendingNow: 'الأكثر انتشاراً الآن',
    liveNow: 'بث مباشر الآن',
    advertisement: 'إعلان',
    sponsored: 'محتوى مدفوع',
    learnMore: 'اكتشف المزيد',
    featured: 'مميز',
    popularVideos: 'الفيديوهات الشائعة'
  },
  ur: {
    trendingNow: 'ابھی مقبول',
    liveNow: 'ابھی لائیو',
    advertisement: 'اشتہار',
    sponsored: 'سپانسرڈ مواد',
    learnMore: 'مزید دریافت کریں',
    featured: 'نمایاں',
    popularVideos: 'مقبول ویڈیوز'
  }
};

// Helper function to get display text
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  return textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
};

// Get YouTube ID from URL for thumbnail
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  try {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Get the best quality thumbnail
const getBestThumbnail = (video: any): string => {
  // If video has thumbnail, use it
  if (video.thumbnail) return video.thumbnail;
  
  // If video has imageUrl, use it
  if (video.imageUrl) return video.imageUrl;
  
  // If it's a YouTube video, get YouTube thumbnail
  const youtubeId = getYouTubeId(video.videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  
  // Fallback to generic thumbnail
  return `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&h=90&fit=crop&auto=format`;
};

// Fetch advertisements from backend
const fetchAdvertisements = async () => {
  try {
    const response = await fetch('https://globalpulse-news-production-31ee.up.railway.app/api/advertisements/position/sidebar');
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
};

export default function VideoSidebar({ videos, onVideoClick }: VideoSidebarProps) {
  const { language } = useLanguage();
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  const t = translations[language as 'en' | 'ar' | 'ur'];

  // Get trending videos
  const trendingVideos = videos
    .filter(video => video.isTrending)
    .slice(0, 5);

  // Get live videos
  const liveVideos = videos
    .filter(video => video.isLive)
    .slice(0, 3);

  // Get featured videos
  const featuredVideos = videos
    .filter(video => video.isFeatured && !video.isLive)
    .slice(0, 4);

  // Fetch advertisements on component mount
  useEffect(() => {
    const loadAdvertisements = async () => {
      setLoadingAds(true);
      const ads = await fetchAdvertisements();
      setAdvertisements(ads);
      setLoadingAds(false);
    };
    
    loadAdvertisements();
  }, []);

  // Simple Video Card Component - Only Title on Right
  const SimpleVideoCard = ({ 
    video, 
    showRank = false, 
    rank = 0, 
    isLive = false 
  }: { 
    video: any, 
    showRank?: boolean, 
    rank?: number, 
    isLive?: boolean 
  }) => {
    const title = getDisplayText(video.title, language);
    const thumbnail = getBestThumbnail(video);

    return (
      <div 
        className="group cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 mb-2 last:mb-0"
        onClick={() => onVideoClick(video)}
      >
        <div className="flex gap-3 items-center">
          {/* Thumbnail with Simple Badge */}
          <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden">
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=64&h=48&fit=crop`;
              }}
            />
            
            {/* Simple Badge */}
            {isLive ? (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="bg-red-600 text-white text-[8px] px-1 py-0.5 text-center">
                  LIVE
                </div>
              </div>
            ) : showRank && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {rank}
                </span>
              </div>
            )}
          </div>

          {/* Title Only - Right Side */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {title}
            </h4>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full space-y-6">
      {/* Advertisement Section */}
      {!loadingAds && advertisements.length > 0 ? (
        advertisements.map((ad, index) => (
          <Card key={ad._id || index} className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                  {t.advertisement}
                </Badge>
                <span className="text-xs text-gray-500">{t.sponsored}</span>
              </div>
              
              {ad.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={ad.imageUrl} 
                    alt={getDisplayText(ad.title, language)}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {getDisplayText(ad.title, language)}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {getDisplayText(ad.description, language)}
              </p>
              
              <button 
                onClick={() => window.open(ad.targetUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                {t.learnMore}
              </button>
            </CardContent>
          </Card>
        ))
      ) : (
        // Fallback advertisement when no ads are available
        <Card className="border-2 border-dashed border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                {t.advertisement}
              </Badge>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌟</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'اكتشف عالم الأخبار' : 
               language === 'ur' ? 'خبروں کی دنیا دریافت کریں' : 
               'Discover News World'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {language === 'ar' ? 'ابقَ على اطلاع بأحدث الأخبار العالمية' : 
               language === 'ur' ? 'تازہ ترین عالمی خبروں سے اپ ڈیٹ رہیں' : 
               'Stay updated with latest global news'}
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              {t.learnMore}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Trending Now Section */}
      {trendingVideos.length > 0 && (
        <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.trendingNow}</h3>
            </div>
            <div className="space-y-1">
              {trendingVideos.map((video, index) => (
                <SimpleVideoCard 
                  key={video._id}
                  video={video}
                  showRank={true}
                  rank={index + 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Videos Section */}
      {featuredVideos.length > 0 && (
        <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Youtube className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.featured}</h3>
            </div>
            <div className="space-y-1">
              {featuredVideos.map((video) => (
                <SimpleVideoCard 
                  key={video._id}
                  video={video}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Now Section */}
      {liveVideos.length > 0 && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Radio className="h-4 w-4 text-red-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.liveNow}</h3>
            </div>
            <div className="space-y-1">
              {liveVideos.map((video) => (
                <SimpleVideoCard 
                  key={video._id}
                  video={video}
                  isLive={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}