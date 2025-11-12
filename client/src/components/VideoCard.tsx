import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Calendar, Youtube, Facebook, Instagram, Music } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VideoCardProps {
  title: string;
  description: string;
  platform: string;
  videoUrl: string;
  views?: number;
  createdAt: string;
  language: string;
  videoId?: string;
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

export default function VideoCard({ 
  title, 
  description, 
  platform, 
  videoUrl,
  views = 0,
  createdAt,
  language,
  videoId
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentViews, setCurrentViews] = useState(views);
  const [isTrackingView, setIsTrackingView] = useState(false);

  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  };

  const videoIdFromUrl = getYouTubeId(videoUrl);

  // Track view when video starts playing
  const trackView = async () => {
    if (!videoId || isTrackingView) return;
    
    try {
      setIsTrackingView(true);
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/view`, {
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
        const response = await fetch(`http://localhost:5000/api/videos/${videoId}/views`);
        if (response.ok) {
          const result = await response.json();
          setCurrentViews(result.views);
        }
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    };

    // Update views every 30 seconds when video is playing
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      updateViews(); // Initial update
      interval = setInterval(updateViews, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoId, isPlaying]);

  const handlePlayClick = () => {
    // Track view first, then play
    trackView();
    setIsPlaying(true);
  };

  // Get YouTube thumbnail
  const getThumbnailUrl = (id: string | null) => {
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  const thumbnailUrl = getThumbnailUrl(videoIdFromUrl);

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    const icons: { [key: string]: any } = {
      youtube: Youtube,
      facebook: Facebook,
      tiktok: Music,
      instagram: Instagram
    };
    return icons[platformLower] || Play;
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    const colors: { [key: string]: string } = {
      youtube: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      facebook: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      tiktok: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
      instagram: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800'
    };
    return colors[platformLower] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600';
  };

  const PlatformIcon = getPlatformIcon(platform);
  const formattedViews = formatViews(currentViews, language);

  if (isPlaying && videoIdFromUrl) {
    return (
      <Card className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900">
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
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 leading-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Badge className={`${getPlatformColor(platform)} text-xs font-semibold border`}>
              <PlatformIcon className="h-3 w-3 mr-1" />
              {platform}
            </Badge>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Eye className="h-3 w-3 mr-1" />
              {formattedViews} {language === 'ar' ? 'مشاهدة' : language === 'ur' ? 'ویوز' : 'views'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-lg group cursor-pointer bg-white dark:bg-gray-900">
      {/* Video Thumbnail with Play Button */}
      <div 
        className="relative aspect-video bg-gray-900 overflow-hidden group"
        onClick={handlePlayClick}
      >
        {thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Light overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-80" />
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-blue-500 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Play className="h-6 w-6 text-white fill-current" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${getPlatformColor(platform)} backdrop-blur-sm text-xs font-semibold border`}>
            <PlatformIcon className="h-3 w-3 mr-1" />
            {platform}
          </Badge>
        </div>
        
        {/* View count on thumbnail */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {formattedViews}
          </div>
        </div>
        
        {/* Play text appears on hover */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
            {language === 'ar' ? 'انقر للتشغيل' : language === 'ur' ? 'چلانے کے لیے کلک کریں' : 'Click to Play'}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Eye className="h-3 w-3 mr-1" />
          {formattedViews} {language === 'ar' ? 'مشاهدة' : language === 'ur' ? 'ویوز' : 'views'}
        </div>
      </CardFooter>
    </Card>
  );
}