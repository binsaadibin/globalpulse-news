import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Send, X, Star, TrendingUp, Video, Link, Image, Youtube, Play, Zap, Clock, Eye } from 'lucide-react';

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
    description: editingVideo?.description || { en: '', ar: '', ur: '' },
    videoUrl: editingVideo?.videoUrl || '',
    platform: editingVideo?.platform || 'youtube',
    category: editingVideo?.category || 'technology',
    thumbnailUrl: editingVideo?.thumbnailUrl || '',
    status: editingVideo?.status || 'draft',
    isFeatured: editingVideo?.isFeatured || false,
    isTrending: editingVideo?.isTrending || false,
    isLive: editingVideo?.isLive || false,
    isShort: editingVideo?.isShort || false,
  });

  const [videoId, setVideoId] = useState('');

  // Extract YouTube ID when URL changes
  useEffect(() => {
    if (formData.videoUrl) {
      const id = getYouTubeId(formData.videoUrl);
      setVideoId(id || '');
      
      // Auto-generate thumbnail if YouTube URL and no thumbnail provided
      if (id && !formData.thumbnailUrl) {
        setFormData(prev => ({
          ...prev,
          thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        }));
      }
    }
  }, [formData.videoUrl]);

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    try {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match && match[1] ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    // Validate required fields
    if (!formData.title.en.trim()) {
      alert('Please enter a video title in English');
      return;
    }

    if (!formData.videoUrl.trim()) {
      alert('Please enter a video URL');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    onSave({
      ...formData,
      status
    });
  };

  const categories = [
    { value: 'technology', label: 'Technology', icon: '🚀', color: 'bg-blue-100 text-blue-800' },
    { value: 'business', label: 'Business', icon: '💼', color: 'bg-green-100 text-green-800' },
    { value: 'sports', label: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-800' },
    { value: 'politics', label: 'Politics', icon: '🏛️', color: 'bg-purple-100 text-purple-800' },
    { value: 'environment', label: 'Environment', icon: '🌱', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'health', label: 'Health', icon: '❤️', color: 'bg-red-100 text-red-800' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-800' },
    { value: 'science', label: 'Science', icon: '🔬', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'education', label: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'news', label: 'News', icon: '📰', color: 'bg-gray-100 text-gray-800' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌟', color: 'bg-amber-100 text-amber-800' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: 'bg-cyan-100 text-cyan-800' },
  ];

  const platforms = [
    { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4 text-red-600" />, color: 'border-red-200 bg-red-50' },
    { value: 'vimeo', label: 'Vimeo', icon: <Play className="h-4 w-4 text-blue-600" />, color: 'border-blue-200 bg-blue-50' },
    { value: 'dailymotion', label: 'Dailymotion', icon: <Play className="h-4 w-4 text-orange-600" />, color: 'border-orange-200 bg-orange-50' },
    { value: 'other', label: 'Other Platform', icon: <Video className="h-4 w-4 text-gray-600" />, color: 'border-gray-200 bg-gray-50' },
  ];

  const getPlatformColor = (platform: string) => {
    return platforms.find(p => p.value === platform)?.color || 'border-gray-200 bg-gray-50';
  };

  return (
    <Card className="mb-8 border-2 border-green-200 dark:border-green-800 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-b">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-green-500 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {editingVideo ? 'Edit Video' : 'Create New Video'}
              </span>
              <p className="text-sm text-green-600 dark:text-green-400 font-normal mt-1">
                {editingVideo ? 'Update your video details' : 'Share your amazing video content with the world'}
              </p>
            </div>
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-green-200 dark:hover:bg-green-800">
            <X className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Video Titles */}
            <Card className="border-2 border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-blue-500 text-white p-1 rounded">📝</span>
                  Video Titles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Required</span>
                    {translations.videoTitleEn} *
                  </label>
                  <Input
                    value={formData.title.en || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, en: e.target.value }
                    }))}
                    placeholder="Enter an engaging video title in English..."
                    className="w-full border-2 border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block">
                    {translations.videoTitleAr}
                  </label>
                  <Input
                    value={formData.title.ar || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, ar: e.target.value }
                    }))}
                    placeholder="Arabic title (optional)..."
                    className="w-full border-2 border-gray-200"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block">
                    {translations.videoTitleUr}
                  </label>
                  <Input
                    value={formData.title.ur || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, ur: e.target.value }
                    }))}
                    placeholder="Urdu title (optional)..."
                    className="w-full border-2 border-gray-200"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Source */}
            <Card className="border-2 border-purple-100 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-purple-500 text-white p-1 rounded">🔗</span>
                  Video Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Required</span>
                    Video URL *
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-10 border-2 border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  {videoId && (
                    <div className="flex items-center gap-2 p-2 bg-green-100 border border-green-200 rounded">
                      <Youtube className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">YouTube ID detected:</span>
                      <Badge variant="secondary" className="bg-green-200 text-green-800">
                        {videoId}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block">
                    Platform *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map(platform => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, platform: platform.value }))}
                        className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          formData.platform === platform.value 
                            ? 'border-green-500 bg-green-50 shadow-md scale-105' 
                            : platform.color
                        } hover:shadow-md hover:scale-105`}
                      >
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          <span className="font-medium">{platform.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category & Type */}
            <Card className="border-2 border-indigo-100 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-indigo-500 text-white p-1 rounded">📂</span>
                  Category & Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <span className="bg-indigo-500 text-white px-2 py-1 rounded text-xs">Required</span>
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Category Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 6).map(category => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        formData.category === category.value 
                          ? `${category.color} border-current scale-105 shadow-md` 
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <span className="flex items-center gap-1 justify-center">
                        <span className="text-xs">{category.icon}</span>
                        <span className="truncate">{category.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Thumbnail, Features & Actions */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <Card className="border-2 border-orange-100 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-orange-500 text-white p-1 rounded">🖼️</span>
                  Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block">
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                    <Input
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full pl-10 border-2 border-orange-200 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                {/* Thumbnail Preview */}
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Preview</label>
                  {formData.thumbnailUrl ? (
                    <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-orange-200 overflow-hidden shadow-lg">
                      <img 
                        src={formData.thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x450/FFA500/FFFFFF?text=Invalid+Thumbnail+URL';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Image className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No thumbnail set</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Features */}
            <Card className="border-2 border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-yellow-500 text-white p-1 rounded">⭐</span>
                  Video Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Featured */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-yellow-200 shadow-sm">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold">Featured</div>
                      <div className="text-xs text-gray-500">Highlight on homepage</div>
                    </div>
                  </Label>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                </div>

                {/* Trending */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-200 shadow-sm">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold">Trending</div>
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

            {/* Video Type */}
            <Card className="border-2 border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-red-500 text-white p-1 rounded">🎥</span>
                  Video Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Live Stream */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-200 shadow-sm">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div>
                      <div className="font-semibold">Live Stream</div>
                      <div className="text-xs text-gray-500">Mark as live broadcast</div>
                    </div>
                  </Label>
                  <Switch
                    checked={formData.isLive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLive: checked }))}
                  />
                </div>

                {/* Short Video */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 shadow-sm">
                  <Label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">Short Video</div>
                      <div className="text-xs text-gray-500">Under 60 seconds</div>
                    </div>
                  </Label>
                  <Switch
                    checked={formData.isShort}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShort: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview & Actions */}
            <Card className="border-2 border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-green-500 text-white p-1 rounded">👁️</span>
                  Preview & Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Preview */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-semibold mb-2">Quick Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Title:</span>
                      <span className="font-medium truncate ml-2">{formData.title.en || 'No title'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Platform:</span>
                      <Badge variant="outline" className={getPlatformColor(formData.platform)}>
                        {formData.platform}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.isLive && <Badge variant="destructive" className="text-xs">Live</Badge>}
                      {formData.isShort && <Badge variant="secondary" className="text-xs bg-purple-100">Short</Badge>}
                      {formData.isFeatured && <Badge variant="secondary" className="text-xs bg-yellow-100">Featured</Badge>}
                      {formData.isTrending && <Badge variant="secondary" className="text-xs bg-orange-100">Trending</Badge>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSubmit('draft')} 
                    disabled={loading}
                    className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-12"
                  >
                    <Save className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Save Draft</div>
                      <div className="text-xs">Save for later</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('published')} 
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg h-12"
                  >
                    <Send className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Publish</div>
                      <div className="text-xs text-green-100">Make public</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}