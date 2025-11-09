import { useState } from 'react';
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
import { FileText, Video, User } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const translations = {
  en: {
    dashboard: 'Dashboard',
    addArticle: 'Add Article',
    addVideo: 'Add Video',
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
    draft: 'Save as Draft',
    success: 'Published successfully!',
    loggedInAs: 'Logged in as',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    addArticle: 'إضافة مقال',
    addVideo: 'إضافة فيديو',
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
    draft: 'حفظ كمسودة',
    success: 'تم النشر بنجاح!',
    loggedInAs: 'مسجل الدخول كـ',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    addArticle: 'مضمون شامل کریں',
    addVideo: 'ویڈیو شامل کریں',
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
    draft: 'مسودے کے طور پر محفوظ کریں',
    success: 'کامیابی سے شائع ہوگیا!',
    loggedInAs: 'کے طور پر لاگ ان ہیں',
  },
};

function DashboardContent() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const t = translations[language];
  const { toast } = useToast();

  const [articleForm, setArticleForm] = useState({
    titleEn: '',
    titleAr: '',
    titleUr: '',
    descEn: '',
    descAr: '',
    descUr: '',
    category: '',
    imageUrl: '',
  });

  const [videoForm, setVideoForm] = useState({
    titleEn: '',
    titleAr: '',
    titleUr: '',
    descEn: '',
    descAr: '',
    descUr: '',
    platform: '',
    videoUrl: '',
  });

  const handlePublishArticle = () => {
    console.log('Publishing article:', articleForm);
    toast({
      title: t.success,
      description: articleForm.titleEn || 'Article published',
    });
  };

  const handlePublishVideo = () => {
    console.log('Publishing video:', videoForm);
    toast({
      title: t.success,
      description: videoForm.titleEn || 'Video published',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold" data-testid="text-page-title">
          {t.dashboard}
        </h1>
        <Badge variant="outline" className="flex items-center gap-2" data-testid="badge-current-user">
          <User className="h-3 w-3" />
          {t.loggedInAs}: {currentUser}
        </Badge>
      </div>

      <Tabs defaultValue="article" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="article" data-testid="tab-article">
            <FileText className="h-4 w-4 mr-2" />
            {t.addArticle}
          </TabsTrigger>
          <TabsTrigger value="video" data-testid="tab-video">
            <Video className="h-4 w-4 mr-2" />
            {t.addVideo}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>{t.addArticle}</CardTitle>
              <CardDescription>Create a multilingual news article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title-en">{t.titleEn}</Label>
                  <Input
                    id="title-en"
                    value={articleForm.titleEn}
                    onChange={(e) => setArticleForm({ ...articleForm, titleEn: e.target.value })}
                    data-testid="input-title-en"
                  />
                </div>
                <div>
                  <Label htmlFor="title-ar">{t.titleAr}</Label>
                  <Input
                    id="title-ar"
                    value={articleForm.titleAr}
                    onChange={(e) => setArticleForm({ ...articleForm, titleAr: e.target.value })}
                    data-testid="input-title-ar"
                  />
                </div>
                <div>
                  <Label htmlFor="title-ur">{t.titleUr}</Label>
                  <Input
                    id="title-ur"
                    value={articleForm.titleUr}
                    onChange={(e) => setArticleForm({ ...articleForm, titleUr: e.target.value })}
                    data-testid="input-title-ur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="desc-en">{t.descEn}</Label>
                  <Textarea
                    id="desc-en"
                    value={articleForm.descEn}
                    onChange={(e) => setArticleForm({ ...articleForm, descEn: e.target.value })}
                    data-testid="input-desc-en"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="desc-ar">{t.descAr}</Label>
                  <Textarea
                    id="desc-ar"
                    value={articleForm.descAr}
                    onChange={(e) => setArticleForm({ ...articleForm, descAr: e.target.value })}
                    data-testid="input-desc-ar"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="desc-ur">{t.descUr}</Label>
                  <Textarea
                    id="desc-ur"
                    value={articleForm.descUr}
                    onChange={(e) => setArticleForm({ ...articleForm, descUr: e.target.value })}
                    data-testid="input-desc-ur"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">{t.category}</Label>
                  <Select
                    value={articleForm.category}
                    onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}
                  >
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="politics">Politics</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image-url">{t.imageUrl}</Label>
                  <Input
                    id="image-url"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-image-url"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handlePublishArticle} data-testid="button-publish-article">
                  {t.publish}
                </Button>
                <Button variant="outline" data-testid="button-draft-article">
                  {t.draft}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>{t.addVideo}</CardTitle>
              <CardDescription>Add a video from various platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="video-title-en">{t.titleEn}</Label>
                  <Input
                    id="video-title-en"
                    value={videoForm.titleEn}
                    onChange={(e) => setVideoForm({ ...videoForm, titleEn: e.target.value })}
                    data-testid="input-video-title-en"
                  />
                </div>
                <div>
                  <Label htmlFor="video-title-ar">{t.titleAr}</Label>
                  <Input
                    id="video-title-ar"
                    value={videoForm.titleAr}
                    onChange={(e) => setVideoForm({ ...videoForm, titleAr: e.target.value })}
                    data-testid="input-video-title-ar"
                  />
                </div>
                <div>
                  <Label htmlFor="video-title-ur">{t.titleUr}</Label>
                  <Input
                    id="video-title-ur"
                    value={videoForm.titleUr}
                    onChange={(e) => setVideoForm({ ...videoForm, titleUr: e.target.value })}
                    data-testid="input-video-title-ur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">{t.platform}</Label>
                  <Select
                    value={videoForm.platform}
                    onValueChange={(value) => setVideoForm({ ...videoForm, platform: value })}
                  >
                    <SelectTrigger id="platform" data-testid="select-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="video-url">{t.videoUrl}</Label>
                  <Input
                    id="video-url"
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-video-url"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handlePublishVideo} data-testid="button-publish-video">
                  {t.publish}
                </Button>
                <Button variant="outline" data-testid="button-draft-video">
                  {t.draft}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
