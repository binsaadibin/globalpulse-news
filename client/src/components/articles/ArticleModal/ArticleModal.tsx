import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Calendar, Clock, User } from 'lucide-react';

interface ArticleModalProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen || !article) return null;

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const getDisplayContent = (contentObject: any): string => {
    if (!contentObject) return '';
    if (typeof contentObject === 'string') return contentObject;
    return contentObject[language] || contentObject.en || contentObject.ar || contentObject.ur || '';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {article.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Article Image */}
          {article.imageUrl && (
            <div className="w-full h-64 sm:h-80 lg:h-96 relative">
              <img 
                src={article.imageUrl} 
                alt={getDisplayText(article.title)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="p-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {getDisplayText(article.title)}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime || '5'} min read</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.views || 0} views</span>
              </div>
              
              {article.createdByUsername && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {article.createdByUsername}</span>
                </div>
              )}
            </div>

            {/* Featured & Trending Badges */}
            <div className="flex gap-2 mb-4">
              {article.isFeatured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Featured
                </Badge>
              )}
              {article.isTrending && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                  Trending
                </Badge>
              )}
            </div>
          </div>

          {/* Article Description */}
          <div className="px-6 mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {getDisplayText(article.description)}
            </p>
          </div>

          {/* Article Content */}
          {article.content && (
            <div className="px-6 mb-6">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: getDisplayContent(article.content) 
                }}
              />
            </div>
          )}

          {/* Full Description as Fallback */}
          {!article.content && article.description && (
            <div className="px-6 mb-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {getDisplayText(article.description)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <span>❤️ {article.likes || 0} likes</span>
              </div>
            </div>
            
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;