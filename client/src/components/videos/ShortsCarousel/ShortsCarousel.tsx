import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Video {
  _id: string;
  title: string | { en?: string; ar?: string; ur?: string };
  description?: string | { en?: string; ar?: string; ur?: string };
  imageUrl?: string;
  thumbnail?: string;
  videoUrl?: string;
  views?: number;
  likes?: number;
  isLive?: boolean;
  isShort?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  category?: string;
  createdAt?: string;
  duration?: number;
}

interface ShortsCarouselProps {
  shorts: Video[];
  onShortClick: (short: Video) => void;
}

// Helper function to get display text
const getDisplayText = (textObject: any, language: string = 'en'): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  
  const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
  
  return text;
};

// Get YouTube ID from URL
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

export default function ShortsCarousel({ shorts, onShortClick }: ShortsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const updateCurrentIndex = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const itemWidth = 288; // w-72 = 288px
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(Math.min(newIndex, shorts.length - 1));
    }
  };

  // Handle image error
  const handleImageError = (videoId: string, imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(`${videoId}-${imageUrl}`));
  };

  // Check if image should show fallback
  const shouldShowFallback = (videoId: string, imageUrl: string) => {
    return imageErrors.has(`${videoId}-${imageUrl}`);
  };

  // Get the actual image source - use YouTube thumbnail if available
  const getImageSource = (short: Video) => {
    const videoId = getYouTubeId(short.videoUrl || '');
    const backendImage = short.thumbnail || short.imageUrl;
    
    // If we have a YouTube video, use YouTube thumbnail
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    // If we have a backend image and it hasn't errored, use it
    if (backendImage && !shouldShowFallback(short._id, backendImage)) {
      return backendImage;
    }
    
    // Fallback image
    return `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=288&h=512&fit=crop&auto=format`;
  };

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        No shorts available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons - Only show if there are multiple items */}
      {shorts.length > 1 && (
        <>
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {currentIndex < shorts.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        onScroll={updateCurrentIndex}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shorts.map((short) => {
          const shortTitle = getDisplayText(short.title, 'en');
          const views = short.views || 0;
          const imageSource = getImageSource(short);
          const videoId = getYouTubeId(short.videoUrl || '');
          
          return (
            <div
              key={short._id}
              className="flex-shrink-0 w-72 cursor-pointer group"
              onClick={() => onShortClick(short)}
            >
              {/* Short Video Card */}
              <div className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden">
                <img 
                  src={imageSource} 
                  alt={shortTitle || 'Short Video'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => {
                    if (short.thumbnail || short.imageUrl) {
                      handleImageError(short._id, short.thumbnail || short.imageUrl || '');
                    }
                  }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
                
                {/* Shorts Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-600 text-white text-xs border-0 font-bold">
                    SHORTS
                  </Badge>
                </div>
                
                {/* View Count */}
                {views > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-black/70 text-white text-xs border-0">
                      <Eye className="h-3 w-3 mr-1" />
                      {views.toLocaleString()}
                    </Badge>
                  </div>
                )}

                {/* YouTube Badge */}
                {videoId && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-600 text-white text-xs border-0">
                      YouTube
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Video Info */}
              <div className="mt-2">
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                  {shortTitle || 'Short Video'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {views.toLocaleString()} views
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}