import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Send, X, Star, TrendingUp, FileText, Image, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleFormProps {
  editingArticle?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  translations: any;
}

export function ArticleForm({ editingArticle, onSave, onCancel, loading, translations }: ArticleFormProps) {
  const { toast } = useToast();
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

  const [errors, setErrors] = useState<{title?: string; description?: string; content?: string}>({});

  const validateForm = (status: 'draft' | 'published') => {
    const newErrors: {title?: string; description?: string; content?: string} = {};
    
    if (status === 'draft') {
      if (!formData.title.en?.trim()) {
        newErrors.title = 'Title in English is required';
      }
    } else {
      if (!formData.title.en?.trim()) {
        newErrors.title = 'Title in English is required';
      }
      if (!formData.description.en?.trim()) {
        newErrors.description = 'Description in English is required';
      }
      if (!formData.content.en?.trim()) {
        newErrors.content = 'Content in English is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!validateForm(status)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const saveData = {
      ...formData,
      status,
      readTime: `${formData.readTime} min read`
    };
    
    onSave(saveData);
  };

  const categories = [
    { value: 'technology', label: 'Technology', icon: '🚀', color: 'bg-blue-100 text-blue-800' },
    { value: 'business', label: 'Business', icon: '💼', color: 'bg-green-100 text-green-800' },
    { value: 'sports', label: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-800' },
    { value: 'politics', label: 'Politics', icon: '🏛️', color: 'bg-purple-100 text-purple-800' },
    { value: 'environment', label: 'Environment', icon: '🌱', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'health', label: 'Health', icon: '❤️', color: 'bg-red-100 text-red-800' },
  ];

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'ar': return 'Arabic';
      case 'ur': return 'Urdu';
      default: return lang;
    }
  };

  return (
    <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-100 dark:from-blue-900 dark:to-cyan-900/20 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </CardTitle>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {editingArticle ? 'Update your article content' : 'Write and publish your amazing article'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-blue-200 dark:hover:bg-blue-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Article Titles */}
            <Card className="border-2 border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-500 text-white p-1 rounded text-xs">📝</span>
                  Article Titles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['en', 'ar', 'ur'].map((lang) => (
                  <div key={lang} className="space-y-2">
                    <Label className="text-xs font-medium capitalize">
                      {getLanguageLabel(lang)}
                      {lang === 'en' && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      value={formData.title[lang as keyof typeof formData.title]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, [lang]: e.target.value }
                      }))}
                      placeholder={`Enter title in ${getLanguageLabel(lang)}`}
                      required={lang === 'en'}
                      className={`text-sm ${errors.title && lang === 'en' ? 'border-red-500' : ''}`}
                    />
                  </div>
                ))}
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </CardContent>
            </Card>

            {/* Article Descriptions */}
            <Card className="border-2 border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-green-500 text-white p-1 rounded text-xs">📄</span>
                  Article Descriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['en', 'ar', 'ur'].map((lang) => (
                  <div key={lang} className="space-y-2">
                    <Label className="text-xs font-medium capitalize">
                      {getLanguageLabel(lang)}
                      {lang === 'en' && formData.status === 'published' && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Textarea
                      value={formData.description[lang as keyof typeof formData.description]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        description: { ...prev.description, [lang]: e.target.value }
                      }))}
                      placeholder={`Enter description in ${getLanguageLabel(lang)}`}
                      rows={2}
                      className={`text-sm resize-none ${
                        errors.description && lang === 'en' && formData.status === 'published' ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                ))}
                {errors.description && formData.status === 'published' && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card className="border-2 border-purple-100 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-purple-500 text-white p-1 rounded text-xs">📖</span>
                  Article Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['en', 'ar', 'ur'].map((lang) => (
                  <div key={lang} className="space-y-2">
                    <Label className="text-xs font-medium capitalize">
                      {getLanguageLabel(lang)}
                      {lang === 'en' && formData.status === 'published' && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Textarea
                      value={formData.content[lang as keyof typeof formData.content]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        content: { ...prev.content, [lang]: e.target.value }
                      }))}
                      placeholder={`Write your article content in ${getLanguageLabel(lang)}...`}
                      rows={4}
                      className={`text-sm resize-none ${
                        errors.content && lang === 'en' && formData.status === 'published' ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                ))}
                {errors.content && formData.status === 'published' && (
                  <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card className="border-2 border-orange-100 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-orange-500 text-white p-1 rounded text-xs">⚙️</span>
                  Article Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Read Time (min)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                      <Input
                        type="number"
                        value={formData.readTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                        placeholder="5"
                        min="1"
                        max="60"
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Featured Image URL</Label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Features */}
            <Card className="border-2 border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-yellow-500 text-white p-1 rounded text-xs">⭐</span>
                  Article Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-yellow-200">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm">Featured Article</div>
                      <div className="text-xs text-gray-500">Highlight on homepage</div>
                    </div>
                  </Label>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-200">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Trending Article</div>
                      <div className="text-xs text-gray-500">Show in trending section</div>
                    </div>
                  </Label>
                  <Switch
                    checked={formData.isTrending}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTrending: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status & Preview */}
            <Card className="border-2 border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="bg-green-500 text-white p-1 rounded text-xs">📊</span>
                  Status & Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Info */}
                <div className={`p-3 rounded-lg border-2 ${
                  formData.status === 'draft' 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      formData.status === 'draft' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">
                        {formData.status === 'draft' ? 'Draft Mode' : 'Publish Mode'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formData.status === 'draft' 
                          ? 'Only title required. Save as draft to work later.'
                          : 'All fields required. Article will be public.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Preview */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <Label className="text-xs font-medium block mb-2">Quick Preview</Label>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Title:</span>
                      <span className="font-medium truncate">{formData.title.en || 'No title'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Read Time:</span>
                      <span className="font-medium">{formData.readTime} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.isFeatured && <Badge variant="secondary" className="text-xs bg-yellow-100">Featured</Badge>}
                      {formData.isTrending && <Badge variant="secondary" className="text-xs bg-orange-100">Trending</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSubmit('draft')} 
                disabled={loading}
                className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={() => handleSubmit('published')} 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}