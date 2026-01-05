import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import VideoModal from '@/components/videos/VideoPlayer/VideoModal';

interface VideoShortsCarouselProps {
  videos: any[];
  title: string;
}

const VideoShortsCarousel: React.FC<VideoShortsCarouselProps> = ({ videos, title }) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  // Get best quality thumbnail
  const getBestThumbnail = (video: any): string => {
    if (video.thumbnail) return video.thumbnail;
    if (video.imageUrl) return video.imageUrl;
    
    const youtubeId = getYouTubeId(video.videoUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    
    return `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=355&fit=crop&auto=format`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240; // Smaller scroll amount for smaller cards
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, []);

  if (videos.length === 0) return null;

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-red-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <Badge className="bg-red-600 text-white border-0 text-xs">
          SHORTS
        </Badge>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Navigation Buttons - MIDDLE POSITION */}
        {showLeftButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full h-8 w-8 transition-opacity duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {showRightButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full h-8 w-8 transition-opacity duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Carousel - SMALLER SIZE */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => {
            const videoTitle = getDisplayText(video.title);
            const thumbnail = getBestThumbnail(video);

            return (
              <div
                key={video._id}
                className="flex-shrink-0 w-48 cursor-pointer group" // Smaller width
                onClick={() => handleVideoClick(video)}
              >
                {/* Small Short Video Card */}
                <div className="relative rounded-lg overflow-hidden bg-gray-900 hover:shadow-md transition-all duration-300">
                  {/* Thumbnail Container - SMALLER */}
                  <div className="relative aspect-[9/16]">
                    <img 
                      src={thumbnail} 
                      alt={videoTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=192&h=341&fit=crop`;
                      }}
                    />
                    
                    {/* Simple Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="h-4 w-4 text-gray-900 fill-current" />
                      </div>
                    </div>
                    
                    {/* SHORTS Badge - SMALLER */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        SHORTS
                      </div>
                    </div>
                  </div>
                  
                  {/* TITLE ONLY - Small and simple */}
                  <div className="p-2 bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                      {videoTitle}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal for In-site Playback */}
      <VideoModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
        language={language}
      />
    </div>
  );
};

export default VideoShortsCarousel;