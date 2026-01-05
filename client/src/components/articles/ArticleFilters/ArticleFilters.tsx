import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';

interface ArticleFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  viewMode?: 'grid' | 'list';
  setViewMode?: (mode: 'grid' | 'list') => void;
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  selectedTab,
  setSelectedTab,
  viewMode = 'grid',
  setViewMode
}) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      search: 'Search articles...',
      filter: 'Filter by category',
      all: 'All',
      featured: 'Featured',
      trending: 'Trending',
      popular: 'Popular',
      technology: 'Technology',
      business: 'Business',
      sports: 'Sports',
      politics: 'Politics',
      environment: 'Environment',
      health: 'Health',
      gridView: 'Grid View',
      listView: 'List View'
    },
    ar: {
      search: 'ابحث عن المقالات...',
      filter: 'تصفية حسب الفئة',
      all: 'الكل',
      featured: 'مميز',
      trending: 'الشائع',
      popular: 'الأكثر شهرة',
      technology: 'تكنولوجيا',
      business: 'أعمال',
      sports: 'رياضة',
      politics: 'سياسة',
      environment: 'بيئة',
      health: 'صحة',
      gridView: 'عرض شبكي',
      listView: 'عرض قائمة'
    },
    ur: {
      search: 'مضامین تلاش کریں...',
      filter: 'زمرے کے لحاظ سے فلٹر کریں',
      all: 'تمام',
      featured: 'نمایاں',
      trending: 'مقبول',
      popular: 'مشہور',
      technology: 'ٹیکنالوجی',
      business: 'کاروبار',
      sports: 'کھیل',
      politics: 'سیاست',
      environment: 'ماحول',
      health: 'صحت',
      gridView: 'گریڈ ویو',
      listView: 'فہرست ویو'
    }
  };

  const t = translations[language as 'en' | 'ar' | 'ur'];

  const categories = [
    { value: 'all', label: t.all, emoji: '🌐' },
    { value: 'technology', label: t.technology, emoji: '🚀' },
    { value: 'business', label: t.business, emoji: '💼' },
    { value: 'sports', label: t.sports, emoji: '⚽' },
    { value: 'politics', label: t.politics, emoji: '🏛️' },
    { value: 'environment', label: t.environment, emoji: '🌱' },
    { value: 'health', label: t.health, emoji: '❤️' }
  ];

  const tabs = [
    { value: 'all', label: t.all },
    { value: 'featured', label: t.featured },
    { value: 'trending', label: t.trending },
    { value: 'popular', label: t.popular }
  ];

  return (
    <div className="space-y-4">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="w-full sm:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t.filter} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {setViewMode && (
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              title={t.gridView}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              title={t.listView}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ArticleFilters;