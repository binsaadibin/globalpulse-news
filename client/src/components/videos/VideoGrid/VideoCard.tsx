import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Calendar, Youtube, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface VideoCardProps {
  title: any;
  platform: string;
  videoUrl: string;
  views?: number;
  createdAt: string;
  language: string;
  videoId?: string;
  thumbnailUrl?: string;
  className?: string;
  onVideoClick?: (video: any) => void;
  video?: any;
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

// Helper function to get display text
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  
  const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
  
  return text;
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
  className = '',
  onVideoClick,
  video
}: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine actual platform and video ID
  const actualPlatform = platform || 'youtube';
  const videoIdFromUrl = getYouTubeId(videoUrl);

  // Get the actual title text for current language
  const displayTitle = getDisplayText(title, language);

  // Get YouTube thumbnail with fallback
  const getThumbnailUrl = () => {
    if (thumbnailUrl && !imageError) return thumbnailUrl;
    if (videoIdFromUrl) {
      return `https://img.youtube.com/vi/${videoIdFromUrl}/maxresdefault.jpg`;
    }
    return `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop`;
  };

  const handleCardClick = async () => {
    if (onVideoClick && video) {
      onVideoClick(video);
    }
  };

  const PlatformIcon = Youtube; // Default to YouTube icon
  const formattedViews = formatViews(views, language);
  const timeAgo = getTimeAgo(createdAt, language);
  const isListView = className.includes('flex-row');
  const thumbnailSource = getThumbnailUrl();

  return (
    <Card 
      className={`w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer bg-white dark:bg-gray-900 ${className}`}
      onClick={handleCardClick}
    >
      {/* Video Thumbnail */}
      <div 
        className={`relative bg-gray-900 overflow-hidden group ${isListView ? 'w-48 flex-shrink-0' : 'aspect-video'}`}
      >
        <img 
          src={thumbnailSource} 
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
        
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
        
        {/* Platform badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-600 text-white text-xs font-semibold">
            <PlatformIcon className="h-3 w-3 mr-1" />
            YouTube
          </Badge>
        </div>

        {/* View count on thumbnail */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {formattedViews}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <CardContent className={`p-3 flex-1 ${isListView ? 'flex flex-col justify-between' : ''}`}>
        <div className="flex items-start space-x-3">
          {/* Channel avatar */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GP</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {displayTitle}
            </h3>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Global Pulse News</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{formattedViews} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          
          {/* More options button */}
          <button 
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}