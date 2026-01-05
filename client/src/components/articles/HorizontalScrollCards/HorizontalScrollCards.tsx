import React, { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Eye, Clock, Flame, Crown, Zap } from 'lucide-react';

interface HorizontalScrollCardsProps {
  articles: any[];
  title: string;
  onReadMore: (article: any) => void;
  variant?: 'default' | 'trending' | 'featured';
}

const HorizontalScrollCards: React.FC<HorizontalScrollCardsProps> = ({
  articles,
  title,
  onReadMore,
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  if (articles.length === 0) return null;

  const variantConfig = {
    trending: {
      icon: Flame,
      gradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
      border: 'border-orange-200 dark:border-orange-800',
      titleColor: 'text-orange-900 dark:text-orange-100',
      badgeColor: 'bg-orange-500 text-white',
      badgeText: 'HOT'
    },
    featured: {
      icon: Crown,
      gradient: 'from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      titleColor: 'text-purple-900 dark:text-purple-100',
      badgeColor: 'bg-purple-500 text-white',
      badgeText: 'EXCLUSIVE'
    },
    default: {
      icon: Zap,
      gradient: '',
      border: '',
      titleColor: 'text-gray-900 dark:text-white',
      badgeColor: '',
      badgeText: ''
    }
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.gradient} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconComponent className={`h-6 w-6 ${config.titleColor}`} />
          <h2 className={`text-xl font-bold ${config.titleColor}`}>
            {title}
          </h2>
          {config.badgeText && (
            <Badge className={`${config.badgeColor} animate-pulse`}>
              {config.badgeText}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article) => (
            <Card
              key={article._id}
              className="flex-shrink-0 w-80 cursor-pointer group hover:shadow-lg transition-all duration-300"
              onClick={() => onReadMore(article)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'} 
                  alt={getDisplayText(article.title)}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`${
                      variant === 'trending' ? 'bg-orange-500 text-white' : 
                      variant === 'featured' ? 'bg-purple-500 text-white' : 
                      'bg-blue-500 text-white'
                    }`}>
                      {article.category}
                    </Badge>
                    
                    {article.isTrending && variant !== 'trending' && (
                      <Badge className="bg-orange-500 text-white">
                        TRENDING
                      </Badge>
                    )}
                    
                    {article.isFeatured && variant !== 'featured' && (
                      <Badge className="bg-purple-500 text-white">
                        FEATURED
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {getDisplayText(article.title)}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{article.views || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCards;