import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface FeaturedArticleProps {
  article: any;
  onReadMore: (article: any) => void;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article, onReadMore }) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      onReadMore(article);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReadMore(article);
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer overflow-hidden rounded-xl group transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-blue-500/30"
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* Article Image - Left Side (50%) */}
        <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/30 to-transparent z-10"></div>
          
          <img 
            src={article.imageUrl} 
            alt={getDisplayText(article.title)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        {/* Article Content - Right Side (50%) */}
        <div className="lg:w-1/2 p-6 md:p-8 flex flex-col h-full">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white line-clamp-2 leading-tight">
            {getDisplayText(article.title)}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base mb-6 flex-grow line-clamp-3 md:line-clamp-4 leading-relaxed">
            {getDisplayText(article.description)}
          </p>

          {/* Bottom Right Section with Date and Button */}
          <div className="flex items-center justify-end gap-4 mt-auto pt-6 border-t border-gray-700">
            {/* Date */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
              <svg 
                className="w-4 h-4 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <span className="text-gray-200 text-sm font-medium">
                {formatDate(article.createdAt)}
              </span>
            </div>

            {/* Button */}
            <Button 
              onClick={handleButtonClick}
              className="relative overflow-hidden px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Read Full Story
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}
        style={{
          background: 'radial-gradient(circle at 75% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
      ></div>
    </div>
  );
};

export default FeaturedArticle;