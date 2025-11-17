import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Calendar, Youtube, Facebook, Instagram, Music, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VideoCardProps {
  title: string;
  platform: string;
  videoUrl: string;
  views?: number;
  createdAt: string;
  language: string;
  videoId?: string;
  thumbnailUrl?: string;
  className?: string;
}

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

// Enhanced YouTube ID extraction
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
};

// Get platform from URL
const getPlatformFromUrl = (url: string): string => {
  if (!url) return 'video';
  
  const urlLower = url.toLowerCase();
  if (urlLower.includes('youtube') || urlLower.includes('youtu.be')) return 'youtube';
  if (urlLower.includes('facebook')) return 'facebook';
  if (urlLower.includes('tiktok')) return 'tiktok';
  if (urlLower.includes('instagram')) return 'instagram';
  
  return 'video';
};

// Format time ago
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
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return language === 'ar' 
      ? `قبل ${diffInWeeks} أسبوع` 
      : language === 'ur' 
      ? `${diffInWeeks} ہفتے پہلے` 
      : `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  return new Date(dateString).toLocaleDateString();
};

export default function VideoCard({ 
  title, 
  platform, 
  videoUrl,
  views = 0,
  createdAt,
  language,
  videoId,
  thumbnailUrl,
  className = ''
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentViews, setCurrentViews] = useState(views);
  const [isTrackingView, setIsTrackingView] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine actual platform and video ID
  const actualPlatform = platform || getPlatformFromUrl(videoUrl);
  const videoIdFromUrl = getYouTubeId(videoUrl);

  // Track view when video starts playing
  const trackView = async () => {
    if (!videoId || isTrackingView) return;
    
    try {
      setIsTrackingView(true);
      const response = await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/videos/${videoId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentViews(result.views);
        console.log('✅ View tracked successfully:', result.views);
      }
    } catch (error) {
      console.error('❌ Error tracking view:', error);
    } finally {
      setIsTrackingView(false);
    }
  };

  // Update views periodically when video is playing
  useEffect(() => {
    const updateViews = async () => {
      if (!videoId) return;
      
      try {
        const response = await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/videos/${videoId}/views`);
        if (response.ok) {
          const result = await response.json();
          setCurrentViews(result.views);
        }
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    };

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      updateViews(); // Initial update
      interval = setInterval(updateViews, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoId, isPlaying]);

  const handlePlayClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    await trackView();
    setIsPlaying(true);
    setIsLoading(false);
  };

  // Get YouTube thumbnail with fallback
  const getThumbnailUrl = (id: string | null) => {
    if (thumbnailUrl) return thumbnailUrl;
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  const finalThumbnailUrl = getThumbnailUrl(videoIdFromUrl);

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    const icons: { [key: string]: any } = {
      youtube: Youtube,
      facebook: Facebook,
      tiktok: Music,
      instagram: Instagram,
      video: Play
    };
    return icons[platformLower] || Play;
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    const colors: { [key: string]: string } = {
      youtube: 'bg-red-600 text-white',
      facebook: 'bg-blue-600 text-white',
      tiktok: 'bg-black text-white',
      instagram: 'bg-pink-600 text-white',
      video: 'bg-gray-600 text-white'
    };
    return colors[platformLower] || 'bg-gray-600 text-white';
  };

  const PlatformIcon = getPlatformIcon(actualPlatform);
  const formattedViews = formatViews(currentViews, language);
  const timeAgo = getTimeAgo(createdAt, language);
  const isListView = className.includes('flex-row');

  if (isPlaying && videoIdFromUrl) {
    return (
      <Card className={`w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}>
        {/* Embedded YouTube Player */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoIdFromUrl}?autoplay=1&rel=0`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Close button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 leading-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <Badge className={`${getPlatformColor(actualPlatform)} text-xs font-semibold`}>
              <PlatformIcon className="h-3 w-3 mr-1" />
              {actualPlatform}
            </Badge>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Eye className="h-3 w-3 mr-1" />
              {formattedViews}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For non-YouTube videos, open in new tab
  const handleNonYouTubeClick = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  if (isPlaying && !videoIdFromUrl) {
    return (
      <Card className={`w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="max-w-md mx-auto">
            <PlatformIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              {language === 'ar' ? 'فتح الفيديو' : language === 'ur' ? 'ویڈیو کھولیں' : 'Open Video'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {language === 'ar' 
                ? 'سيتم فتح هذا الفيديو في نافذة جديدة' 
                : language === 'ur' 
                ? 'یہ ویڈیو ایک نئی ونڈو میں کھل جائے گی'
                : 'This video will open in a new window'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setIsPlaying(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button 
                onClick={handleNonYouTubeClick}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'فتح الفيديو' : language === 'ur' ? 'ویڈیو کھولیں' : 'Open Video'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer bg-white dark:bg-gray-900 ${className}`}>
      {/* Video Thumbnail */}
      <div 
        className={`relative bg-gray-900 overflow-hidden group ${isListView ? 'w-48 flex-shrink-0' : 'aspect-video'}`}
        onClick={videoIdFromUrl ? handlePlayClick : () => setIsPlaying(true)}
      >
        {finalThumbnailUrl && !imageError ? (
          <>
            <img 
              src={finalThumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <Play className="h-8 w-8 text-white opacity-80" />
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Play className="h-5 w-5 text-white fill-current" />
          </div>
        </div>
        
        {/* Duration badge - Simulated for YouTube style */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
            10:30
          </div>
        </div>
        
        {/* View count on thumbnail */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {formattedViews}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <CardContent className={`p-3 flex-1 ${isListView ? 'flex flex-col justify-between' : ''}`}>
        <div className="flex items-start space-x-3">
          {/* Channel avatar - simulated */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GP</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {title}
            </h3>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Global Pulse</span>
              <Badge className={`${getPlatformColor(actualPlatform)} ml-2 text-xs px-1.5 py-0`}>
                <PlatformIcon className="h-2.5 w-2.5 mr-0.5" />
                {actualPlatform}
              </Badge>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{formattedViews} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          
          {/* More options button - YouTube style */}
          <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}