import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Youtube, Eye, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LiveStreamsProps {
  streams: any[];
  onStreamClick: (stream: any) => void;
}

const translations = {
  en: {
    liveStreams: 'Live Streams',
    liveNow: 'Live Now',
    watching: 'watching',
    liveCoverage: 'Live Coverage'
  },
  ar: {
    liveStreams: 'البثوث المباشرة',
    liveNow: 'بث مباشر الآن',
    watching: 'مشاهدين',
    liveCoverage: 'بث مباشر'
  },
  ur: {
    liveStreams: 'لائیو اسٹریمز',
    liveNow: 'ابھی لائیو',
    watching: 'دیکھ رہے ہیں',
    liveCoverage: 'براہ راست نشریات'
  }
};

// Helper function to get display text
const getDisplayText = (textObject: any, language: string): string => {
  if (!textObject) return '';
  if (typeof textObject === 'string') return textObject;
  
  const text = textObject[language as 'en' | 'ar' | 'ur'] || textObject.en || textObject.ar || textObject.ur || '';
  
  return text;
};

export default function LiveStreams({ streams, onStreamClick }: LiveStreamsProps) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  if (streams.length === 0) return null;

  return (
    <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-full">
            <Youtube className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.liveStreams}</h2>
          <Badge className="bg-red-600 text-white border-0 animate-pulse">
            LIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => {
          const title = getDisplayText(stream.title, language);
          const imageUrl = stream.imageUrl || stream.thumbnail;

          return (
            <Card 
              key={stream._id} 
              className="cursor-pointer group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800"
              onClick={() => onStreamClick(stream)}
            >
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop`;
                  }}
                />
                
                {/* Live Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-600 text-white text-xs border-0 flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                    {t.liveNow}
                  </Badge>
                </div>
                
                {/* View Count */}
                <div className="absolute top-3 right-3">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {Math.floor(Math.random() * 10000).toLocaleString()} {t.watching}
                  </div>
                </div>
                
                {/* YouTube Logo */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-red-600 text-white p-1 rounded text-xs font-bold flex items-center">
                    <Youtube className="h-3 w-3 mr-1" />
                    YouTube
                  </div>
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <div className="bg-red-600 rounded-full p-4 shadow-2xl">
                    <Radio className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Global Pulse</span>
                  <span>{t.liveCoverage}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}