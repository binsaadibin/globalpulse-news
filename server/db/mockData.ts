// Mock database
export const users = [
  { id: '1', username: 'globalplus', password: 'globalplus@4455', role: 'admin' },
  { id: '2', username: 'globalnews', password: 'globalnews@4455', role: 'admin' },
  { id: '3', username: 'haroonosmani', password: 'haroon@1324', role: 'editor' },
];

export let articles: any[] = [];

export const videos = [
  {
    _id: '1',
    title: {
      en: 'Breaking News: Global Summit Concludes',
      ar: 'أخبار عاجلة: انتهاء القمة العالمية',
      ur: 'بریکنگ نیوز: عالمی سربراہی اجلاس کا اختتام'
    },
    description: {
      en: 'World leaders reach historic agreement on climate change',
      ar: 'قادة العالم يتوصلون إلى اتفاق تاريخي بشأن تغير المناخ',
      ur: 'عالمی رہنما موسمیاتی تبدیلی پر تاریخی معاہدے پر پہنچے'
    },
    videoUrl: 'https://youtube.com/watch?v=abc123',
    platform: 'youtube',
    category: 'politics',
    thumbnail: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800',
    status: 'published',
    views: 15000,
    likes: 1200,
    isFeatured: true,
    isTrending: true,
    isLive: false,
    isShort: false,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: {
      en: 'Tech Innovation 2024',
      ar: 'الابتكار التكنولوجي 2024',
      ur: 'ٹیک انوویشن 2024'
    },
    description: {
      en: 'Latest technological advancements shaping our future',
      ar: 'أحدث التطورات التكنولوجية التي تشكل مستقبلنا',
      ur: 'تازہ ترین ٹیکنالوجی کی ترقیاں جو ہمارے مستقبل کو تشکیل دے رہی ہیں'
    },
    videoUrl: 'https://youtube.com/watch?v=def456',
    platform: 'youtube',
    category: 'technology',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    status: 'published',
    views: 8900,
    likes: 650,
    isFeatured: false,
    isTrending: true,
    isLive: false,
    isShort: false,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    _id: '3',
    title: {
      en: 'Live Sports Update',
      ar: 'تحديث رياضي مباشر',
      ur: 'لائیو اسپورٹس اپ ڈیٹ'
    },
    description: {
      en: 'Championship finals live coverage',
      ar: 'بث مباشر للنهائيات البطولة',
      ur: 'چیمپئن شپ فائنلز کی براہ راست کوریج'
    },
    videoUrl: 'https://youtube.com/watch?v=ghi789',
    platform: 'youtube',
    category: 'sports',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    status: 'published',
    views: 25000,
    likes: 1800,
    isFeatured: true,
    isTrending: false,
    isLive: true,
    isShort: false,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: '2024-01-15T18:00:00Z',
    updatedAt: '2024-01-15T18:00:00Z'
  },
  {
    _id: '4',
    title: {
      en: 'Quick News Short',
      ar: 'نبأ قصير سريع',
      ur: 'فوری خبر شارٹ'
    },
    description: {
      en: '60-second news summary',
      ar: 'ملخص الأخبار في 60 ثانية',
      ur: '60 سیکنڈ کا خبروں کا خلاصہ'
    },
    videoUrl: 'https://youtube.com/watch?v=jkl012',
    platform: 'youtube',
    category: 'news',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
    status: 'published',
    views: 12000,
    likes: 950,
    isFeatured: false,
    isTrending: false,
    isLive: false,
    isShort: true,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z'
  },
  {
    _id: '5',
    title: {
      en: 'Business Market Analysis',
      ar: 'تحليل سوق الأعمال',
      ur: 'بزنس مارکیٹ تجزیہ'
    },
    description: {
      en: 'Weekly stock market trends and predictions',
      ar: 'اتجاهات وتوقعات سوق الأسهم الأسبوعية',
      ur: 'ہفتہ وار اسٹاک مارکیٹ کے رجحانات اور پیشین گوئیاں'
    },
    videoUrl: 'https://youtube.com/watch?v=mno345',
    platform: 'youtube',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    status: 'published',
    views: 7500,
    likes: 420,
    isFeatured: false,
    isTrending: true,
    isLive: false,
    isShort: false,
    createdBy: '3',
    createdByUsername: 'haroonosmani',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    _id: '6',
    title: {
      en: 'Health Tips Short',
      ar: 'نصائح صحية قصيرة',
      ur: 'صحت کے نکات شارٹ'
    },
    description: {
      en: 'Quick daily health tips in 45 seconds',
      ar: 'نصائح صحية يومية سريعة في 45 ثانية',
      ur: '45 سیکنڈ میں روزانہ صحت کے فوری نکات'
    },
    videoUrl: 'https://youtube.com/watch?v=pqr678',
    platform: 'youtube',
    category: 'health',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    status: 'published',
    views: 9800,
    likes: 780,
    isFeatured: false,
    isTrending: false,
    isLive: false,
    isShort: true,
    createdBy: '3',
    createdByUsername: 'haroonosmani',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    _id: '7',
    title: {
      en: 'Environmental Documentary',
      ar: 'فيلم وثائقي بيئي',
      ur: 'ماحولیاتی دستاویزی فلم'
    },
    description: {
      en: 'The impact of climate change on polar regions',
      ar: 'تأثير تغير المناخ على المناطق القطبية',
      ur: 'قطبی علاقوں پر موسمیاتی تبدیلی کے اثرات'
    },
    videoUrl: 'https://youtube.com/watch?v=stu901',
    platform: 'youtube',
    category: 'environment',
    thumbnail: 'https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=800',
    status: 'published',
    views: 5600,
    likes: 320,
    isFeatured: true,
    isTrending: false,
    isLive: false,
    isShort: false,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-12T11:45:00Z'
  },
  {
    _id: '8',
    title: {
      en: 'Breaking News Live',
      ar: 'أخبار عاجلة مباشرة',
      ur: 'بریکنگ نیوز لائیو'
    },
    description: {
      en: 'Live coverage of major political announcement',
      ar: 'بث مباشر لإعلان سياسي كبير',
      ur: 'بڑی سیاسی اعلان کی براہ راست کوریج'
    },
    videoUrl: 'https://youtube.com/watch?v=vwx234',
    platform: 'youtube',
    category: 'politics',
    thumbnail: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800',
    status: 'published',
    views: 32000,
    likes: 2100,
    isFeatured: true,
    isTrending: true,
    isLive: true,
    isShort: false,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: '2024-01-15T20:00:00Z',
    updatedAt: '2024-01-15T20:00:00Z'
  }
];

// Mock advertisements data
export let advertisements = [
  {
    _id: 'ad1',
    title: {
      en: 'Premium News Subscription',
      ar: 'اشتراك الأخبار المميز',
      ur: 'پریمیم نیوز سبسکرپشن'
    },
    description: {
      en: 'Get unlimited access to exclusive content and ad-free experience',
      ar: 'احصل على وصول غير محدود إلى المحتوى الحصري وتجربة خالية من الإعلانات',
      ur: 'خصوصی مواد تک لامحدود رسائی اور اشتہار سے پاک تجربہ حاصل کریں'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    targetUrl: 'https://globalpulse.com/premium',
    position: 'sidebar',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    clicks: 45,
    impressions: 1200,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: 'ad2',
    title: {
      en: 'Breaking News App',
      ar: 'تطبيق الأخبار العاجلة',
      ur: 'بریکنگ نیوز ایپ'
    },
    description: {
      en: 'Download our mobile app for instant notifications and offline reading',
      ar: 'قم بتنزيل تطبيقنا للجوال للحصول على إشعارات فورية وقراءة دون اتصال',
      ur: 'فوری اطلاعات اور آف لائن پڑھنے کے لیے ہماری موبائل ایپ ڈاؤن لوڈ کریں'
    },
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    targetUrl: 'https://globalpulse.com/app-download',
    position: 'banner',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    clicks: 78,
    impressions: 2500,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: '2024-01-02T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    _id: 'ad3',
    title: {
      en: 'Live Event Coverage',
      ar: 'تغطية الأحداث المباشرة',
      ur: 'لائیو ایونٹ کوریج'
    },
    description: {
      en: 'Watch exclusive live coverage of global events and conferences',
      ar: 'شاهد البث المباشر الحصري للأحداث والمؤتمرات العالمية',
      ur: 'عالمی واقعات اور کانفرنسوں کی خصوصی براہ راست کوریج دیکھیں'
    },
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    targetUrl: 'https://globalpulse.com/live-events',
    position: 'sidebar',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    clicks: 32,
    impressions: 800,
    createdBy: '1',
    createdByUsername: 'globalplus',
    createdAt: '2024-01-03T14:20:00Z',
    updatedAt: '2024-01-15T11:20:00Z'
  },
  {
    _id: 'ad4',
    title: {
      en: 'Newsletter Subscription',
      ar: 'اشتراك النشرة الإخبارية',
      ur: 'نیوز لیٹر سبسکرپشن'
    },
    description: {
      en: 'Get daily news digest delivered to your inbox',
      ar: 'احصل على ملخص الأخبار اليومي في بريدك الإلكتروني',
      ur: 'اپنے ان باکس میں روزانہ خبروں کا خلاصہ حاصل کریں'
    },
    imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=400&h=300&fit=crop',
    targetUrl: 'https://globalpulse.com/newsletter',
    position: 'banner',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    clicks: 56,
    impressions: 1800,
    createdBy: '3',
    createdByUsername: 'haroonosmani',
    createdAt: '2024-01-04T11:30:00Z',
    updatedAt: '2024-01-15T13:15:00Z'
  },
  {
    _id: 'ad5',
    title: {
      en: 'Exclusive Interviews',
      ar: 'مقابلات حصرية',
      ur: 'خصوصی انٹرویوز'
    },
    description: {
      en: 'Access exclusive interviews with world leaders and celebrities',
      ar: 'الوصول إلى مقابلات حصرية مع قادة العالم والمشاهير',
      ur: 'عالمی رہنماوں اور مشہور شخصیات کے خصوصی انٹرویوز تک رسائی حاصل کریں'
    },
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    targetUrl: 'https://globalpulse.com/interviews',
    position: 'sidebar',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    clicks: 29,
    impressions: 950,
    createdBy: '2',
    createdByUsername: 'globalnews',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-15T15:40:00Z'
  }
];