var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
var translations = {
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
var API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
// Article Form Component
function ArticleForm(_a) {
    var _b;
    var editingArticle = _a.editingArticle, onSave = _a.onSave, onCancel = _a.onCancel, loading = _a.loading, translations = _a.translations;
    var _c = useState({
        title: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.title) || { en: '', ar: '', ur: '' },
        description: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.description) || { en: '', ar: '', ur: '' },
        content: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.content) || { en: '', ar: '', ur: '' },
        category: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.category) || 'technology',
        imageUrl: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.imageUrl) || '',
        readTime: ((_b = editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.readTime) === null || _b === void 0 ? void 0 : _b.replace(' min read', '')) || '5',
        status: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.status) || 'draft',
        isFeatured: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.isFeatured) || false,
        isTrending: (editingArticle === null || editingArticle === void 0 ? void 0 : editingArticle.isTrending) || false,
    }), formData = _c[0], setFormData = _c[1];
    var handleSubmit = function (status) {
        onSave(__assign(__assign({}, formData), { status: status, readTime: "".concat(formData.readTime, " min read") }));
    };
    return (<Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{editingArticle ? translations.update : translations.create} {translations.createArticle}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4"/>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Article Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleEn} *</label>
              <Input value={formData.title.en || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { en: e.target.value }) })); }); }} placeholder="Enter title in English" className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleAr}</label>
              <Input value={formData.title.ar || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { ar: e.target.value }) })); }); }} placeholder="Enter title in Arabic" className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.titleUr}</label>
              <Input value={formData.title.ur || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { ur: e.target.value }) })); }); }} placeholder="Enter title in Urdu" className="w-full"/>
            </div>
          </div>

          {/* Article Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionEn} *</label>
              <Textarea value={formData.description.en || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: __assign(__assign({}, prev.description), { en: e.target.value }) })); }); }} placeholder="Enter description in English" rows={3} className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionAr}</label>
              <Textarea value={formData.description.ar || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: __assign(__assign({}, prev.description), { ar: e.target.value }) })); }); }} placeholder="Enter description in Arabic" rows={3} className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.descriptionUr}</label>
              <Textarea value={formData.description.ur || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: __assign(__assign({}, prev.description), { ur: e.target.value }) })); }); }} placeholder="Enter description in Urdu" rows={3} className="w-full"/>
            </div>
          </div>

          {/* Article Content Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentEn} *</label>
              <Textarea value={formData.content.en || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { content: __assign(__assign({}, prev.content), { en: e.target.value }) })); }); }} placeholder={translations.articleContent} rows={6} className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentAr}</label>
              <Textarea value={formData.content.ar || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { content: __assign(__assign({}, prev.content), { ar: e.target.value }) })); }); }} placeholder={translations.articleContent} rows={6} className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.contentUr}</label>
              <Textarea value={formData.content.ur || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { content: __assign(__assign({}, prev.content), { ur: e.target.value }) })); }); }} placeholder={translations.articleContent} rows={6} className="w-full"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.category}</label>
              <Select value={formData.category} onValueChange={function (value) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { category: value })); }); }}>
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
              <Input type="number" value={formData.readTime} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { readTime: e.target.value })); }); }} placeholder="5" min="1" max="60"/>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">{translations.imageUrl}</label>
              <Input value={formData.imageUrl} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { imageUrl: e.target.value })); }); }} placeholder="https://example.com/image.jpg"/>
            </div>
          </div>

          {/* Featured & Trending Toggles */}
          <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch checked={formData.isFeatured} onCheckedChange={function (checked) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { isFeatured: checked })); }); }}/>
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500"/>
                {translations.makeFeatured}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={formData.isTrending} onCheckedChange={function (checked) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { isTrending: checked })); }); }}/>
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500"/>
                {translations.makeTrending}
              </Label>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {translations.cancel}
            </Button>
            <Button variant="outline" onClick={function () { return handleSubmit('draft'); }} disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4"/>
              {translations.saveDraft}
            </Button>
            <Button onClick={function () { return handleSubmit('published'); }} disabled={loading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4"/>
              {translations.publish}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
}
// Video Form Component
function VideoForm(_a) {
    var editingVideo = _a.editingVideo, onSave = _a.onSave, onCancel = _a.onCancel, loading = _a.loading, translations = _a.translations;
    var _b = useState({
        title: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.title) || { en: '', ar: '', ur: '' },
        videoUrl: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.videoUrl) || '',
        platform: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.platform) || 'youtube',
        category: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.category) || 'technology',
        thumbnailUrl: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.thumbnailUrl) || '',
        status: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.status) || 'draft',
        isFeatured: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.isFeatured) || false,
        isTrending: (editingVideo === null || editingVideo === void 0 ? void 0 : editingVideo.isTrending) || false,
    }), formData = _b[0], setFormData = _b[1];
    var handleSubmit = function (status) {
        onSave(__assign(__assign({}, formData), { status: status }));
    };
    return (<Card className="mb-8 border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Video className="h-5 w-5"/>
            <span>{editingVideo ? translations.update : translations.create} {translations.createVideo}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4"/>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Video Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleEn} *</label>
              <Input value={formData.title.en || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { en: e.target.value }) })); }); }} placeholder="Enter video title in English" className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleAr}</label>
              <Input value={formData.title.ar || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { ar: e.target.value }) })); }); }} placeholder="Enter video title in Arabic" className="w-full"/>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoTitleUr}</label>
              <Input value={formData.title.ur || ''} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: __assign(__assign({}, prev.title), { ur: e.target.value }) })); }); }} placeholder="Enter video title in Urdu" className="w-full"/>
            </div>
          </div>

          {/* Video URL and Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{translations.videoUrl} *</label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input value={formData.videoUrl} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { videoUrl: e.target.value })); }); }} placeholder="https://youtube.com/watch?v=..." className="w-full pl-10"/>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{translations.platform}</label>
              <Select value={formData.platform} onValueChange={function (value) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { platform: value })); }); }}>
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
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input value={formData.thumbnailUrl} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { thumbnailUrl: e.target.value })); }); }} placeholder="https://example.com/thumbnail.jpg" className="w-full pl-10"/>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{translations.category}</label>
              <Select value={formData.category} onValueChange={function (value) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { category: value })); }); }}>
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
              <Switch checked={formData.isFeatured} onCheckedChange={function (checked) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { isFeatured: checked })); }); }}/>
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500"/>
                {translations.makeFeatured}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={formData.isTrending} onCheckedChange={function (checked) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { isTrending: checked })); }); }}/>
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500"/>
                {translations.makeTrending}
              </Label>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {translations.cancel}
            </Button>
            <Button variant="outline" onClick={function () { return handleSubmit('draft'); }} disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4"/>
              {translations.saveDraft}
            </Button>
            <Button onClick={function () { return handleSubmit('published'); }} disabled={loading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4"/>
              {translations.publish}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
}
export default function Dashboard() {
    var _this = this;
    var language = useLanguage().language;
    var toast = useToast().toast;
    var _a = useAuth(), currentUser = _a.currentUser, getAuthHeaders = _a.getAuthHeaders;
    var t = translations[language];
    var _b = useState('overview'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = useState([]), articles = _c[0], setArticles = _c[1];
    var _d = useState([]), videos = _d[0], setVideos = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(''), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = useState('all'), statusFilter = _g[0], setStatusFilter = _g[1];
    // Form states
    var _h = useState(false), showArticleForm = _h[0], setShowArticleForm = _h[1];
    var _j = useState(false), showVideoForm = _j[0], setShowVideoForm = _j[1];
    var _k = useState(null), editingArticle = _k[0], setEditingArticle = _k[1];
    var _l = useState(null), editingVideo = _l[0], setEditingVideo = _l[1];
    var _m = useState(false), formLoading = _m[0], setFormLoading = _m[1];
    useEffect(function () {
        fetchUserData();
    }, []);
    var fetchUserData = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            fetchUserArticles(),
                            fetchUserVideos()
                        ])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching user data:', error_1);
                    toast({
                        title: t.error,
                        description: 'Failed to load your content',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchUserArticles = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, articlesArray, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/articles/my-articles"), {
                            headers: getAuthHeaders()
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    articlesArray = [];
                    if (Array.isArray(data)) {
                        articlesArray = data;
                    }
                    else if (data && Array.isArray(data.data)) {
                        articlesArray = data.data;
                    }
                    else if (data && Array.isArray(data.articles)) {
                        articlesArray = data.articles;
                    }
                    else if (data && typeof data === 'object') {
                        articlesArray = [data];
                    }
                    setArticles(articlesArray);
                    return [3 /*break*/, 4];
                case 3:
                    setArticles([]);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Failed to fetch articles:', error_2);
                    setArticles([]);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var fetchUserVideos = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, videosArray, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/videos/my-videos"), {
                            headers: getAuthHeaders()
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    videosArray = [];
                    if (Array.isArray(data)) {
                        videosArray = data;
                    }
                    else if (data && Array.isArray(data.data)) {
                        videosArray = data.data;
                    }
                    else if (data && Array.isArray(data.videos)) {
                        videosArray = data.videos;
                    }
                    else if (data && typeof data === 'object') {
                        videosArray = [data];
                    }
                    setVideos(videosArray);
                    return [3 /*break*/, 4];
                case 3:
                    setVideos([]);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Failed to fetch videos:', error_3);
                    setVideos([]);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Article handlers
    var handleSaveArticle = function (articleData) { return __awaiter(_this, void 0, void 0, function () {
        var url, method, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setFormLoading(true);
                    url = editingArticle
                        ? "".concat(API_BASE_URL, "/api/articles/").concat(editingArticle._id)
                        : "".concat(API_BASE_URL, "/api/articles");
                    method = editingArticle ? 'PUT' : 'POST';
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: getAuthHeaders(),
                            body: JSON.stringify(articleData)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (response.ok) {
                        toast({
                            title: articleData.status === 'published' ? t.articlePublished : t.articleSaved,
                            description: editingArticle ? 'Article updated successfully' : "Article ".concat(articleData.status === 'published' ? 'published' : 'saved as draft', " successfully")
                        });
                        resetForms();
                        fetchUserArticles();
                    }
                    else {
                        throw new Error(data.message || t.error);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error('Article error:', error_4);
                    toast({
                        title: t.error,
                        description: error_4.message || 'Failed to save article',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setFormLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Video handlers
    var handleSaveVideo = function (videoData) { return __awaiter(_this, void 0, void 0, function () {
        var url, method, response, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setFormLoading(true);
                    url = editingVideo
                        ? "".concat(API_BASE_URL, "/api/videos/").concat(editingVideo._id)
                        : "".concat(API_BASE_URL, "/api/videos");
                    method = editingVideo ? 'PUT' : 'POST';
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: getAuthHeaders(),
                            body: JSON.stringify(videoData)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (response.ok) {
                        toast({
                            title: videoData.status === 'published' ? t.videoPublished : t.videoSaved,
                            description: editingVideo ? 'Video updated successfully' : "Video ".concat(videoData.status === 'published' ? 'published' : 'saved as draft', " successfully")
                        });
                        resetForms();
                        fetchUserVideos();
                    }
                    else {
                        throw new Error(data.message || t.error);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    console.error('Video error:', error_5);
                    toast({
                        title: t.error,
                        description: error_5.message || 'Failed to save video',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setFormLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (id, type) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm(t.confirmDelete))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/").concat(type, "s/").concat(id), {
                            method: 'DELETE',
                            headers: getAuthHeaders()
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok && data.success) {
                        toast({
                            title: t.deleted,
                            description: "".concat(type.charAt(0).toUpperCase() + type.slice(1), " deleted successfully")
                        });
                        if (type === 'article') {
                            fetchUserArticles();
                        }
                        else {
                            fetchUserVideos();
                        }
                    }
                    else {
                        throw new Error(data.message || 'Failed to delete');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_6 = _a.sent();
                    console.error('Delete error:', error_6);
                    toast({
                        title: t.error,
                        description: 'Failed to delete item',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleFeatured = function (id, type, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var url, updateData, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(API_BASE_URL, "/api/").concat(type, "s/").concat(id);
                    updateData = {
                        isFeatured: !currentStatus
                    };
                    return [4 /*yield*/, fetch(url, {
                            method: 'PUT',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(updateData)
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: 'Success',
                            description: "".concat(type, " ").concat(!currentStatus ? 'marked as featured' : 'removed from featured')
                        });
                        if (type === 'article') {
                            fetchUserArticles();
                        }
                        else {
                            fetchUserVideos();
                        }
                    }
                    else {
                        throw new Error('Failed to update');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error('Toggle featured error:', error_7);
                    toast({
                        title: t.error,
                        description: 'Failed to update featured status',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleTrending = function (id, type, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var url, updateData, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(API_BASE_URL, "/api/").concat(type, "s/").concat(id);
                    updateData = {
                        isTrending: !currentStatus
                    };
                    return [4 /*yield*/, fetch(url, {
                            method: 'PUT',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(updateData)
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        toast({
                            title: 'Success',
                            description: "".concat(type, " ").concat(!currentStatus ? 'marked as trending' : 'removed from trending')
                        });
                        if (type === 'article') {
                            fetchUserArticles();
                        }
                        else {
                            fetchUserVideos();
                        }
                    }
                    else {
                        throw new Error('Failed to update');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error('Toggle trending error:', error_8);
                    toast({
                        title: t.error,
                        description: 'Failed to update trending status',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var resetForms = function () {
        setShowArticleForm(false);
        setShowVideoForm(false);
        setEditingArticle(null);
        setEditingVideo(null);
    };
    var startCreateArticle = function () {
        setEditingArticle(null);
        setShowArticleForm(true);
        setShowVideoForm(false);
        setActiveTab('articles');
    };
    var startCreateVideo = function () {
        setEditingVideo(null);
        setShowVideoForm(true);
        setShowArticleForm(false);
        setActiveTab('videos');
    };
    var startEditArticle = function (article) {
        setEditingArticle(article);
        setShowArticleForm(true);
        setShowVideoForm(false);
        setActiveTab('articles');
    };
    var startEditVideo = function (video) {
        setEditingVideo(video);
        setShowVideoForm(true);
        setShowArticleForm(false);
        setActiveTab('videos');
    };
    var getDisplayText = function (textObject) {
        if (!textObject)
            return 'No title';
        if (typeof textObject === 'string')
            return textObject;
        return textObject[language] || textObject.en || textObject.ar || textObject.ur || 'No title';
    };
    var filteredArticles = (Array.isArray(articles) ? articles : []).filter(function (article) {
        var searchText = searchQuery.toLowerCase();
        var matchesSearch = getDisplayText(article.title).toLowerCase().includes(searchText) ||
            getDisplayText(article.description).toLowerCase().includes(searchText);
        var matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    var filteredVideos = (Array.isArray(videos) ? videos : []).filter(function (video) {
        var searchText = searchQuery.toLowerCase();
        var matchesSearch = getDisplayText(video.title).toLowerCase().includes(searchText);
        var matchesStatus = statusFilter === 'all' || video.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    var safeArticles = Array.isArray(articles) ? articles : [];
    var safeVideos = Array.isArray(videos) ? videos : [];
    var stats = {
        totalArticles: safeArticles.length,
        totalVideos: safeVideos.length,
        totalViews: safeArticles.reduce(function (sum, article) { return sum + (article.views || 0); }, 0) +
            safeVideos.reduce(function (sum, video) { return sum + (video.views || 0); }, 0),
        publishedArticles: safeArticles.filter(function (a) { return a.status === 'published'; }).length,
        publishedVideos: safeVideos.filter(function (v) { return v.status === 'published'; }).length,
        totalDrafts: safeArticles.filter(function (a) { return a.status === 'draft'; }).length +
            safeVideos.filter(function (v) { return v.status === 'draft'; }).length,
        featuredArticles: safeArticles.filter(function (a) { return a.isFeatured; }).length,
        featuredVideos: safeVideos.filter(function (v) { return v.isFeatured; }).length,
        trendingArticles: safeArticles.filter(function (a) { return a.isTrending; }).length,
        trendingVideos: safeVideos.filter(function (v) { return v.isTrending; }).length
    };
    var recentActivity = __spreadArray(__spreadArray([], safeArticles.slice(0, 3).map(function (article) { return ({
        id: article._id,
        type: 'article',
        title: getDisplayText(article.title),
        status: article.status,
        date: article.updatedAt,
        views: article.views,
        isFeatured: article.isFeatured,
        isTrending: article.isTrending
    }); }), true), safeVideos.slice(0, 2).map(function (video) { return ({
        id: video._id,
        type: 'video',
        title: getDisplayText(video.title),
        status: video.status,
        date: video.updatedAt,
        views: video.views,
        isFeatured: video.isFeatured,
        isTrending: video.isTrending
    }); }), true).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })
        .slice(0, 5);
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.dashboard}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t.welcome}, <strong>{currentUser === null || currentUser === void 0 ? void 0 : currentUser.username}</strong>
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button onClick={startCreateArticle} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2"/>
                {t.createArticle}
              </Button>
              <Button onClick={startCreateVideo} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Video className="h-4 w-4 mr-2"/>
                {t.createVideo}
              </Button>
            </div>
          </div>
        </div>

        {/* Article Form */}
        {showArticleForm && (<ArticleForm editingArticle={editingArticle} onSave={handleSaveArticle} onCancel={resetForms} loading={formLoading} translations={t}/>)}

        {/* Video Form */}
        {showVideoForm && (<VideoForm editingVideo={editingVideo} onSave={handleSaveVideo} onCancel={resetForms} loading={formLoading} translations={t}/>)}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-200"/>
                <p className="text-blue-100 text-sm font-medium">{t.totalArticles}</p>
                <p className="text-xl font-bold">{stats.totalArticles}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Video className="h-6 w-6 mx-auto mb-2 text-green-200"/>
                <p className="text-green-100 text-sm font-medium">{t.totalVideos}</p>
                <p className="text-xl font-bold">{stats.totalVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2 text-purple-200"/>
                <p className="text-purple-100 text-sm font-medium">{t.totalViews}</p>
                <p className="text-xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-200"/>
                <p className="text-yellow-100 text-sm font-medium">{t.featured}</p>
                <p className="text-xl font-bold">{stats.featuredArticles + stats.featuredVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-200"/>
                <p className="text-orange-100 text-sm font-medium">{t.trending}</p>
                <p className="text-xl font-bold">{stats.trendingArticles + stats.trendingVideos}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-red-200"/>
                <p className="text-red-100 text-sm font-medium">Drafts</p>
                <p className="text-xl font-bold">{stats.totalDrafts}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <Input placeholder={t.search} value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10"/>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2"/>
              <SelectValue placeholder={t.filterByStatus}/>
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
              <TrendingUp className="h-4 w-4"/>
              {t.analytics}
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4"/>
              {t.articles} ({filteredArticles.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4"/>
              {t.videos} ({filteredVideos.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5"/>
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
                    <Calendar className="h-5 w-5"/>
                    {t.recentActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.length === 0 ? (<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>) : (recentActivity.map(function (activity) { return (<div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <div className={"p-2 rounded-full ".concat(activity.type === 'article' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900')}>
                              {activity.type === 'article' ? (<FileText className="h-3 w-3 text-blue-600 dark:text-blue-400"/>) : (<Video className="h-3 w-3 text-green-600 dark:text-green-400"/>)}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[150px]">{activity.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {activity.isFeatured && (<Star className="h-3 w-3 text-yellow-500"/>)}
                            {activity.isTrending && (<TrendingUp className="h-3 w-3 text-orange-500"/>)}
                          </div>
                        </div>); }))}
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
                  <Button onClick={startCreateArticle} className="h-16 flex-col gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 border-2 border-dashed border-blue-200 dark:border-blue-800" variant="ghost">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                    <span className="text-blue-700 dark:text-blue-300">{t.createArticle}</span>
                  </Button>
                  <Button onClick={startCreateVideo} className="h-16 flex-col gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-2 border-dashed border-green-200 dark:border-green-800" variant="ghost">
                    <Video className="h-5 w-5 text-green-600 dark:text-green-400"/>
                    <span className="text-green-700 dark:text-green-300">{t.createVideo}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            {filteredArticles.length === 0 ? (<Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t.noArticles}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first article</p>
                  <Button onClick={startCreateArticle}>
                    <Plus className="h-4 w-4 mr-2"/>
                    {t.createArticle}
                  </Button>
                </CardContent>
              </Card>) : (<div className="grid grid-cols-1 gap-4">
                {filteredArticles.map(function (article) { return (<Card key={article._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                              {article.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{article.category}</Badge>
                            {article.isFeatured && (<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                <Star className="h-3 w-3 mr-1"/>
                                {t.featured}
                              </Badge>)}
                            {article.isTrending && (<Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                <TrendingUp className="h-3 w-3 mr-1"/>
                                {t.trending}
                              </Badge>)}
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
                              <Eye className="h-4 w-4"/>
                              {article.views || 0} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4"/>
                              {article.likes || 0} likes
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4"/>
                              {article.readTime || '5 min read'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <div className="flex gap-1 sm:flex-col">
                            <Button variant="outline" size="sm" onClick={function () { return handleToggleFeatured(article._id, 'article', article.isFeatured || false); }} className={"flex items-center gap-1 ".concat(article.isFeatured ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : '')}>
                              <Star className="h-3 w-3"/>
                            </Button>
                            <Button variant="outline" size="sm" onClick={function () { return handleToggleTrending(article._id, 'article', article.isTrending || false); }} className={"flex items-center gap-1 ".concat(article.isTrending ? 'bg-orange-100 text-orange-800 border-orange-300' : '')}>
                              <TrendingUp className="h-3 w-3"/>
                            </Button>
                          </div>
                          <div className="flex gap-1 sm:flex-col">
                            <Button variant="outline" size="sm" onClick={function () { return startEditArticle(article); }} className="flex items-center gap-1">
                              <Edit className="h-3 w-3"/>
                              {t.edit}
                            </Button>
                            <Button variant="outline" size="sm" onClick={function () { return handleDelete(article._id, 'article'); }} className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-3 w-3"/>
                              {t.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>); })}
              </div>)}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            {filteredVideos.length === 0 ? (<Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t.noVideos}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first video</p>
                  <Button onClick={startCreateVideo}>
                    <Plus className="h-4 w-4 mr-2"/>
                    {t.createVideo}
                  </Button>
                </CardContent>
              </Card>) : (<div className="grid grid-cols-1 gap-4">
                {filteredVideos.map(function (video) { return (<Card key={video._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                              {video.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{video.category}</Badge>
                            <Badge variant="outline">{video.platform}</Badge>
                            {video.isFeatured && (<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                <Star className="h-3 w-3 mr-1"/>
                                {t.featured}
                              </Badge>)}
                            {video.isTrending && (<Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                <TrendingUp className="h-3 w-3 mr-1"/>
                                {t.trending}
                              </Badge>)}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {getDisplayText(video.title)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4"/>
                              {video.views || 0} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4"/>
                              {video.platform}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <div className="flex gap-1 sm:flex-col">
                            <Button variant="outline" size="sm" onClick={function () { return handleToggleFeatured(video._id, 'video', video.isFeatured || false); }} className={"flex items-center gap-1 ".concat(video.isFeatured ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : '')}>
                              <Star className="h-3 w-3"/>
                            </Button>
                            <Button variant="outline" size="sm" onClick={function () { return handleToggleTrending(video._id, 'video', video.isTrending || false); }} className={"flex items-center gap-1 ".concat(video.isTrending ? 'bg-orange-100 text-orange-800 border-orange-300' : '')}>
                              <TrendingUp className="h-3 w-3"/>
                            </Button>
                          </div>
                          <div className="flex gap-1 sm:flex-col">
                            <Button variant="outline" size="sm" onClick={function () { return startEditVideo(video); }} className="flex items-center gap-1">
                              <Edit className="h-3 w-3"/>
                              {t.edit}
                            </Button>
                            <Button variant="outline" size="sm" onClick={function () { return handleDelete(video._id, 'video'); }} className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-3 w-3"/>
                              {t.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>); })}
              </div>)}
          </TabsContent>
        </Tabs>
      </div>
    </div>);
}
