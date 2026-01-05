import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, Clock, TrendingUp, BookOpen, Star, Play, Zap } from 'lucide-react';
import Advertisement from '../Advertisement/Advertisement';

interface ArticleSidebarProps {
  articles: any[];
  videos: any[];
  onReadMore: (article: any) => void;
  ads: any[];
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ articles, videos, onReadMore, ads }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      trendingVideos: 'Trending Videos',
      breakingNews: 'Breaking News',
      recommended: 'Recommended For You',
      latestVideos: 'Latest Videos',
      liveNews: 'Live News',
      views: 'views',
      watchNow: 'Watch Now',
      readNow: 'Read Now',
      justNow: 'Just now',
      minutesAgo: 'minutes ago'
    },
    ar: {
      trendingVideos: 'الفيديوهات الشائعة',
      breakingNews: 'أخبار عاجلة',
      recommended: 'مقترح لك',
      latestVideos: 'أحدث الفيديوهات',
      liveNews: 'أخبار مباشرة',
      views: 'مشاهدة',
      watchNow: 'شاهد الآن',
      readNow: 'اقرأ الآن',
      justNow: 'الآن',
      minutesAgo: 'دقائق مضت'
    },
    ur: {
      trendingVideos: 'مقبول ویڈیوز',
      breakingNews: 'بریکنگ نیوز',
      recommended: 'آپ کے لیے تجویز کردہ',
      latestVideos: 'تازہ ترین ویڈیوز',
      liveNews: 'براہ راست خبریں',
      views: 'ویوز',
      watchNow: 'ابھی دیکھیں',
      readNow: 'ابھی پڑھیں',
      justNow: 'ابھی',
      minutesAgo: 'منٹ پہلے'
    }
  };

  const t = translations[language as 'en' | 'ar' | 'ur'];

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
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

  // Get the best quality video thumbnail
  const getVideoThumbnail = (video: any): string => {
    // If video has thumbnail, use it
    if (video.thumbnail) return video.thumbnail;
    
    // If video has imageUrl, use it
    if (video.imageUrl) return video.imageUrl;
    
    // If it's a YouTube video, get YouTube thumbnail
    const youtubeId = getYouTubeId(video.videoUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    
    // Fallback to generic video thumbnail
    return `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&h=90&fit=crop&auto=format`;
  };

  // Format time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t.justNow;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return language === 'ar' 
        ? `قبل ${diffInMinutes} دقيقة` 
        : language === 'ur' 
        ? `${diffInMinutes} منٹ پہلے` 
        : `${diffInMinutes} ${t.minutesAgo}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return language === 'ar' 
        ? `قبل ${diffInHours} ساعة` 
        : language === 'ur' 
        ? `${diffInHours} گھنٹے پہلے` 
        : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return language === 'ar' 
      ? `قبل ${diffInDays} يوم` 
      : language === 'ur' 
      ? `${diffInDays} دن پہلے` 
      : `${diffInDays} days ago`;
  };

  // ============ REORGANIZED SECTIONS ============

  // 1. Trending Videos (Breaking News section) - Videos marked as trending
  const trendingVideos = videos
    .filter(video => video.isTrending)
    .slice(0, 5);

  // 2. Latest Videos - Latest 4 uploaded videos
  const latestVideos = videos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // 3. Featured Videos (Recommended For You section) - Videos marked as featured
  const featuredVideos = videos
    .filter(video => video.isFeatured)
    .slice(0, 4);

  // 4. Breaking News Articles - Recent articles
  const breakingNewsArticles = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Simple Video Card Component
  const SimpleVideoCard = ({ 
    video, 
    showRank = false, 
    rank = 0,
    showFeatured = false
  }: { 
    video: any, 
    showRank?: boolean, 
    rank?: number,
    showFeatured?: boolean
  }) => {
    const title = getDisplayText(video.title);
    const thumbnail = getVideoThumbnail(video);

    return (
      <div 
        className="group cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 mb-2 last:mb-0"
        onClick={() => {
          if (video.videoUrl) {
            window.open(video.videoUrl, '_blank');
          }
        }}
      >
        <div className="flex gap-3 items-center">
          {/* Video Thumbnail */}
          <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden">
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=64&h=48&fit=crop`;
              }}
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white rounded-full p-1 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <Play className="h-3 w-3 text-gray-900 fill-current" />
              </div>
            </div>

            {/* Live Badge for Live Videos */}
            {video.isLive && (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="bg-red-600 text-white text-[8px] px-1 py-0.5 text-center flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full mr-1 animate-pulse" />
                  LIVE
                </div>
              </div>
            )}

            {/* Rank Badge for Trending Videos */}
            {showRank && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-bold text-white">
                  {rank}
                </span>
              </div>
            )}

            {/* Featured Badge */}
            {showFeatured && !showRank && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-bold text-white">
                  ★
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

  // Simple Article Card Component
  const SimpleArticleCard = ({ 
    article, 
    isBreaking = false
  }: { 
    article: any, 
    isBreaking?: boolean
  }) => {
    const title = getDisplayText(article.title);
    const timeAgo = getTimeAgo(article.createdAt);

    return (
      <div 
        className="group cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 mb-2 last:mb-0"
        onClick={() => onReadMore(article)}
      >
        <div className="flex gap-3 items-center">
          {/* Article Thumbnail/Icon */}
          <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
            )}
            
            {/* Breaking News Badge */}
            {isBreaking && (
              <div className="absolute -top-1 -left-1">
                <Badge className="bg-red-600 text-white text-[8px] px-1 py-0 border-0">
                  🔥
                </Badge>
              </div>
            )}
          </div>

          {/* Title Only - Right Side */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
              {title}
            </h4>
            
            {/* Time ago for breaking news articles */}
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {timeAgo}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full space-y-6">
      {/* Advertisement */}
      {ads.length > 0 && (
        <Advertisement ads={ads} position="sidebar" />
      )}

      {/* ============ SECTION 1: TRENDING VIDEOS (Breaking News) ============ */}
      {trendingVideos.length > 0 && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.breakingNews}</h3>
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

      {/* ============ SECTION 2: LATEST VIDEOS ============ */}
      {latestVideos.length > 0 && (
        <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <Zap className="h-2.5 w-2.5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.latestVideos}</h3>
            </div>
            <div className="space-y-1">
              {latestVideos.map((video) => (
                <SimpleVideoCard 
                  key={video._id}
                  video={video}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ SECTION 3: FEATURED VIDEOS (Recommended For You) ============ */}
      {featuredVideos.length > 0 && (
        <Card className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-yellow-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.recommended}</h3>
            </div>
            <div className="space-y-1">
              {featuredVideos.map((video) => (
                <SimpleVideoCard 
                  key={video._id}
                  video={video}
                  showFeatured={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============ SECTION 4: BREAKING NEWS ARTICLES ============ */}
      {breakingNewsArticles.length > 0 && (
        <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.trendingVideos}</h3>
            </div>
            <div className="space-y-1">
              {breakingNewsArticles.map((article) => (
                <SimpleArticleCard 
                  key={article._id}
                  article={article}
                  isBreaking={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleSidebar;