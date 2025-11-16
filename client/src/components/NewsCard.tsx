import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Eye, Clock, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  timeAgo: string;
  onReadMore: () => void;
  views?: number;
  readTime?: string;
  compact?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
}

const translations = {
  en: {
    readMore: 'Read More',
    views: 'views'
  },
  ar: {
    readMore: 'اقرأ المزيد',
    views: 'مشاهدة'
  },
  ur: {
    readMore: 'مزید پڑھیں',
    views: 'ویوز'
  }
};

export default function NewsCard({
  title,
  description,
  category,
  imageUrl,
  timeAgo,
  onReadMore,
  views = 0,
  readTime = "5 min read",
  compact = false,
  isTrending = false,
  isFeatured = false
}: NewsCardProps) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: { en: string; ar: string; ur: string } } = {
      technology: { en: 'Technology', ar: 'تكنولوجيا', ur: 'ٹیکنالوجی' },
      business: { en: 'Business', ar: 'أعمال', ur: 'کاروبار' },
      sports: { en: 'Sports', ar: 'رياضة', ur: 'کھیل' },
      politics: { en: 'Politics', ar: 'سياسة', ur: 'سیاست' },
      environment: { en: 'Environment', ar: 'بيئة', ur: 'ماحول' },
      health: { en: 'Health', ar: 'صحة', ur: 'صحت' }
    };
    
    return categoryMap[cat]?.[language as 'en' | 'ar' | 'ur'] || categoryMap[cat]?.en || cat;
  };

  const getSafeImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.trim() === '') return null;
    if (!url.startsWith('http')) return null;
    return url;
  };

  const safeImageUrl = getSafeImageUrl(imageUrl);
  const showImage = safeImageUrl && !imageError;

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReadMore();
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full min-h-[350px]">
      
      {/* Image Container with Fixed Aspect Ratio */}
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden relative flex-shrink-0">
        {!imageLoaded && showImage && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        {showImage ? (
          <img 
            src={safeImageUrl} 
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
        )}

        {/* Trending/Featured Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isTrending && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
              🔥 Trending
            </Badge>
          )}
          {isFeatured && (
            <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
              ⭐ Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {formatCategory(category)}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 dark:text-white leading-tight min-h-[2.5rem]">
          {title}
        </h3>
        
        {/* Description */}
        <div className="flex-1 mb-4 min-h-[60px]">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metadata and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Metadata */}
          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">{timeAgo}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">{views} {t.views}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">{readTime}</span>
            </div>
          </div>

          {/* Read More Button */}
          <Button 
            onClick={handleReadMore}
            variant="outline"
            size="sm"
            className="text-xs h-8 px-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap mt-2 sm:mt-0 w-full sm:w-auto"
          >
            {t.readMore}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}