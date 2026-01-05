import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Radio } from 'lucide-react';

interface LiveNewsTickerProps {
  articles: any[];
}

const LiveNewsTicker: React.FC<LiveNewsTickerProps> = ({ articles }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      liveNews: 'Live News'
    },
    ar: {
      liveNews: 'أخبار مباشرة'
    },
    ur: {
      liveNews: 'براہ راست خبریں'
    }
  };

  const t = translations[language as 'en' | 'ar' | 'ur'];

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white rounded-lg overflow-hidden mb-6">
      <div className="flex items-center">
        <div className="flex items-center gap-2 bg-red-700 px-4 py-3">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="font-semibold text-sm">{t.liveNews}</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {articles.map((article, index) => (
              <span key={article._id} className="inline-block mx-4 text-sm">
                {getDisplayText(article.title)}
                {index < articles.length - 1 && <span className="mx-4">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNewsTicker;