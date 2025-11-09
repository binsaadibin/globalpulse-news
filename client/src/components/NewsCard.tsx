import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  timeAgo: string;
  onClick?: () => void;
}

export default function NewsCard({
  title,
  description,
  category,
  imageUrl,
  timeAgo,
  onClick,
}: NewsCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group"
      onClick={onClick}
      data-testid={`card-news-${category.toLowerCase()}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          className="absolute top-3 left-3 bg-primary text-primary-foreground"
          data-testid={`badge-category-${category.toLowerCase()}`}
        >
          {category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2" data-testid="text-news-title">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3" data-testid="text-news-description">
          {description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span data-testid="text-time-ago">{timeAgo}</span>
        </div>
      </div>
    </Card>
  );
}
