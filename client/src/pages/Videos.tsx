import { useLanguage } from '@/contexts/LanguageContext';
import VideoCard from '@/components/VideoCard';

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
  en: { videos: 'Latest Videos', watch: 'Watch Now' },
  ar: { videos: 'أحدث الفيديوهات', watch: 'شاهد الآن' },
  ur: { videos: 'تازہ ترین ویڈیوز', watch: 'ابھی دیکھیں' },
};

export default function Videos() {
  const { language } = useLanguage();
  const videos = videoData[language];
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">
        {t.videos}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            platform={video.platform}
            videoUrl={video.videoUrl}
            description={video.description}
          />
        ))}
      </div>
    </div>
  );
}
