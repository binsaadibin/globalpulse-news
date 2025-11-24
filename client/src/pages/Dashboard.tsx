import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Eye, Video, FileText, Calendar, Users, TrendingUp, Star, Search, Filter, Save, Send, X, Link, Image } from 'lucide-react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome back',
    stats: 'Your Stats',
    totalArticles: 'Total Articles',
    totalVideos: 'Total Videos',
    totalViews: 'Total Views',
    createNew: 'Create New',
    articles: 'Articles',
    videos: 'Videos',
    drafts: 'Drafts',
    published: 'Published',
    all: 'All',
    title: 'Title',
    description: 'Description',
    category: 'Category',
    imageUrl: 'Image URL',
    videoUrl: 'Video URL',
    platform: 'Platform',
    status: 'Status',
    actions: 'Actions',
    publish: 'Publish',
    saveDraft: 'Save Draft',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    noArticles: 'No articles yet',
    noVideos: 'No videos yet',
    createArticle: 'Create Article',
    createVideo: 'Create Video',
    search: 'Search...',
    filterByStatus: 'Filter by status',
    technology: 'Technology',
    business: 'Business',
    sports: 'Sports',
    politics: 'Politics',
    environment: 'Environment',
    health: 'Health',
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    other: 'Other',
    articlePublished: 'Article published successfully',
    articleSaved: 'Article saved as draft',
    videoPublished: 'Video published successfully',
    videoSaved: 'Video saved as draft',
    error: 'An error occurred',
    confirmDelete: 'Are you sure you want to delete this?',
    deleted: 'Deleted successfully',
    readTime: 'Read Time',
    minutes: 'minutes',
    content: 'Content',
    articleContent: 'Article content...',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    titleEn: 'Title (English)',
    titleAr: 'Title (Arabic)',
    titleUr: 'Title (Urdu)',
    descriptionEn: 'Description (English)',
    descriptionAr: 'Description (Arabic)',
    descriptionUr: 'Description (Urdu)',
    contentEn: 'Content (English)',
    contentAr: 'Content (Arabic)',
    contentUr: 'Content (Urdu)',
    analytics: 'Analytics',
    performance: 'Performance',
    recentActivity: 'Recent Activity',
    featured: 'Featured',
    trending: 'Trending',
    makeFeatured: 'Make Featured',
    makeTrending: 'Make Trending',
    thumbnail: 'Thumbnail URL',
    videoId: 'Video ID',
    embedUrl: 'Embed URL',
    videoTitle: 'Video Title',
    videoTitleEn: 'Video Title (English)',
    videoTitleAr: 'Video Title (Arabic)',
    videoTitleUr: 'Video Title (Urdu)',
    enterVideoUrl: 'Enter video URL...',
    enterThumbnailUrl: 'Enter thumbnail URL...'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    welcome: 'مرحباً بعودتك',
    stats: 'إحصائياتك',
    totalArticles: 'إجمالي المقالات',
    totalVideos: 'إجمالي الفيديوهات',
    totalViews: 'إجمالي المشاهدات',
    createNew: 'إنشاء جديد',
    articles: 'المقالات',
    videos: 'الفيديوهات',
    drafts: 'مسودات',
    published: 'منشور',
    all: 'الكل',
    title: 'العنوان',
    description: 'الوصف',
    category: 'الفئة',
    imageUrl: 'رابط الصورة',
    videoUrl: 'رابط الفيديو',
    platform: 'المنصة',
    status: 'الحالة',
    actions: 'الإجراءات',
    publish: 'نشر',
    saveDraft: 'حفظ كمسودة',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    noArticles: 'لا توجد مقالات بعد',
    noVideos: 'لا توجد فيديوهات بعد',
    createArticle: 'إنشاء مقال',
    createVideo: 'إنشاء فيديو',
    search: 'بحث...',
    filterByStatus: 'تصفية حسب الحالة',
    technology: 'تكنولوجيا',
    business: 'أعمال',
    sports: 'رياضة',
    politics: 'سياسة',
    environment: 'بيئة',
    health: 'صحة',
    youtube: 'يوتيوب',
    vimeo: 'فيميو',
    other: 'أخرى',
    articlePublished: 'تم نشر المقال بنجاح',
    articleSaved: 'تم حفظ المقال كمسودة',
    videoPublished: 'تم نشر الفيديو بنجاح',
    videoSaved: 'تم حفظ الفيديو كمسودة',
    error: 'حدث خطأ',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    deleted: 'تم الحذف بنجاح',
    readTime: 'وقت القراءة',
    minutes: 'دقائق',
    content: 'المحتوى',
    articleContent: 'محتوى المقال...',
    cancel: 'إلغاء',
    create: 'إنشاء',
    update: 'تحديث',
    titleEn: 'العنوان (الإنجليزية)',
    titleAr: 'العنوان (العربية)',
    titleUr: 'العنوان (الأردية)',
    descriptionEn: 'الوصف (الإنجليزية)',
    descriptionAr: 'الوصف (العربية)',
    descriptionUr: 'الوصف (الأردية)',
    contentEn: 'المحتوى (الإنجليزية)',
    contentAr: 'المحتوى (العربية)',
    contentUr: 'المحتوى (الأردية)',
    analytics: 'التحليلات',
    performance: 'الأداء',
    recentActivity: 'النشاط الحديث',
    featured: 'مميز',
    trending: 'شائع',
    makeFeatured: 'جعله مميزاً',
    makeTrending: 'جعله شائعاً',
    thumbnail: 'رابط الصورة المصغرة',
    videoId: 'معرف الفيديو',
    embedUrl: 'رابط التضمين',
    videoTitle: 'عنوان الفيديو',
    videoTitleEn: 'عنوان الفيديو (الإنجليزية)',
    videoTitleAr: 'عنوان الفيديو (العربية)',
    videoTitleUr: 'عنوان الفيديو (الأردية)',
    enterVideoUrl: 'أدخل رابط الفيديو...',
    enterThumbnailUrl: 'أدخل رابط الصورة المصغرة...'
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    welcome: 'خوش آمدید',
    stats: 'آپ کے اعداد و شمار',
    totalArticles: 'کل مضامین',
    totalVideos: 'کل ویڈیوز',
    totalViews: 'کل ویوز',
    createNew: 'نیا بنائیں',
    articles: 'مضامین',
    videos: 'ویڈیوز',
    drafts: 'ڈرافٹس',
    published: 'شائع شدہ',
    all: 'سب',
    title: 'عنوان',
    description: 'تفصیل',
    category: 'زمرہ',
    imageUrl: 'تصویر کا لنک',
    videoUrl: 'ویڈیو کا لنک',
    platform: 'پلیٹ فارم',
    status: 'حالت',
    actions: 'اعمال',
    publish: 'شائع کریں',
    saveDraft: 'ڈرافٹ کے طور پر محفوظ کریں',
    edit: 'ترمیم',
    delete: 'حذف کریں',
    view: 'دیکھیں',
    noArticles: 'ابھی تک کوئی مضمون نہیں',
    noVideos: 'ابھی تک کوئی ویڈیو نہیں',
    createArticle: 'مضمون بنائیں',
    createVideo: 'ویڈیو بنائیں',
    search: 'تلاش کریں...',
    filterByStatus: 'حالت کے لحاظ سے فلٹر کریں',
    technology: 'ٹیکنالوجی',
    business: 'کاروبار',
    sports: 'کھیل',
    politics: 'سیاست',
    environment: 'ماحول',
    health: 'صحت',
    youtube: 'یوٹیوب',
    vimeo: 'Vimeo',
    other: 'دیگر',
    articlePublished: 'مضمون کامیابی سے شائع ہوگیا',
    articleSaved: 'مضمون ڈرافٹ کے طور پر محفوظ ہوگیا',
    videoPublished: 'ویڈیو کامیابی سے شائع ہوگئی',
    videoSaved: 'ویڈیو ڈرافٹ کے طور پر محفوظ ہوگئی',
    error: 'ایک خرابی پیش آگئی',
    confirmDelete: 'کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟',
    deleted: 'کامیابی سے حذف ہوگیا',
    readTime: 'پڑھنے کا وقت',
    minutes: 'منٹ',
    content: 'مواد',
    articleContent: 'مضمون کا مواد...',
    cancel: 'منسوخ کریں',
    create: 'بنائیں',
    update: 'اپ ڈیٹ کریں',
    titleEn: 'عنوان (انگریزی)',
    titleAr: 'عنوان (عربی)',
    titleUr: 'عنوان (اردو)',
    descriptionEn: 'تفصیل (انگریزی)',
    descriptionAr: 'تفصیل (عربی)',
    descriptionUr: 'تفصیل (اردو)',
    contentEn: 'مواد (انگریزی)',
    contentAr: 'مواد (عربی)',
    contentUr: 'مواد (اردو)',
    analytics: 'تجزیات',
    performance: 'کارکردگی',
    recentActivity: 'حالیہ سرگرمی',
    featured: 'نمایاں',
    trending: 'مقبول',
    makeFeatured: 'نمایاں بنائیں',
    makeTrending: 'مقبول بنائیں',
    thumbnail: 'تھمب نیل کا لنک',
    videoId: 'ویڈیو آئی ڈی',
    embedUrl: 'ایمبیڈ لنک',
    videoTitle: 'ویڈیو کا عنوان',
    videoTitleEn: 'ویڈیو کا عنوان (انگریزی)',
    videoTitleAr: 'ویڈیو کا عنوان (عربی)',
    videoTitleUr: 'ویڈیو کا عنوان (اردو)',
    enterVideoUrl: 'ویڈیو کا لنک درج کریں...',
    enterThumbnailUrl: 'تھمب نیل کا لنک درج کریں...'
  }
};

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

interface Article {
  _id: string;
  title: any;
  description: any;
  content?: any;
  category: string;
  imageUrl: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
  createdByUsername?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

interface Video {
  _id: string;
  title: any;
  videoUrl: string;
  platform: string;
  category: string;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
  createdByUsername?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  thumbnailUrl?: string;
}

// Article Form Component
function ArticleForm({ editingArticle, onSave, onCancel, loading, translations }: any) {
  const [formData, setFormData] = useState({
    title: editingArticle?.title || { en: '', ar: '', ur: '' },
    description: editingArticle?.description || { en: '', ar: '', ur: '' },
    content: editingArticle?.content || { en: '', ar: '', ur: '' },
    category: editingArticle?.category || 'technology',
    imageUrl: editingArticle?.imageUrl || '',
    readTime: editingArticle?.readTime?.replace(' min read', '') || '5',
    status: editingArticle?.status || 'draft',
    isFeatured: editingArticle?.isFeatured || false,
    isTrending: editingArticle?.isTrending || false,
  });

  const handleSubmit = (status: 'draft' | 'published') => {
    onSave({
      ...formData,
      status,
      readTime: `${formData.readTime} min read`
    });
  };

  return (
    <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{editingArticle ? translations.update : translations.create} {translations.createArticle}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Article Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleEn} *</label>
              <Input
                value={formData.title.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value }
                }))}
                placeholder="Enter title in English"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleAr}</label>
              <Input
                value={formData.title.ar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, ar: e.target.value }
                }))}
                placeholder="Enter title in Arabic"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleUr}</label>
              <Input
                value={formData.title.ur || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, ur: e.target.value }
                }))}
                placeholder="Enter title in Urdu"
                className="w-full"
              />
            </div>
          </div>

          {/* Article Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionEn} *</label>
              <Textarea
                value={formData.description.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, en: e.target.value }
                }))}
                placeholder="Enter description in English"
                rows={3}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionAr}</label>
              <Textarea
                value={formData.description.ar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, ar: e.target.value }
                }))}
                placeholder="Enter description in Arabic"
                rows={3}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionUr}</label>
              <Textarea
                value={formData.description.ur || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, ur: e.target.value }
                }))}
                placeholder="Enter description in Urdu"
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          {/* Article Content Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentEn} *</label>
              <Textarea
                value={formData.content.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, en: e.target.value }
                }))}
                placeholder={translations.articleContent}
                rows={6}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentAr}</label>
              <Textarea
                value={formData.content.ar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, ar: e.target.value }
                }))}
                placeholder={translations.articleContent}
                rows={6}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentUr}</label>
              <Textarea
                value={formData.content.ur || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, ur: e.target.value }
                }))}
                placeholder={translations.articleContent}
                rows={6}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.category}</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">{translations.technology}</SelectItem>
                  <SelectItem value="business">{translations.business}</SelectItem>
                  <SelectItem value="sports">{translations.sports}</SelectItem>
                  <SelectItem value="politics">{translations.politics}</SelectItem>
                  <SelectItem value="environment">{translations.environment}</SelectItem>
                  <SelectItem value="health">{translations.health}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{translations.readTime} ({translations.minutes})</label>
              <Input
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                placeholder="5"
                min="1"
                max="60"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">{translations.imageUrl}</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Featured & Trending Toggles */}
          <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
              />
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                {translations.makeFeatured}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isTrending}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTrending: checked }))}
              />
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                {translations.makeTrending}
              </Label>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {translations.cancel}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('draft')} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {translations.saveDraft}
            </Button>
            <Button 
              onClick={() => handleSubmit('published')} 
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              {translations.publish}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Video Form Component
function VideoForm({ editingVideo, onSave, onCancel, loading, translations }: any) {
  const [formData, setFormData] = useState({
    title: editingVideo?.title || { en: '', ar: '', ur: '' },
    videoUrl: editingVideo?.videoUrl || '',
    platform: editingVideo?.platform || 'youtube',
    category: editingVideo?.category || 'technology',
    thumbnailUrl: editingVideo?.thumbnailUrl || '',
    status: editingVideo?.status || 'draft',
    isFeatured: editingVideo?.isFeatured || false,
    isTrending: editingVideo?.isTrending || false,
  });

  const handleSubmit = (status: 'draft' | 'published') => {
    onSave({
      ...formData,
      status
    });
  };

  return (
    <Card className="mb-8 border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <span>{editingVideo ? translations.update : translations.create} {translations.createVideo}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Video Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleEn} *</label>
              <Input
                value={formData.title.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value }
                }))}
                placeholder="Enter video title in English"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleAr}</label>
              <Input
                value={formData.title.ar || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, ar: e.target.value }
                }))}
                placeholder="Enter video title in Arabic"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleUr}</label>
              <Input
                value={formData.title.ur || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: { ...prev.title, ur: e.target.value }
                }))}
                placeholder="Enter video title in Urdu"
                className="w-full"
              />
            </div>
          </div>

          {/* Video URL and Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoUrl} *</label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{translations.platform}</label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">{translations.youtube}</SelectItem>
                  <SelectItem value="vimeo">{translations.vimeo}</SelectItem>
                  <SelectItem value="other">{translations.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thumbnail and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.thumbnail}</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{translations.category}</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">{translations.technology}</SelectItem>
                  <SelectItem value="business">{translations.business}</SelectItem>
                  <SelectItem value="sports">{translations.sports}</SelectItem>
                  <SelectItem value="politics">{translations.politics}</SelectItem>
                  <SelectItem value="environment">{translations.environment}</SelectItem>
                  <SelectItem value="health">{translations.health}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured & Trending Toggles */}
          <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
              />
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                {translations.makeFeatured}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isTrending}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTrending: checked }))}
              />
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                {translations.makeTrending}
              </Label>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {translations.cancel}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('draft')} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {translations.saveDraft}
            </Button>
            <Button 
              onClick={() => handleSubmit('published')} 
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              {translations.publish}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { currentUser, getAuthHeaders } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [activeTab, setActiveTab] = useState('overview');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form states
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching user data...');
      await Promise.all([
        fetchUserArticles(),
        fetchUserVideos()
      ]);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      toast({
        title: t.error,
        description: 'Failed to load your content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserArticles = async () => {
    try {
      console.log('🔍 Fetching user articles from /api/articles/my-articles');
      console.log('👤 Current User:', currentUser);
      
      const headers = getAuthHeaders();
      console.log('🔑 Headers:', headers);

      const response = await fetch(`${API_BASE_URL}/api/articles/my-articles`, {
        headers: headers
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response URL:', response.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User articles response:', data);
        
        let articlesArray = [];
        
        if (data.success && Array.isArray(data.articles)) {
          articlesArray = data.articles;
        } else if (Array.isArray(data)) {
          articlesArray = data;
        } else if (data && Array.isArray(data.data)) {
          articlesArray = data.data;
        }
        
        console.log(`📝 Loaded ${articlesArray.length} user articles`);
        setArticles(articlesArray);
      } else {
        console.error('❌ Failed to fetch user articles. Status:', response.status);
        if (response.status === 401) {
          toast({
            title: 'Authentication Required',
            description: 'Please log in again',
            variant: 'destructive'
          });
        } else if (response.status === 404) {
          console.error('❌ Endpoint /api/articles/my-articles not found');
          toast({
            title: 'Service Error',
            description: 'User articles endpoint not available',
            variant: 'destructive'
          });
        }
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Error fetching user articles:', error);
      toast({
        title: t.error,
        description: 'Failed to load your articles',
        variant: 'destructive'
      });
      setArticles([]);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/my-videos`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        let videosArray: Video[] = [];
        
        if (Array.isArray(data)) {
          videosArray = data;
        } else if (data && Array.isArray(data.data)) {
          videosArray = data.data;
        } else if (data && Array.isArray(data.videos)) {
          videosArray = data.videos;
        } else if (data && typeof data === 'object') {
          videosArray = [data];
        }
        
        setVideos(videosArray);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
    }
  };

  // Article handlers
  const handleSaveArticle = async (articleData: any) => {
    try {
      setFormLoading(true);
      const url = editingArticle 
        ? `${API_BASE_URL}/api/articles/${editingArticle._id}`
        : `${API_BASE_URL}/api/articles`;

      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(articleData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: articleData.status === 'published' ? t.articlePublished : t.articleSaved,
          description: editingArticle ? 'Article updated successfully' : `Article ${articleData.status === 'published' ? 'published' : 'saved as draft'} successfully`
        });
        resetForms();
        fetchUserArticles();
      } else {
        throw new Error(data.message || t.error);
      }
    } catch (error: any) {
      console.error('Article error:', error);
      toast({
        title: t.error,
        description: error.message || 'Failed to save article',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Video handlers
  const handleSaveVideo = async (videoData: any) => {
    try {
      setFormLoading(true);
      const url = editingVideo 
        ? `${API_BASE_URL}/api/videos/${editingVideo._id}`
        : `${API_BASE_URL}/api/videos`;

      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(videoData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: videoData.status === 'published' ? t.videoPublished : t.videoSaved,
          description: editingVideo ? 'Video updated successfully' : `Video ${videoData.status === 'published' ? 'published' : 'saved as draft'} successfully`
        });
        resetForms();
        fetchUserVideos();
      } else {
        throw new Error(data.message || t.error);
      }
    } catch (error: any) {
      console.error('Video error:', error);
      toast({
        title: t.error,
        description: error.message || 'Failed to save video',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'article' | 'video') => {
    if (!confirm(t.confirmDelete)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${type}s/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: t.deleted,
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
        });
        if (type === 'article') {
          fetchUserArticles();
        } else {
          fetchUserVideos();
        }
      } else {
        throw new Error(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: t.error,
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    }
  };

  const handleToggleFeatured = async (id: string, type: 'article' | 'video', currentStatus: boolean) => {
    try {
      const url = `${API_BASE_URL}/api/${type}s/${id}`;
      const updateData = {
        isFeatured: !currentStatus
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${type} ${!currentStatus ? 'marked as featured' : 'removed from featured'}`
        });
        if (type === 'article') {
          fetchUserArticles();
        } else {
          fetchUserVideos();
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast({
        title: t.error,
        description: 'Failed to update featured status',
        variant: 'destructive'
      });
    }
  };

  const handleToggleTrending = async (id: string, type: 'article' | 'video', currentStatus: boolean) => {
    try {
      const url = `${API_BASE_URL}/api/${type}s/${id}`;
      const updateData = {
        isTrending: !currentStatus
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${type} ${!currentStatus ? 'marked as trending' : 'removed from trending'}`
        });
        if (type === 'article') {
          fetchUserArticles();
        } else {
          fetchUserVideos();
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Toggle trending error:', error);
      toast({
        title: t.error,
        description: 'Failed to update trending status',
        variant: 'destructive'
      });
    }
  };

  const resetForms = () => {
    setShowArticleForm(false);
    setShowVideoForm(false);
    setEditingArticle(null);
    setEditingVideo(null);
  };

  const startCreateArticle = () => {
    setEditingArticle(null);
    setShowArticleForm(true);
    setShowVideoForm(false);
    setActiveTab('articles');
  };

  const startCreateVideo = () => {
    setEditingVideo(null);
    setShowVideoForm(true);
    setShowArticleForm(false);
    setActiveTab('videos');
  };

  const startEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowArticleForm(true);
    setShowVideoForm(false);
    setActiveTab('articles');
  };

  const startEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowVideoForm(true);
    setShowArticleForm(false);
    setActiveTab('videos');
  };

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return 'No title';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || 'No title';
  };

  const filteredArticles = (Array.isArray(articles) ? articles : []).filter(article => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = 
      getDisplayText(article.title).toLowerCase().includes(searchText) ||
      getDisplayText(article.description).toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVideos = (Array.isArray(videos) ? videos : []).filter(video => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = 
      getDisplayText(video.title).toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const safeArticles = Array.isArray(articles) ? articles : [];
  const safeVideos = Array.isArray(videos) ? videos : [];

  const stats = {
    totalArticles: safeArticles.length,
    totalVideos: safeVideos.length,
    totalViews: safeArticles.reduce((sum, article) => sum + (article.views || 0), 0) +
                safeVideos.reduce((sum, video) => sum + (video.views || 0), 0),
    publishedArticles: safeArticles.filter(a => a.status === 'published').length,
    publishedVideos: safeVideos.filter(v => v.status === 'published').length,
    totalDrafts: safeArticles.filter(a => a.status === 'draft').length + 
                 safeVideos.filter(v => v.status === 'draft').length,
    featuredArticles: safeArticles.filter(a => a.isFeatured).length,
    featuredVideos: safeVideos.filter(v => v.isFeatured).length,
    trendingArticles: safeArticles.filter(a => a.isTrending).length,
    trendingVideos: safeVideos.filter(v => v.isTrending).length
  };

  const recentActivity = [
    ...safeArticles.slice(0, 3).map(article => ({
      id: article._id,
      type: 'article' as const,
      title: getDisplayText(article.title),
      status: article.status,
      date: article.updatedAt,
      views: article.views,
      isFeatured: article.isFeatured,
      isTrending: article.isTrending
    })),
    ...safeVideos.slice(0, 2).map(video => ({
      id: video._id,
      type: 'video' as const,
      title: getDisplayText(video.title),
      status: video.status,
      date: video.updatedAt,
      views: video.views,
      isFeatured: video.isFeatured,
      isTrending: video.isTrending
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.dashboard}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t.welcome}, <strong>{currentUser?.username}</strong>
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button
                onClick={startCreateArticle}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.createArticle}
              </Button>
              <Button
                onClick={startCreateVideo}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Video className="h-4 w-4 mr-2" />
                {t.createVideo}
              </Button>
            </div>
          </div>
        </div>
        

        {/* Article Form */}
        {showArticleForm && (
          <ArticleForm
            editingArticle={editingArticle}
            onSave={handleSaveArticle}
            onCancel={resetForms}
            loading={formLoading}
            translations={t}
          />
        )}

        {/* Video Form */}
        {showVideoForm && (
          <VideoForm
            editingVideo={editingVideo}
            onSave={handleSaveVideo}
            onCancel={resetForms}
            loading={formLoading}
            translations={t}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                <p className="text-blue-100 text-sm font-medium">{t.totalArticles}</p>
                <p className="text-xl font-bold">{stats.totalArticles}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Video className="h-6 w-6 mx-auto mb-2 text-green-200" />
                <p className="text-green-100 text-sm font-medium">{t.totalVideos}</p>
                <p className="text-xl font-bold">{stats.totalVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2 text-purple-200" />
                <p className="text-purple-100 text-sm font-medium">{t.totalViews}</p>
                <p className="text-xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-200" />
                <p className="text-yellow-100 text-sm font-medium">{t.featured}</p>
                <p className="text-xl font-bold">{stats.featuredArticles + stats.featuredVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-200" />
                <p className="text-orange-100 text-sm font-medium">{t.trending}</p>
                <p className="text-xl font-bold">{stats.trendingArticles + stats.trendingVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-red-200" />
                <p className="text-red-100 text-sm font-medium">Drafts</p>
                <p className="text-xl font-bold">{stats.totalDrafts}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="published">{t.published}</SelectItem>
              <SelectItem value="draft">{t.drafts}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t.analytics}
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t.articles} ({filteredArticles.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {t.videos} ({filteredVideos.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t.performance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Published Content</span>
                      <span className="font-semibold">{stats.publishedArticles + stats.publishedVideos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Draft Content</span>
                      <span className="font-semibold">{stats.totalDrafts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Views</span>
                      <span className="font-semibold">{stats.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Featured Content</span>
                      <span className="font-semibold">{stats.featuredArticles + stats.featuredVideos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Trending Content</span>
                      <span className="font-semibold">{stats.trendingArticles + stats.trendingVideos}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t.recentActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'article' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                            }`}>
                              {activity.type === 'article' ? (
                                <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <Video className="h-3 w-3 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[150px]">{activity.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {activity.isFeatured && (
                              <Star className="h-3 w-3 text-yellow-500" />
                            )}
                            {activity.isTrending && (
                              <TrendingUp className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your content quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={startCreateArticle}
                    className="h-16 flex-col gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 border-2 border-dashed border-blue-200 dark:border-blue-800"
                    variant="ghost"
                  >
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">{t.createArticle}</span>
                  </Button>
                  <Button 
                    onClick={startCreateVideo}
                    className="h-16 flex-col gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-2 border-dashed border-green-200 dark:border-green-800"
                    variant="ghost"
                  >
                    <Video className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">{t.createVideo}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery || statusFilter !== 'all' ? 'No matching articles found' : t.noArticles}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by creating your first article'
                    }
                  </p>
                  <Button onClick={startCreateArticle}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.createArticle}
                  </Button>
                  {(searchQuery || statusFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="ml-2"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredArticles.map((article) => (
                  <Card key={article._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                              {article.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{article.category}</Badge>
                            {article.isFeatured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                <Star className="h-3 w-3 mr-1" />
                                {t.featured}
                              </Badge>
                            )}
                            {article.isTrending && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {t.trending}
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {getDisplayText(article.title)}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {getDisplayText(article.description)}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article.views || 0} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {article.likes || 0} likes
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {article.readTime || '5 min read'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <div className="flex gap-1 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleFeatured(article._id, 'article', article.isFeatured || false)}
                              className={`flex items-center gap-1 ${
                                article.isFeatured ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''
                              }`}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleTrending(article._id, 'article', article.isTrending || false)}
                              className={`flex items-center gap-1 ${
                                article.isTrending ? 'bg-orange-100 text-orange-800 border-orange-300' : ''
                              }`}
                            >
                              <TrendingUp className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-1 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditArticle(article)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article._id, 'article')}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              {t.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            {filteredVideos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t.noVideos}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first video</p>
                  <Button onClick={startCreateVideo}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.createVideo}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredVideos.map((video) => (
                  <Card key={video._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                              {video.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{video.category}</Badge>
                            <Badge variant="outline">{video.platform}</Badge>
                            {video.isFeatured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                <Star className="h-3 w-3 mr-1" />
                                {t.featured}
                              </Badge>
                            )}
                            {video.isTrending && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {t.trending}
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {getDisplayText(video.title)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {video.views || 0} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4" />
                              {video.platform}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <div className="flex gap-1 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleFeatured(video._id, 'video', video.isFeatured || false)}
                              className={`flex items-center gap-1 ${
                                video.isFeatured ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''
                              }`}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleTrending(video._id, 'video', video.isTrending || false)}
                              className={`flex items-center gap-1 ${
                                video.isTrending ? 'bg-orange-100 text-orange-800 border-orange-300' : ''
                              }`}
                            >
                              <TrendingUp className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-1 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditVideo(video)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(video._id, 'video')}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              {t.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}