import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleForm } from '@/components/ArticleForm';
import { VideoForm } from '@/components/VideoForm';
import { Plus, Edit, Trash2, Eye, Video, FileText, Calendar, Users, TrendingUp, Star, Search, Filter } from 'lucide-react';

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

  // Debug authentication
  useEffect(() => {
    console.log('🔐 AUTH DEBUG:', {
      currentUser,
      hasToken: !!localStorage.getItem('token'),
      token: localStorage.getItem('token'),
      authHeaders: getAuthHeaders()
    });
  }, [currentUser]);

  useEffect(() => {
    console.log('🏠 Dashboard mounted - checking auth...');
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    
    if (!currentUser && token) {
      console.log('⚠️ Token exists but currentUser is null - waiting for auth context...');
    }
    
    // Wait for auth context to load
    const timer = setTimeout(() => {
      console.log('🔄 Starting data fetch after auth load...');
      fetchUserData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Refetch when currentUser changes
  useEffect(() => {
    if (currentUser) {
      console.log('👤 Current user loaded, refetching data...', currentUser);
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching user data...');
      
      // Check if user is authenticated
      if (!currentUser) {
        console.log('❌ User not authenticated, skipping data fetch');
        setArticles([]);
        setVideos([]);
        setLoading(false);
        return;
      }

      console.log('👤 Current User:', currentUser);
      console.log('🔑 Auth Headers:', getAuthHeaders());
      
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
      console.log('🔍 Fetching user articles...');
      
      // Check if user is authenticated
      if (!currentUser) {
        console.log('❌ User not authenticated, skipping articles fetch');
        setArticles([]);
        return;
      }

      console.log('👤 Current User:', currentUser);
      
      // Use fallback approach since /api/articles/my-articles returns 404
      console.log('🔄 Using fallback: fetch all articles and filter by user');
      await fetchAllArticlesAndFilter();

    } catch (error) {
      console.error('❌ Error fetching user articles:', error);
      // Try alternative approach
      await fetchAllArticlesAndFilter();
    }
  };

  // Fallback approach: fetch all articles and filter by user
  const fetchAllArticlesAndFilter = async () => {
    try {
      console.log('🔄 Fetching all articles to filter for user...');
      
      const response = await fetch(`${API_BASE_URL}/api/articles`);
      
      if (response.ok) {
        const allArticles = await response.json();
        console.log('📝 All articles from API:', allArticles);
        
        if (!currentUser) {
          console.log('❌ No current user for filtering');
          setArticles([]);
          return;
        }
        
        // Filter articles for current user
        const userArticles = allArticles.filter((article: any) => {
          const matchesUser = article.createdBy === currentUser.id || 
                             article.createdByUsername === currentUser.username;
          console.log(`🔍 Article ${article._id}: createdBy=${article.createdBy}, username=${article.createdByUsername}, matches=${matchesUser}`);
          return matchesUser;
        });
        
        console.log(`👤 Filtered ${userArticles.length} articles for user ${currentUser.username}`);
        setArticles(userArticles);
      } else {
        console.error('❌ Failed to fetch all articles');
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Alternative approach failed:', error);
      setArticles([]);
    }
  };

  const fetchUserVideos = async () => {
    try {
      console.log('🎬 Fetching user videos...');
      
      // Check if user is authenticated
      if (!currentUser) {
        console.log('❌ User not authenticated, skipping videos fetch');
        setVideos([]);
        return;
      }

      const headers = getAuthHeaders();
      console.log('🔑 Auth Headers for videos:', headers);

      const response = await fetch(`${API_BASE_URL}/api/videos/my-videos`, {
        headers: headers
      });

      console.log('📊 Videos response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User videos response:', data);
        
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
        
        console.log(`🎥 Loaded ${videosArray.length} user videos`);
        setVideos(videosArray);
      } else {
        console.error('❌ Failed to fetch user videos. Status:', response.status);
        if (response.status === 401) {
          console.log('🔐 Authentication failed for videos');
        }
        setVideos([]);
      }
    } catch (error) {
      console.error('❌ Network error fetching videos:', error);
      setVideos([]);
    }
  };

// Article handlers - ADD THIS FUNCTION TO YOUR DASHBOARD
const handleSaveArticle = async (articleData: any) => {
  try {
    setFormLoading(true);
    
    // Check authentication
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save articles',
        variant: 'destructive'
      });
      return;
    }

    // Check if editingArticle exists and has _id
    const isEditing = editingArticle && editingArticle._id;
    const url = isEditing 
      ? `${API_BASE_URL}/api/articles/${editingArticle._id}`
      : `${API_BASE_URL}/api/articles`;

    const method = isEditing ? 'PUT' : 'POST';

    console.log('💾 ===== SAVING ARTICLE =====');
    console.log('🌐 URL:', url);
    console.log('🔧 Method:', method);
    console.log('👤 User:', currentUser.username);
    console.log('📋 Article Status:', articleData.status);
    console.log('📝 Article Data:', {
      title: articleData.title?.en,
      description: articleData.description?.en?.substring(0, 50) + '...',
      content: articleData.content?.en?.substring(0, 50) + '...',
      category: articleData.category,
      status: articleData.status,
      isFeatured: articleData.isFeatured,
      isTrending: articleData.isTrending
    });

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(articleData)
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response OK:', response.ok);

    const data = await response.json();
    console.log('📨 Save article response:', data);

    if (response.ok) {
      console.log('✅ Article saved successfully!');
      toast({
        title: articleData.status === 'published' ? t.articlePublished : t.articleSaved,
        description: isEditing ? 'Article updated successfully' : `Article ${articleData.status === 'published' ? 'published' : 'saved as draft'} successfully`
      });
      resetForms();
      
      // Handle update vs create differently
      if (isEditing) {
        // For updates, update the local state directly
        console.log('🔄 Updating article locally');
        if (data.article) {
          setArticles(prev => prev.map(article => 
            article._id === editingArticle._id ? data.article : article
          ));
        } else {
          // If no article in response, refetch
          console.log('🔄 No article in update response, refetching...');
          fetchUserArticles();
        }
      } else {
        // For new articles, add to local state
        console.log('🔄 Adding new article locally');
        if (data.article) {
          setArticles(prev => [data.article, ...prev]);
        } else {
          // If no article in response, refetch
          console.log('🔄 No article in create response, refetching...');
          fetchUserArticles();
        }
      }
    } else {
      console.log('❌ Save failed with response:', data);
      throw new Error(data.message || t.error);
    }
  } catch (error: any) {
    console.error('❌ Article save error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack
    });
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
      
      // Check authentication
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to save videos',
          variant: 'destructive'
        });
        return;
      }

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
      // Check authentication
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to delete content',
          variant: 'destructive'
        });
        return;
      }

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
      // Check authentication
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to update content',
          variant: 'destructive'
        });
        return;
      }

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
      // Check authentication
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to update content',
          variant: 'destructive'
        });
        return;
      }

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
                {t.welcome}, <strong>{currentUser?.username || 'User'}</strong>
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button
                onClick={startCreateArticle}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!currentUser}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.createArticle}
              </Button>
              <Button
                onClick={startCreateVideo}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
                disabled={!currentUser}
              >
                <Video className="h-4 w-4 mr-2" />
                {t.createVideo}
              </Button>
            </div>
          </div>
        </div>

        {/* Authentication Warning */}
        {!currentUser && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-yellow-600 dark:text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Authentication Required
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Please log in to view and manage your content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        {!currentUser ? 'Please log in to see your activity' : 'No recent activity'}
                      </p>
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
                    disabled={!currentUser}
                  >
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">{t.createArticle}</span>
                  </Button>
                  <Button 
                    onClick={startCreateVideo}
                    className="h-16 flex-col gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-2 border-dashed border-green-200 dark:border-green-800"
                    variant="ghost"
                    disabled={!currentUser}
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
                    {!currentUser 
                      ? 'Please log in to view your articles'
                      : searchQuery || statusFilter !== 'all' 
                        ? 'No matching articles found' 
                        : t.noArticles
                    }
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {!currentUser
                      ? 'Log in to create and manage your articles'
                      : searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Get started by creating your first article'
                    }
                  </p>
                  {currentUser ? (
                    <>
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
                    </>
                  ) : (
                    <Button onClick={() => window.location.href = '/login'}>
                      Log In
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
                              disabled={!currentUser}
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
                              disabled={!currentUser}
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
                              disabled={!currentUser}
                            >
                              <Edit className="h-3 w-3" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article._id, 'article')}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={!currentUser}
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {!currentUser 
                      ? 'Please log in to view your videos'
                      : t.noVideos
                    }
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {!currentUser
                      ? 'Log in to create and manage your videos'
                      : 'Get started by creating your first video'
                    }
                  </p>
                  {currentUser ? (
                    <Button onClick={startCreateVideo}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.createVideo}
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.href = '/login'}>
                      Log In
                    </Button>
                  )}
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
                              disabled={!currentUser}
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
                              disabled={!currentUser}
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
                              disabled={!currentUser}
                            >
                              <Edit className="h-3 w-3" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(video._id, 'video')}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={!currentUser}
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