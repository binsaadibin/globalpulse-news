import { X, Share2, Download, ThumbsUp, ThumbsDown, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoModalProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

// Helper function to get display text
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  
  const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
  
  return text;
};

export default function VideoModal({ video, isOpen, onClose, language }: VideoModalProps) {
  if (!isOpen || !video) return null;

  const shareUrl = `${window.location.origin}/video/${video._id}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getDisplayText(video.title, language),
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      // Add toast notification here
      alert('Link copied to clipboard!');
    }
  };

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

  const videoId = getYouTubeId(video.videoUrl);
  const isYouTube = !!videoId;

  const displayTitle = getDisplayText(video.title, language);
  const displayDescription = getDisplayText(video.description, language);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-gray-900 rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-white text-xl font-semibold truncate flex-1 mr-4">
            {displayTitle}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-gray-800 p-2 h-10 w-10 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          {isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={displayTitle}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-white p-8">
                <div className="text-2xl mb-4">🎬</div>
                <h3 className="text-xl font-bold mb-2">External Video</h3>
                <p className="text-gray-300 mb-4">This video will open in a new window</p>
                <Button
                  onClick={() => window.open(video.videoUrl, '_blank')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Watch on {video.platform || 'External Site'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Video Info and Actions */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {displayTitle}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {video.views || 0} views
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
                {video.category && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {video.category}
                  </Badge>
                )}
              </div>
              {video.description && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
            <Button
              onClick={handleShare}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Dislike
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}