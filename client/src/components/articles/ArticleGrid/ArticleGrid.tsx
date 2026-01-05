import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Clock, User, Star, TrendingUp } from 'lucide-react';

interface ArticleGridProps {
  articles: any[];
  onReadMore: (article: any) => void;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onReadMore }) => {
  const { language } = useLanguage();

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <Card 
          key={article._id} 
          className="group cursor-pointer hover:shadow-lg transition-all duration-300 animate-in fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onReadMore(article)}
        >
          <CardContent className="p-0">
            {/* Article Image */}
            <div className="relative overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={getDisplayText(article.title)}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm">
                    {article.category}
                  </Badge>
                  {article.isFeatured && (
                    <Badge variant="secondary" className="bg-yellow-500/90 text-white backdrop-blur-sm">
                      <Star className="h-3 w-3" />
                    </Badge>
                  )}
                  {article.isTrending && (
                    <Badge variant="secondary" className="bg-orange-500/90 text-white backdrop-blur-sm">
                      <TrendingUp className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime || '5'} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views || 0}</span>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {getDisplayText(article.title)}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {getDisplayText(article.description)}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {article.createdByUsername && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.createdByUsername}</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Read More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleGrid;