import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Calendar } from 'lucide-react';

interface HeaderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const translations = {
  en: {
    topNews: 'Global Pulse News',
    search: 'Search articles...',
    startDate: 'Start Date',
    endDate: 'End Date',
    refresh: 'Refresh',
    loading: 'Loading...',
    searchPlaceholder: 'Search by title or description...'
  },
  ar: {
    topNews: 'جلوبال بولس نيوز',
    search: 'ابحث عن المقالات...',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    refresh: 'تحديث',
    loading: 'جاري التحميل...',
    searchPlaceholder: 'ابحث حسب العنوان أو الوصف...'
  },
  ur: {
    topNews: 'گلوبل پلس نیوز',
    search: 'مضامین تلاش کریں...',
    startDate: 'شروع کی تاریخ',
    endDate: 'ختم ہونے کی تاریخ',
    refresh: 'ریفریش',
    loading: 'لوڈ ہو رہا ہے...',
    searchPlaceholder: 'عنوان یا تفصیل کے لحاظ سے تلاش کریں...'
  }
};

const HeaderSearch: React.FC<HeaderSearchProps> = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onRefresh,
  refreshing
}) => {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t.topNews}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {language === 'ar' 
              ? 'ابق على اطلاع بأحدث الأخبار والقصص من جميع أنحاء العالم'
              : language === 'ur'
              ? 'دنیا بھر کی تازہ ترین خبروں اور کہانیوں سے باخبر رہیں'
              : 'Stay informed with the latest news and stories from around the world'
            }
          </p>
        </div>
        
        <Button
          onClick={onRefresh}
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t.loading : t.refresh}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-2xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder={t.startDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 w-full lg:w-40"
            />
          </div>
          
          <div className="text-gray-500 dark:text-gray-400">-</div>
          
          <div className="relative flex-1 lg:flex-none">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder={t.endDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 w-full lg:w-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;