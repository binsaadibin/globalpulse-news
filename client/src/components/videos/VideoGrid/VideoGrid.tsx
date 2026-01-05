import VideoCard from './VideoCard';

interface VideoGridProps {
  videos: any[];
  viewMode: 'grid' | 'list';
  onVideoClick: (video: any) => void;
  language: string;
}

export default function VideoGrid({ videos, viewMode, onVideoClick, language }: VideoGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            title={video.title} // Pass the title object directly
            platform={video.platform || 'youtube'}
            videoUrl={video.videoUrl}
            views={video.views || 0}
            createdAt={video.createdAt}
            language={language}
            videoId={video._id}
            thumbnailUrl={video.imageUrl || video.thumbnail}
            className="flex-row h-32"
            onVideoClick={onVideoClick}
            video={video}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          title={video.title} // Pass the title object directly
          platform={video.platform || 'youtube'}
          videoUrl={video.videoUrl}
          views={video.views || 0}
          createdAt={video.createdAt}
          language={language}
          videoId={video._id}
          thumbnailUrl={video.imageUrl || video.thumbnail}
          onVideoClick={onVideoClick}
          video={video}
        />
      ))}
    </div>
  );
}