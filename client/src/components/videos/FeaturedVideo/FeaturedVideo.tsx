import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Clock, Radio, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeaturedVideoProps {
  video: any;
  onVideoClick: (video: any) => void;
}

const translations = {
  en: {
    breakingNews: 'Breaking News',
    mainStory: 'Main Story',
    watchNow: 'Watch Now',
    liveNow: 'Live Now',
    viewers: 'viewers',
    liveCoverage: 'Live Coverage',
    latestVideo: 'Latest Video',
    justUploaded: 'Just Uploaded',
    new: 'NEW'
  },
  ar: {
    breakingNews: 'أخبار عاجلة',
    mainStory: 'القصة الرئيسية',
    watchNow: 'شاهد الآن',
    liveNow: 'بث مباشر الآن',
    viewers: 'مشاهدين',
    liveCoverage: 'بث مباشر',
    latestVideo: 'أحدث فيديو',
    justUploaded: 'تم الرفع الآن',
    new: 'جديد'
  },
  ur: {
    breakingNews: 'بریکنگ نیوز',
    mainStory: 'مرکزی کہانی',
    watchNow: 'ابھی دیکھیں',
    liveNow: 'ابھی لائیو',
    viewers: 'ناظرین',
    liveCoverage: 'براہ راست نشریات',
    latestVideo: 'تازہ ترین ویڈیو',
    justUploaded: 'ابھی اپ لوڈ ہوا',
    new: 'نیا'
  }
};

// Helper function to get display text
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  return textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
};

// Helper function to get YouTube ID
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

// Helper function to get time ago
const getTimeAgo = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return language === 'ar' ? 'الآن' : language === 'ur' ? 'ابھی' : 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return language === 'ar' 
      ? `قبل ${diffInMinutes} دقيقة` 
      : language === 'ur' 
      ? `${diffInMinutes} منٹ پہلے` 
      : `${diffInMinutes} min ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return language === 'ar' 
      ? `قبل ${diffInHours} ساعة` 
      : language === 'ur' 
      ? `${diffInHours} گھنٹے پہلے` 
      : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return language === 'ar' 
      ? `قبل ${diffInDays} يوم` 
      : language === 'ur' 
      ? `${diffInDays} دن پہلے` 
      : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return new Date(dateString).toLocaleDateString();
};

export default function FeaturedVideo({ video, onVideoClick }: FeaturedVideoProps) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  if (!video) return null;

  const title = getDisplayText(video.title, language);
  const description = getDisplayText(video.description, language);
  const isLive = video.isLive || video.liveStream;
  const videoId = getYouTubeId(video.videoUrl);
  const isYouTube = !!videoId;
  const timeAgo = getTimeAgo(video.createdAt, language);

  // Check if video is very recent (less than 1 hour)
  const isVeryRecent = (new Date().getTime() - new Date(video.createdAt).getTime()) < 3600000; // 1 hour

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        {isVeryRecent && (
          <Badge className="bg-green-600 text-white animate-pulse">
            {t.new}
          </Badge>
        )}
        <Badge className={`${isLive ? 'bg-red-600 animate-pulse' : 'bg-blue-600'} text-white`}>
          {isLive ? t.liveCoverage : t.latestVideo}
        </Badge>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.mainStory}</h2>
      </div>
      <Card className="overflow-hidden shadow-2xl border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Player Section */}
          <div className="relative aspect-video md:aspect-auto bg-black rounded-lg overflow-hidden group">
            {isYouTube ? (
              // YouTube Embed
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                title={title}
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // HTML5 Video Player for non-YouTube videos
              <div className="relative w-full h-full">
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  poster={video.imageUrl || video.thumbnail}
                  controls
                >
                  Your browser does not support the video tag.
                </video>
                {/* Play overlay for non-YouTube videos */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                  <div className="bg-red-600 rounded-full p-4 shadow-2xl">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm font-semibold">
                {video.category || 'News'}
              </Badge>
              {isLive && (
                <Badge className="bg-red-600 text-white flex items-center border-0 font-semibold">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                  {t.liveNow}
                </Badge>
              )}
              {isVeryRecent && !isLive && (
                <Badge className="bg-green-600 text-white border-0 font-semibold">
                  <Calendar className="h-3 w-3 mr-1" />
                  {t.justUploaded}
                </Badge>
              )}
            </div>
            
            {/* View Count and Time */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end space-y-2">
              <div className="bg-black/70 text-white px-3 py-2 rounded-lg flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">{video.views || 0}</span>
              </div>
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                {timeAgo}
              </div>
            </div>

            {/* Platform Badge */}
            <div className="absolute bottom-4 left-4 z-10">
              <Badge className="bg-gray-800/80 text-white backdrop-blur-sm border-0">
                {isYouTube ? 'YouTube' : 'Video'}
              </Badge>
            </div>
          </div>
          
          {/* Video Info Section */}
          <div className="p-6 flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {title}
              </h3>
              
              {/* Upload time highlight */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-medium">
                  {language === 'ar' 
                    ? `تم الرفع ${timeAgo}`
                    : language === 'ur'
                    ? `${timeAgo} اپ لوڈ ہوا`
                    : `Uploaded ${timeAgo}`
                  }
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {description || (isLive ? t.liveCoverage : 'Watch the latest news coverage from Global Pulse...')}
            </p>
            
            <div className="space-y-4">
              {/* Stats Row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{video.views || 0} {t.viewers}</span>
                  </div>
                  {isLive && (
                    <div className="flex items-center text-red-600 font-semibold">
                      <Radio className="h-4 w-4 mr-1 animate-pulse" />
                      {t.liveNow}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  className={`flex-1 ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3`}
                  onClick={() => onVideoClick(video)}
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  {isLive ? t.liveNow : t.watchNow}
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => onVideoClick(video)}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Additional Video Stats */}
              <div className="grid grid-cols-3 gap-4 text-center pt-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {video.likes || '1.2K'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {video.shares || '456'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Shares</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {video.comments || '89'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}