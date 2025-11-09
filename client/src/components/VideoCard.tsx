import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface VideoCardProps {
  title: string;
  platform: 'YouTube' | 'Facebook' | 'TikTok' | 'Instagram';
  videoUrl: string;
  description?: string;
}

export default function VideoCard({ title, platform, videoUrl, description }: VideoCardProps) {
  const getEmbedUrl = () => {
    if (platform === 'YouTube') {
      const videoId = videoUrl.includes('v=')
        ? videoUrl.split('v=')[1]?.split('&')[0]
        : videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl;
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-video-${platform.toLowerCase()}`}>
      <div className="relative">
        <Badge
          className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground"
          data-testid={`badge-platform-${platform.toLowerCase()}`}
        >
          <Play className="h-3 w-3 mr-1" />
          {platform}
        </Badge>
        <div className="aspect-video bg-muted">
          {platform === 'YouTube' ? (
            <iframe
              src={getEmbedUrl()}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2" data-testid="text-video-title">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid="text-video-description">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
