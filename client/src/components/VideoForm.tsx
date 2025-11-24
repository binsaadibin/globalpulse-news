import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Send, X, Star, TrendingUp, Video, Link, Image } from 'lucide-react';

interface VideoFormProps {
  editingVideo?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  translations: any;
}

export function VideoForm({ editingVideo, onSave, onCancel, loading, translations }: VideoFormProps) {
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