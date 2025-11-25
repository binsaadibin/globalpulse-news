import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Send, X, Star, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Add this import

interface ArticleFormProps {
  editingArticle?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  translations: any;
}

export function ArticleForm({ editingArticle, onSave, onCancel, loading, translations }: ArticleFormProps) {
  const { toast } = useToast(); // Add toast
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

  // Validate form based on status
  const validateForm = (status: 'draft' | 'published') => {
    const newErrors: {title?: string; description?: string; content?: string} = {};
    
    // For drafts, only basic validation
    if (status === 'draft') {
      if (!formData.title.en?.trim()) {
        newErrors.title = 'Title in English is required';
      }
    } 
    // For published articles, full validation
    else {
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
    console.log('💾 Attempting to save as:', status);
    console.log('📝 Form data:', formData);

    // Validate form
    if (!validateForm(status)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Prepare data for saving
    const saveData = {
      ...formData,
      status,
      readTime: `${formData.readTime} min read`
    };

    console.log('🚀 Sending data to onSave:', saveData);
    
    // Call the parent save function
    onSave(saveData);
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
                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
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
              <label className="text-sm font-medium mb-2 block">
                {translations.descriptionEn} 
                {formData.status === 'published' && ' *'}
              </label>
              <Textarea
                value={formData.description.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, en: e.target.value }
                }))}
                placeholder="Enter description in English"
                rows={3}
                className={`w-full ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
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
              <label className="text-sm font-medium mb-2 block">
                {translations.contentEn} 
                {formData.status === 'published' && ' *'}
              </label>
              <Textarea
                value={formData.content.en || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, en: e.target.value }
                }))}
                placeholder={translations.articleContent}
                rows={6}
                className={`w-full ${errors.content ? 'border-red-500' : ''}`}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
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

          {/* Status Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                formData.status === 'draft' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {formData.status === 'draft' 
                  ? '💡 Draft Mode: Only title is required. Save as draft to work on it later.'
                  : '🚀 Publish Mode: All fields are required. Article will be visible to readers.'
                }
              </p>
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
              className="flex items-center gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
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