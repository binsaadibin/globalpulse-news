import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

const videoData = {
  en: [
    {
      id: '1',
      title: 'Breaking: International Climate Summit 2024',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'World leaders discuss urgent environmental policies and global cooperation for climate action.',
    },
    {
      id: '2',
      title: 'Live: Global Economic Forum',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Business leaders share insights on economic recovery and future market trends.',
    },
    {
      id: '3',
      title: 'Sports Highlights: Championship Finals',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Exciting moments from the international championship match.',
    },
  ],
  ar: [
    {
      id: '1',
      title: 'عاجل: قمة المناخ الدولية 2024',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'يناقش قادة العالم السياسات البيئية العاجلة والتعاون العالمي من أجل العمل المناخي.',
    },
    {
      id: '2',
      title: 'مباشر: المنتدى الاقتصادي العالمي',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'يشارك قادة الأعمال رؤىهم حول التعافي الاقتصادي واتجاهات السوق المستقبلية.',
    },
    {
      id: '3',
      title: 'أبرز اللحظات الرياضية: نهائيات البطولة',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'لحظات مثيرة من مباراة البطولة الدولية.',
    },
  ],
  ur: [
    {
      id: '1',
      title: 'بریکنگ: بین الاقوامی موسمیاتی سربراہی اجلاس 2024',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'عالمی رہنما موسمیاتی کارروائی کے لیے فوری ماحولیاتی پالیسیوں اور عالمی تعاون پر بات کرتے ہیں۔',
    },
    {
      id: '2',
      title: 'لائیو: عالمی اقتصادی فورم',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'کاروباری رہنما معاشی بحالی اور مستقبل کے مارکیٹ کے رجحانات پر بصیرت کا اشتراک کرتے ہیں۔',
    },
    {
      id: '3',
      title: 'کھیلوں کی جھلکیاں: چیمپئن شپ فائنل',
      platform: 'YouTube' as const,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'بین الاقوامی چیمپئن شپ میچ کے دلچسپ لمحات۔',
    },
  ],
};

const translations = {
  en: { videos: 'Latest Videos', watch: 'Watch Now', search: 'Search videos...', filter: 'Filter by platform', all: 'All Platforms', noResults: 'No videos found' },
  ar: { videos: 'أحدث الفيديوهات', watch: 'شاهد الآن', search: 'ابحث عن الفيديوهات...', filter: 'تصفية حسب المنصة', all: 'جميع المنصات', noResults: 'لم يتم العثور على فيديوهات' },
  ur: { videos: 'تازہ ترین ویڈیوز', watch: 'ابھی دیکھیں', search: 'ویڈیوز تلاش کریں...', filter: 'پلیٹ فارم کے مطابق فلٹر کریں', all: 'تمام پلیٹ فارمز', noResults: 'کوئی ویڈیو نہیں ملی' },
};

export default function Videos() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const videos = videoData[language];
  const t = translations[language];

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = searchQuery === '' || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPlatform = platformFilter === 'all' || 
        video.platform.toLowerCase() === platformFilter.toLowerCase();
      
      return matchesSearch && matchesPlatform;
    });
  }, [videos, searchQuery, platformFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">
        {t.videos}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-videos"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger data-testid="select-filter-platform">
              <SelectValue placeholder={t.filter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-no-results">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              platform={video.platform}
              videoUrl={video.videoUrl}
              description={video.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
