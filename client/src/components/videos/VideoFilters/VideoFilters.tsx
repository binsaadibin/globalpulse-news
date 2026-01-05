import { Search, Grid, List, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface VideoFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  startDate?: Date;
  setStartDate?: (date: Date | undefined) => void;
  endDate?: Date;
  setEndDate?: (date: Date | undefined) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

const translations = {
  en: {
    search: 'Search videos...',
    filter: 'Filter by category',
    all: 'All',
    technology: 'Technology',
    business: 'Business',
    sports: 'Sports',
    politics: 'Politics',
    environment: 'Environment',
    health: 'Health',
    gridView: 'Grid',
    listView: 'List',
    dateFilter: 'Date Filter',
    startDate: 'Start Date',
    endDate: 'End Date',
    clearDates: 'Clear Dates',
    applyFilter: 'Apply Filter',
    sortBy: 'Sort By',
    newest: 'Newest First',
    oldest: 'Oldest First',
    mostViewed: 'Most Viewed',
    mostLiked: 'Most Liked',
    live: 'Live',
    shorts: 'Shorts',
    featured: 'Featured',
    trending: 'Trending'
  },
  ar: {
    search: 'ابحث عن الفيديوهات...',
    filter: 'تصفية حسب الفئة',
    all: 'الكل',
    technology: 'تكنولوجيا',
    business: 'أعمال',
    sports: 'رياضة',
    politics: 'سياسة',
    environment: 'بيئة',
    health: 'صحة',
    gridView: 'شبكة',
    listView: 'قائمة',
    dateFilter: 'تصفية التاريخ',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    clearDates: 'مسح التواريخ',
    applyFilter: 'تطبيق التصفية',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث أولاً',
    oldest: 'الأقدم أولاً',
    mostViewed: 'الأكثر مشاهدة',
    mostLiked: 'الأكثر إعجاباً',
    live: 'مباشر',
    shorts: 'قصيرة',
    featured: 'مميز',
    trending: 'شائع'
  },
  ur: {
    search: 'ویڈیوز تلاش کریں...',
    filter: 'زمرے کے لحاظ سے فلٹر کریں',
    all: 'تمام',
    technology: 'ٹیکنالوجی',
    business: 'کاروبار',
    sports: 'کھیل',
    politics: 'سیاست',
    environment: 'ماحول',
    health: 'صحت',
    gridView: 'گریڈ',
    listView: 'فہرست',
    dateFilter: 'تاریخ فلٹر',
    startDate: 'شروع کی تاریخ',
    endDate: 'ختم ہونے کی تاریخ',
    clearDates: 'تاریخیں صاف کریں',
    applyFilter: 'فلٹر لگائیں',
    sortBy: 'ترتیب دیں بذریعہ',
    newest: 'تازہ ترین پہلے',
    oldest: 'پرانی پہلے',
    mostViewed: 'سب سے زیادہ دیکھا گیا',
    mostLiked: 'سب سے زیادہ پسند کیا گیا',
    live: 'لائیو',
    shorts: 'شارٹس',
    featured: 'نمایاں',
    trending: 'مقبول'
  }
};

export default function VideoFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  viewMode,
  setViewMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortBy,
  setSortBy
}: VideoFiltersProps) {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'ar' | 'ur'];

  const clearDateFilters = () => {
    setStartDate?.(undefined);
    setEndDate?.(undefined);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-lg bg-white dark:bg-gray-800 w-full shadow-sm"
          />
        </div>
        
        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 w-full shadow-sm">
              <SelectValue placeholder={t.filter} />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800">
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="technology">🚀 {t.technology}</SelectItem>
              <SelectItem value="business">💼 {t.business}</SelectItem>
              <SelectItem value="sports">⚽ {t.sports}</SelectItem>
              <SelectItem value="politics">🏛️ {t.politics}</SelectItem>
              <SelectItem value="environment">🌱 {t.environment}</SelectItem>
              <SelectItem value="health">❤️ {t.health}</SelectItem>
              <SelectItem value="live">🔴 {t.live}</SelectItem>
              <SelectItem value="shorts">🎬 {t.shorts}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border border-gray-300 dark:border-gray-600">
              <Calendar className="h-4 w-4" />
              {t.dateFilter}
              {(startDate || endDate) && (
                <Badge variant="secondary" className="ml-1">
                  {startDate && format(startDate, 'MM/dd')}
                  {endDate && ` - ${format(endDate, 'MM/dd')}`}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.startDate}</label>
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.endDate}</label>
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={clearDateFilters}
                  className="flex-1"
                >
                  {t.clearDates}
                </Button>
                <Button className="flex-1">
                  {t.applyFilter}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort By */}
        {setSortBy && (
          <div className="w-full sm:w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 w-full shadow-sm">
                <SelectValue placeholder={t.sortBy} />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800">
                <SelectItem value="newest">{t.newest}</SelectItem>
                <SelectItem value="oldest">{t.oldest}</SelectItem>
                <SelectItem value="mostViewed">{t.mostViewed}</SelectItem>
                <SelectItem value="mostLiked">{t.mostLiked}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`px-3 ${viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`px-3 ${viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {['all', 'featured', 'trending', 'live', 'shorts'].map((filter) => (
          <Badge
            key={filter}
            variant={categoryFilter === filter ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 transition-all ${
              categoryFilter === filter 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setCategoryFilter(filter)}
          >
            {t[filter as keyof typeof t]}
          </Badge>
        ))}
      </div>
    </div>
  );
}