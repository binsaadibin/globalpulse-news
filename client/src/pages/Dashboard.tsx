import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Video, User, Trash2, Edit, Plus, Eye, X } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Article {
  _id: string;
  title: { en: string; ar: string; ur: string };
  description: { en: string; ar: string; ur: string };
  category: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  createdByUsername?: string;
}

interface Video {
  _id: string;
  title: { en: string; ar: string; ur: string };
  description: { en: string; ar: string; ur: string };
  platform: string;
  videoUrl: string;
  status: string;
  createdAt: string;
  createdByUsername?: string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    addArticle: 'Add Article',
    addVideo: 'Add Video',
    myArticles: 'My Articles',
    myVideos: 'My Videos',
    titleEn: 'Title (English)',
    titleAr: 'Title (Arabic)',
    titleUr: 'Title (Urdu)',
    descEn: 'Description (English)',
    descAr: 'Description (Arabic)',
    descUr: 'Description (Urdu)',
    category: 'Category',
    imageUrl: 'Image URL',
    videoUrl: 'Video URL',
    platform: 'Platform',
    publish: 'Publish',
    saveDraft: 'Save as Draft',
    success: 'Published successfully!',
    loggedInAs: 'Logged in as',
    status: 'Status',
    actions: 'Actions',
    published: 'Published',
    draft: 'Draft',
    delete: 'Delete',
    edit: 'Edit',
    noArticles: 'No articles yet',
    noVideos: 'No videos yet',
    deleteSuccess: 'Deleted successfully!',
    deleteError: 'Failed to delete',
    confirmDelete: 'Are you sure you want to delete this?',
    view: 'View',
    content: 'Content',
    technology: 'Technology',
    business: 'Business',
    sports: 'Sports',
    politics: 'Politics',
    environment: 'Environment',
    health: 'Health',
    youtube: 'YouTube',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    updateSuccess: 'Updated successfully!'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    addArticle: 'إضافة مقال',
    addVideo: 'إضافة فيديو',
    myArticles: 'مقالاتي',
    myVideos: 'فيديوهاتي',
    titleEn: 'العنوان (إنجليزي)',
    titleAr: 'العنوان (عربي)',
    titleUr: 'العنوان (أردو)',
    descEn: 'الوصف (إنجليزي)',
    descAr: 'الوصف (عربي)',
    descUr: 'الوصف (أردو)',
    category: 'الفئة',
    imageUrl: 'رابط الصورة',
    videoUrl: 'رابط الفيديو',
    platform: 'المنصة',
    publish: 'نشر',
    saveDraft: 'حفظ كمسودة',
    success: 'تم النشر بنجاح!',
    loggedInAs: 'مسجل الدخول كـ',
    status: 'الحالة',
    actions: 'الإجراءات',
    published: 'منشور',
    draft: 'مسودة',
    delete: 'حذف',
    edit: 'تعديل',
    noArticles: 'لا توجد مقالات بعد',
    noVideos: 'لا توجد فيديوهات بعد',
    deleteSuccess: 'تم الحذف بنجاح!',
    deleteError: 'فشل في الحذف',
    confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا؟',
    view: 'عرض',
    content: 'المحتوى',
    technology: 'تكنولوجيا',
    business: 'أعمال',
    sports: 'رياضة',
    politics: 'سياسة',
    environment: 'بيئة',
    health: 'صحة',
    youtube: 'يوتيوب',
    facebook: 'فيسبوك',
    tiktok: 'تيك توك',
    instagram: 'إنستغرام',
    save: 'حفظ',
    cancel: 'إلغاء',
    update: 'تحديث',
    updateSuccess: 'تم التحديث بنجاح!'
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    addArticle: 'مضمون شامل کریں',
    addVideo: 'ویڈیو شامل کریں',
    myArticles: 'میرے مضامین',
    myVideos: 'میری ویڈیوز',
    titleEn: 'عنوان (انگریزی)',
    titleAr: 'عنوان (عربی)',
    titleUr: 'عنوان (اردو)',
    descEn: 'تفصیل (انگریزی)',
    descAr: 'تفصیل (عربی)',
    descUr: 'تفصیل (اردو)',
    category: 'زمرہ',
    imageUrl: 'تصویر کا لنک',
    videoUrl: 'ویڈیو لنک',
    platform: 'پلیٹ فارم',
    publish: 'شائع کریں',
    saveDraft: 'مسودے کے طور پر محفوظ کریں',
    success: 'کامیابی سے شائع ہوگیا!',
    loggedInAs: 'کے طور پر لاگ ان ہیں',
    status: 'حالت',
    actions: 'اعمال',
    published: 'شائع شدہ',
    draft: 'مسودہ',
    delete: 'حذف کریں',
    edit: 'ترمیم کریں',
    noArticles: 'ابھی تک کوئی مضمون نہیں',
    noVideos: 'ابھی تک کوئی ویڈیو نہیں',
    deleteSuccess: 'کامیابی سے حذف ہوگیا!',
    deleteError: 'حذف کرنے میں ناکام',
    confirmDelete: 'کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟',
    view: 'دیکھیں',
    content: 'مواد',
    technology: 'ٹیکنالوجی',
    business: 'کاروبار',
    sports: 'کھیل',
    politics: 'سیاست',
    environment: 'ماحول',
    health: 'صحت',
    youtube: 'یوٹیوب',
    facebook: 'فیس بک',
    tiktok: 'ٹک ٹاک',
    instagram: 'انسٹاگرام',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    update: 'اپ ڈیٹ کریں',
    updateSuccess: 'کامیابی سے اپ ڈیٹ ہوگیا!'
  },
};

function DashboardContent() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const t = translations[language];
  const { toast } = useToast();

  const [articleForm, setArticleForm] = useState({
    title: { en: '', ar: '', ur: '' },
    description: { en: '', ar: '', ur: '' },
    category: '',
    imageUrl: '',
  });

  const [videoForm, setVideoForm] = useState({
    title: { en: '', ar: '', ur: '' },
    description: { en: '', ar: '', ur: '' },
    platform: '',
    videoUrl: '',
  });

  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState('add-article');

  useEffect(() => {
    if (currentUser) {
      fetchUserArticles();
      fetchUserVideos();
    }
  }, [currentUser]);

  // Switch to appropriate tab when editing
  useEffect(() => {
    if (editingArticle) {
      setActiveTab('add-article');
    }
  }, [editingArticle]);

  useEffect(() => {
    if (editingVideo) {
      setActiveTab('add-video');
    }
  }, [editingVideo]);

  const fetchUserArticles = async () => {
    try {
      console.log('🔄 Fetching user articles...');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/articles/my-articles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const articles = await response.json();
        console.log('📰 Received articles:', articles);
        setUserArticles(articles);
      } else {
        console.error('❌ Failed to fetch articles:', response.status);
        toast({
          title: 'Error',
          description: 'Failed to fetch articles',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch articles',
        variant: 'destructive',
      });
    }
  };

  const fetchUserVideos = async () => {
    try {
      console.log('🔄 Fetching user videos...');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/videos/my-videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const videos = await response.json();
        console.log('🎬 Received videos:', videos);
        setUserVideos(videos);
      } else {
        console.error('❌ Failed to fetch videos:', response.status);
        toast({
          title: 'Error',
          description: 'Failed to fetch videos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch videos',
        variant: 'destructive',
      });
    }
  };

  const handlePublishArticle = async () => {
    if (!articleForm.title.en || !articleForm.category) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields (Title in English and Category)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingArticle 
        ? `http://localhost:5000/api/articles/${editingArticle._id}`
        : 'http://localhost:5000/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...articleForm,
          status: 'published'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: editingArticle ? t.updateSuccess : t.success,
          description: result.message || (editingArticle ? 'Article updated successfully' : 'Article published successfully'),
        });
        resetArticleForm();
        fetchUserArticles();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save article');
      }
    } catch (error: any) {
      console.error('❌ Article error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishVideo = async () => {
    if (!videoForm.title.en || !videoForm.platform || !videoForm.videoUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields (Title in English, Platform, and Video URL)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingVideo 
        ? `http://localhost:5000/api/videos/${editingVideo._id}`
        : 'http://localhost:5000/api/videos';
      
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...videoForm,
          status: 'published'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: editingVideo ? t.updateSuccess : t.success,
          description: result.message || (editingVideo ? 'Video updated successfully' : 'Video published successfully'),
        });
        resetVideoForm();
        fetchUserVideos();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save video');
      }
    } catch (error: any) {
      console.error('❌ Video error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save video',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (type: 'article' | 'video') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (type === 'article') {
        if (!articleForm.title.en || !articleForm.category) {
          toast({
            title: 'Error',
            description: 'Please fill in required fields',
            variant: 'destructive',
          });
          return;
        }

        const url = editingArticle 
          ? `http://localhost:5000/api/articles/${editingArticle._id}`
          : 'http://localhost:5000/api/articles';
        
        const method = editingArticle ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...articleForm,
            status: 'draft'
          }),
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: 'Saved',
            description: result.message || (editingArticle ? 'Article draft updated' : 'Article saved as draft'),
          });
          resetArticleForm();
          fetchUserArticles();
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to save article');
        }
      } else {
        if (!videoForm.title.en || !videoForm.platform || !videoForm.videoUrl) {
          toast({
            title: 'Error',
            description: 'Please fill in required fields',
            variant: 'destructive',
          });
          return;
        }

        const url = editingVideo 
          ? `http://localhost:5000/api/videos/${editingVideo._id}`
          : 'http://localhost:5000/api/videos';
        
        const method = editingVideo ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...videoForm,
            status: 'draft'
          }),
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: 'Saved',
            description: result.message || (editingVideo ? 'Video draft updated' : 'Video saved as draft'),
          });
          resetVideoForm();
          fetchUserVideos();
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to save video');
        }
      }
    } catch (error: any) {
      console.error('❌ Draft save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save draft',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'article' | 'video', id: string) => {
    if (!confirm(t.confirmDelete)) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const url = type === 'article' 
        ? `http://localhost:5000/api/articles/${id}`
        : `http://localhost:5000/api/videos/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: t.deleteSuccess,
          description: result.message || `${type === 'article' ? 'Article' : 'Video'} deleted successfully`,
        });
        // Remove from local state
        if (type === 'article') {
          setUserArticles(prev => prev.filter(article => article._id !== id));
          if (editingArticle?._id === id) {
            resetArticleForm();
          }
        } else {
          setUserVideos(prev => prev.filter(video => video._id !== id));
          if (editingVideo?._id === id) {
            resetVideoForm();
          }
        }
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to delete ${type}`);
      }
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      toast({
        title: t.deleteError,
        description: error.message || `Failed to delete ${type}`,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditArticle = (article: Article) => {
    console.log('✏️ Editing article:', article);
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      description: article.description,
      category: article.category,
      imageUrl: article.imageUrl,
    });
    setActiveTab('add-article');
  };

  const handleEditVideo = (video: Video) => {
    console.log('✏️ Editing video:', video);
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      platform: video.platform,
      videoUrl: video.videoUrl,
    });
    setActiveTab('add-video');
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArticleForm({
      title: { en: '', ar: '', ur: '' },
      description: { en: '', ar: '', ur: '' },
      category: '',
      imageUrl: '',
    });
  };

  const resetVideoForm = () => {
    setEditingVideo(null);
    setVideoForm({
      title: { en: '', ar: '', ur: '' },
      description: { en: '', ar: '', ur: '' },
      platform: '',
      videoUrl: '',
    });
  };

  const handleCancelEdit = (type: 'article' | 'video') => {
    if (type === 'article') {
      resetArticleForm();
    } else {
      resetVideoForm();
    }
  };

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      technology: t.technology,
      business: t.business,
      sports: t.sports,
      politics: t.politics,
      environment: t.environment,
      health: t.health
    };
    return categoryMap[cat] || cat;
  };

  const formatPlatform = (platform: string) => {
    const platformMap: { [key: string]: string } = {
      youtube: t.youtube,
      facebook: t.facebook,
      tiktok: t.tiktok,
      instagram: t.instagram
    };
    return platformMap[platform] || platform;
  };

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || t.content;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.dashboard}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t.loggedInAs} <span className="font-semibold">{currentUser?.username}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                <span>{userArticles.length} {t.myArticles.toLowerCase()}</span>
                <Video className="h-3 w-3 ml-2" />
                <span>{userVideos.length} {t.myVideos.toLowerCase()}</span>
              </div>
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-xl border">
            <TabsTrigger value="add-article" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{editingArticle ? t.edit : t.addArticle}</span>
            </TabsTrigger>
            <TabsTrigger value="add-video" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{editingVideo ? t.edit : t.addVideo}</span>
            </TabsTrigger>
            <TabsTrigger value="my-articles" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t.myArticles}</span>
            </TabsTrigger>
            <TabsTrigger value="my-videos" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">{t.myVideos}</span>
            </TabsTrigger>
          </TabsList>

          {/* Add Article Tab */}
          <TabsContent value="add-article">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {editingArticle ? t.edit : t.addArticle}
                </CardTitle>
                <CardDescription>
                  {editingArticle ? 'Edit your article' : 'Create a multilingual news article'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="title-en" className="text-sm font-medium">{t.titleEn} *</Label>
                    <Input
                      id="title-en"
                      value={articleForm.title.en}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        title: { ...articleForm.title, en: e.target.value }
                      })}
                      placeholder="Enter English title"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title-ar" className="text-sm font-medium">{t.titleAr}</Label>
                    <Input
                      id="title-ar"
                      value={articleForm.title.ar}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        title: { ...articleForm.title, ar: e.target.value }
                      })}
                      placeholder="أدخل العنوان العربي"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title-ur" className="text-sm font-medium">{t.titleUr}</Label>
                    <Input
                      id="title-ur"
                      value={articleForm.title.ur}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        title: { ...articleForm.title, ur: e.target.value }
                      })}
                      placeholder="اردو عنوان درج کریں"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="desc-en" className="text-sm font-medium">{t.descEn}</Label>
                    <Textarea
                      id="desc-en"
                      value={articleForm.description.en}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        description: { ...articleForm.description, en: e.target.value }
                      })}
                      rows={3}
                      placeholder="Enter English description"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc-ar" className="text-sm font-medium">{t.descAr}</Label>
                    <Textarea
                      id="desc-ar"
                      value={articleForm.description.ar}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        description: { ...articleForm.description, ar: e.target.value }
                      })}
                      rows={3}
                      placeholder="أدخل الوصف العربي"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc-ur" className="text-sm font-medium">{t.descUr}</Label>
                    <Textarea
                      id="desc-ur"
                      value={articleForm.description.ur}
                      onChange={(e) => setArticleForm({
                        ...articleForm,
                        description: { ...articleForm.description, ur: e.target.value }
                      })}
                      rows={3}
                      placeholder="اردو تفصیل درج کریں"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">{t.category} *</Label>
                    <Select
                      value={articleForm.category}
                      onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}
                    >
                      <SelectTrigger id="category" className="bg-white dark:bg-gray-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">{t.technology}</SelectItem>
                        <SelectItem value="business">{t.business}</SelectItem>
                        <SelectItem value="sports">{t.sports}</SelectItem>
                        <SelectItem value="politics">{t.politics}</SelectItem>
                        <SelectItem value="environment">{t.environment}</SelectItem>
                        <SelectItem value="health">{t.health}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-sm font-medium">{t.imageUrl}</Label>
                    <Input
                      id="image-url"
                      value={articleForm.imageUrl}
                      onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={handlePublishArticle} 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex-1"
                  >
                    {loading ? (editingArticle ? 'Updating...' : 'Publishing...') : (editingArticle ? t.update : t.publish)}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveDraft('article')}
                    disabled={loading}
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {loading ? 'Saving...' : t.saveDraft}
                  </Button>
                  {editingArticle && (
                    <Button 
                      variant="outline"
                      onClick={() => handleCancelEdit('article')}
                      disabled={loading}
                      className="flex-1 border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t.cancel}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Video Tab */}
          <TabsContent value="add-video">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  {editingVideo ? t.edit : t.addVideo}
                </CardTitle>
                <CardDescription>
                  {editingVideo ? 'Edit your video' : 'Add a video from various platforms'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="video-title-en" className="text-sm font-medium">{t.titleEn} *</Label>
                    <Input
                      id="video-title-en"
                      value={videoForm.title.en}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        title: { ...videoForm.title, en: e.target.value }
                      })}
                      placeholder="Enter English title"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-title-ar" className="text-sm font-medium">{t.titleAr}</Label>
                    <Input
                      id="video-title-ar"
                      value={videoForm.title.ar}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        title: { ...videoForm.title, ar: e.target.value }
                      })}
                      placeholder="أدخل العنوان العربي"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-title-ur" className="text-sm font-medium">{t.titleUr}</Label>
                    <Input
                      id="video-title-ur"
                      value={videoForm.title.ur}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        title: { ...videoForm.title, ur: e.target.value }
                      })}
                      placeholder="اردو عنوان درج کریں"
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="video-desc-en" className="text-sm font-medium">{t.descEn}</Label>
                    <Textarea
                      id="video-desc-en"
                      value={videoForm.description.en}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        description: { ...videoForm.description, en: e.target.value }
                      })}
                      rows={2}
                      placeholder="Enter English description"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-desc-ar" className="text-sm font-medium">{t.descAr}</Label>
                    <Textarea
                      id="video-desc-ar"
                      value={videoForm.description.ar}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        description: { ...videoForm.description, ar: e.target.value }
                      })}
                      rows={2}
                      placeholder="أدخل الوصف العربي"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-desc-ur" className="text-sm font-medium">{t.descUr}</Label>
                    <Textarea
                      id="video-desc-ur"
                      value={videoForm.description.ur}
                      onChange={(e) => setVideoForm({
                        ...videoForm,
                        description: { ...videoForm.description, ur: e.target.value }
                      })}
                      rows={2}
                      placeholder="اردو تفصیل درج کریں"
                      className="bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform" className="text-sm font-medium">{t.platform} *</Label>
                    <Select
                      value={videoForm.platform}
                      onValueChange={(value) => setVideoForm({ ...videoForm, platform: value })}
                    >
                      <SelectTrigger id="platform" className="bg-white dark:bg-gray-700">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">{t.youtube}</SelectItem>
                        <SelectItem value="facebook">{t.facebook}</SelectItem>
                        <SelectItem value="tiktok">{t.tiktok}</SelectItem>
                        <SelectItem value="instagram">{t.instagram}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-url" className="text-sm font-medium">{t.videoUrl} *</Label>
                    <Input
                      id="video-url"
                      value={videoForm.videoUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={handlePublishVideo} 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex-1"
                  >
                    {loading ? (editingVideo ? 'Updating...' : 'Publishing...') : (editingVideo ? t.update : t.publish)}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveDraft('video')}
                    disabled={loading}
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {loading ? 'Saving...' : t.saveDraft}
                  </Button>
                  {editingVideo && (
                    <Button 
                      variant="outline"
                      onClick={() => handleCancelEdit('video')}
                      disabled={loading}
                      className="flex-1 border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t.cancel}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Articles Tab */}
          <TabsContent value="my-articles">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {t.myArticles}
                </CardTitle>
                <CardDescription>
                  Manage your published articles and drafts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noArticles}</p>
                    <Button 
                      onClick={() => setActiveTab('add-article')}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addArticle}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userArticles.map((article) => (
                      <div
                        key={article._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">
                              {getDisplayText(article.title)}
                            </h3>
                            <Badge 
                              variant={article.status === 'published' ? 'default' : 'secondary'}
                              className={article.status === 'published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }
                            >
                              {article.status === 'published' ? t.published : t.draft}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                            {getDisplayText(article.description)}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                              {formatCategory(article.category)}
                            </span>
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:pl-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                            className="h-8 w-8 p-0"
                            title={t.edit}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/article/${article._id}`, '_blank')}
                            className="h-8 w-8 p-0"
                            title={t.view}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('article', article._id)}
                            disabled={deletingId === article._id}
                            className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title={t.delete}
                          >
                            {deletingId === article._id ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Videos Tab */}
          <TabsContent value="my-videos">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  {t.myVideos}
                </CardTitle>
                <CardDescription>
                  Manage your published videos and drafts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noVideos}</p>
                    <Button 
                      onClick={() => setActiveTab('add-video')}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addVideo}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userVideos.map((video) => (
                      <div
                        key={video._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">
                              {getDisplayText(video.title)}
                            </h3>
                            <Badge 
                              variant={video.status === 'published' ? 'default' : 'secondary'}
                              className={video.status === 'published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }
                            >
                              {video.status === 'published' ? t.published : t.draft}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                            {getDisplayText(video.description)}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                              {formatPlatform(video.platform)}
                            </span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:pl-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVideo(video)}
                            className="h-8 w-8 p-0"
                            title={t.edit}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(video.videoUrl, '_blank')}
                            className="h-8 w-8 p-0"
                            title={t.view}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('video', video._id)}
                            disabled={deletingId === video._id}
                            className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title={t.delete}
                          >
                            {deletingId === video._id ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}