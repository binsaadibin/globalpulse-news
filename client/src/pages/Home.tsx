import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsCard from '@/components/NewsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import techImage from '@assets/generated_images/Technology_conference_news_image_a9827700.png';
import businessImage from '@assets/generated_images/Business_news_image_9e644ece.png';
import sportsImage from '@assets/generated_images/Sports_news_image_d2821d40.png';
import politicsImage from '@assets/generated_images/Politics_news_image_4610902e.png';
import environmentImage from '@assets/generated_images/Environment_news_image_730d691a.png';
import healthImage from '@assets/generated_images/Health_news_image_c0fc43f8.png';

const newsData = {
  en: [
    {
      id: '1',
      title: 'Global Tech Summit Unveils Revolutionary AI Innovations',
      description: 'Leading technology companies showcase groundbreaking artificial intelligence advancements at the annual international conference, setting new industry standards.',
      category: 'Technology',
      imageUrl: techImage,
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      title: 'International Business Leaders Discuss Economic Growth Strategies',
      description: 'Top executives from Fortune 500 companies meet to address global economic challenges and explore sustainable growth opportunities.',
      category: 'Business',
      imageUrl: businessImage,
      timeAgo: '4 hours ago',
    },
    {
      id: '3',
      title: 'Championship Match Draws Record Breaking Crowd',
      description: 'Historic sports event attracts millions of viewers worldwide as teams compete in thrilling finale match.',
      category: 'Sports',
      imageUrl: sportsImage,
      timeAgo: '5 hours ago',
    },
    {
      id: '4',
      title: 'World Leaders Convene for International Peace Summit',
      description: 'Diplomatic efforts intensify as nations gather to address global security concerns and strengthen international cooperation.',
      category: 'Politics',
      imageUrl: politicsImage,
      timeAgo: '6 hours ago',
    },
    {
      id: '5',
      title: 'Renewable Energy Breakthrough Promises Cleaner Future',
      description: 'Scientists announce major advancement in sustainable energy technology, offering hope for environmental conservation.',
      category: 'Environment',
      imageUrl: environmentImage,
      timeAgo: '8 hours ago',
    },
    {
      id: '6',
      title: 'Medical Research Teams Make Breakthrough Discovery',
      description: 'Innovative healthcare research reveals promising treatment options, marking significant progress in medical science.',
      category: 'Health',
      imageUrl: healthImage,
      timeAgo: '10 hours ago',
    },
  ],
  ar: [
    {
      id: '1',
      title: 'القمة التقنية العالمية تكشف عن ابتكارات ثورية في الذكاء الاصطناعي',
      description: 'تعرض شركات التكنولوجيا الرائدة تطورات رائدة في الذكاء الاصطناعي في المؤتمر الدولي السنوي، وتضع معايير صناعية جديدة.',
      category: 'تكنولوجيا',
      imageUrl: techImage,
      timeAgo: 'منذ ساعتين',
    },
    {
      id: '2',
      title: 'قادة الأعمال الدوليون يناقشون استراتيجيات النمو الاقتصادي',
      description: 'يجتمع كبار المسؤولين التنفيذيين من شركات فورتشن 500 لمعالجة التحديات الاقتصادية العالمية واستكشاف فرص النمو المستدام.',
      category: 'أعمال',
      imageUrl: businessImage,
      timeAgo: 'منذ 4 ساعات',
    },
    {
      id: '3',
      title: 'مباراة البطولة تجذب جمهوراً قياسياً',
      description: 'يجذب الحدث الرياضي التاريخي ملايين المشاهدين في جميع أنحاء العالم حيث تتنافس الفرق في مباراة نهائية مثيرة.',
      category: 'رياضة',
      imageUrl: sportsImage,
      timeAgo: 'منذ 5 ساعات',
    },
    {
      id: '4',
      title: 'قادة العالم يجتمعون لقمة السلام الدولية',
      description: 'تتكثف الجهود الدبلوماسية حيث تجتمع الدول لمعالجة المخاوف الأمنية العالمية وتعزيز التعاون الدولي.',
      category: 'سياسة',
      imageUrl: politicsImage,
      timeAgo: 'منذ 6 ساعات',
    },
    {
      id: '5',
      title: 'اختراق في الطاقة المتجددة يعد بمستقبل أنظف',
      description: 'يعلن العلماء عن تقدم كبير في تكنولوجيا الطاقة المستدامة، مما يوفر الأمل في الحفاظ على البيئة.',
      category: 'بيئة',
      imageUrl: environmentImage,
      timeAgo: 'منذ 8 ساعات',
    },
    {
      id: '6',
      title: 'فرق البحث الطبي تحقق اكتشافاً رائداً',
      description: 'يكشف البحث الصحي المبتكر عن خيارات علاجية واعدة، مما يمثل تقدماً كبيراً في العلوم الطبية.',
      category: 'صحة',
      imageUrl: healthImage,
      timeAgo: 'منذ 10 ساعات',
    },
  ],
  ur: [
    {
      id: '1',
      title: 'عالمی ٹیک سمٹ نے مصنوعی ذہانت میں انقلابی ایجادات کا اعلان کیا',
      description: 'معروف ٹیکنالوجی کمپنیاں سالانہ بین الاقوامی کانفرنس میں مصنوعی ذہانت میں بڑی پیش رفت کا مظاہرہ کرتی ہیں، نئے صنعتی معیارات قائم کرتی ہیں۔',
      category: 'ٹیکنالوجی',
      imageUrl: techImage,
      timeAgo: '2 گھنٹے پہلے',
    },
    {
      id: '2',
      title: 'بین الاقوامی کاروباری رہنماؤں نے اقتصادی ترقی کی حکمت عملیوں پر بات کی',
      description: 'فورچن 500 کمپنیوں کے اعلیٰ عہدیدار عالمی معاشی چیلنجوں سے نمٹنے اور پائیدار ترقی کے مواقع تلاش کرنے کے لیے ملتے ہیں۔',
      category: 'کاروبار',
      imageUrl: businessImage,
      timeAgo: '4 گھنٹے پہلے',
    },
    {
      id: '3',
      title: 'چیمپئن شپ میچ نے ریکارڈ توڑ ہجوم کو اپنی طرف متوجہ کیا',
      description: 'تاریخی کھیلوں کا ایونٹ دنیا بھر سے لاکھوں ناظرین کو اپنی طرف متوجہ کرتا ہے جب ٹیمیں سنسنی خیز فائنل میچ میں مقابلہ کرتی ہیں۔',
      category: 'کھیل',
      imageUrl: sportsImage,
      timeAgo: '5 گھنٹے پہلے',
    },
    {
      id: '4',
      title: 'عالمی رہنما بین الاقوامی امن سربراہی اجلاس کے لیے جمع',
      description: 'سفارتی کوششوں میں تیزی آئی کیونکہ اقوام عالمی سلامتی کے خدشات کو دور کرنے اور بین الاقوامی تعاون کو مضبوط بنانے کے لیے جمع ہوئیں۔',
      category: 'سیاست',
      imageUrl: politicsImage,
      timeAgo: '6 گھنٹے پہلے',
    },
    {
      id: '5',
      title: 'قابل تجدید توانائی میں پیش رفت صاف مستقبل کا وعدہ',
      description: 'سائنسدانوں نے پائیدار توانائی کی ٹیکنالوجی میں بڑی پیش رفت کا اعلان کیا، ماحولیاتی تحفظ کی امید فراہم کرتے ہوئے۔',
      category: 'ماحولیات',
      imageUrl: environmentImage,
      timeAgo: '8 گھنٹے پہلے',
    },
    {
      id: '6',
      title: 'طبی تحقیقی ٹیموں نے بڑی دریافت کی',
      description: 'اختراعی صحت کی تحقیق نے امید افزا علاج کے اختیارات کا انکشاف کیا، جو طبی سائنس میں نمایاں پیش رفت کی نشاندہی کرتا ہے۔',
      category: 'صحت',
      imageUrl: healthImage,
      timeAgo: '10 گھنٹے پہلے',
    },
  ],
};

const translations = {
  en: { topNews: 'Top News', featured: 'Featured' },
  ar: { topNews: 'أهم الأخبار', featured: 'مميز' },
  ur: { topNews: 'اہم خبریں', featured: 'نمایاں' },
};

export default function Home() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const news = newsData[language];
  const t = translations[language];

  const handleNewsClick = (newsId: string) => {
    console.log('News clicked:', newsId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">
        {t.topNews}
      </h1>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" data-testid="tab-all">
            {language === 'en' ? 'All' : language === 'ar' ? 'الكل' : 'تمام'}
          </TabsTrigger>
          <TabsTrigger value="featured" data-testid="tab-featured">
            {t.featured}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                description={article.description}
                category={article.category}
                imageUrl={article.imageUrl}
                timeAgo={article.timeAgo}
                onClick={() => handleNewsClick(article.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                description={article.description}
                category={article.category}
                imageUrl={article.imageUrl}
                timeAgo={article.timeAgo}
                onClick={() => handleNewsClick(article.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
