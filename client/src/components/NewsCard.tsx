import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Eye, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
}

const translations = {
  en: {
    readMore: 'Read More',
    views: 'views',
    featuredArticle: 'Featured Article'
  },
  ar: {
    readMore: 'اقرأ المزيد',
    views: 'مشاهدة',
    featuredArticle: 'مقال مميز'
  },
  ur: {
    readMore: 'مزید پڑھیں',
    views: 'ویوز',
    featuredArticle: 'نمایاں مضمون'
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
  compact = false
}: NewsCardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: { en: string; ar: string; ur: string } } = {
      technology: { en: 'Technology', ar: 'تكنولوجيا', ur: 'ٹیکنالوجی' },
      business: { en: 'Business', ar: 'أعمال', ur: 'کاروبار' },
      sports: { en: 'Sports', ar: 'رياضة', ur: 'کھیل' },
      politics: { en: 'Politics', ar: 'سياسة', ur: 'سیاست' },
      environment: { en: 'Environment', ar: 'بيئة', ur: 'ماحول' },
      health: { en: 'Health', ar: 'صحة', ur: 'صحت' }
    };
    
    return categoryMap[cat]?.[language] || categoryMap[cat]?.en || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      technology: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      business: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      sports: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      politics: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      environment: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      health: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[cat] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  if (compact) {
    return (
      <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer bg-white dark:bg-gray-800 h-full flex flex-col">
        {/* Article Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getCategoryColor(category)} backdrop-blur-sm font-medium text-xs px-2 py-1 border-0`}>
              {formatCategory(category)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-3 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3 text-xs flex-1">
            {description}
          </p>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between items-center flex-shrink-0">
          {/* Date and Views */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap text-xs">{timeAgo}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap text-xs">{views} {t.views}</span>
            </div>
          </div>

          {/* Compact Read More Button */}
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onReadMore();
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-all duration-300 border-0 flex items-center whitespace-nowrap"
            size="sm"
          >
            {t.readMore}
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-300 flex-shrink-0" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer bg-white dark:bg-gray-800 h-full flex flex-col">
      {/* Article Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(category)} backdrop-blur-sm font-medium text-xs px-3 py-1.5 border-0`}>
            {formatCategory(category)}
          </Badge>
        </div>
        
        {/* Read Time */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gray-900/80 backdrop-blur-sm text-white font-medium text-xs px-2 py-1 border-0">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3 text-sm flex-1">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center flex-shrink-0">
        {/* Date and Views */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
            <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{timeAgo}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
            <Eye className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{views} {t.views}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onReadMore();
          }}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 border-0 flex items-center whitespace-nowrap"
          size="sm"
        >
          {t.readMore}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
        </Button>
      </CardFooter>
    </Card>
  );
}