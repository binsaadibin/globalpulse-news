import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Image, Link, Calendar, Star, Target, User, Zap } from 'lucide-react';

interface AdvertisementFormProps {
  editingAd: any;
  onSave: (adData: any) => void;
  onCancel: () => void;
  loading: boolean;
  translations: any;
}

export const AdvertisementForm: React.FC<AdvertisementFormProps> = ({
  editingAd,
  onSave,
  onCancel,
  loading,
  translations: t
}) => {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '', ur: '' },
    description: { en: '', ar: '', ur: '' },
    imageUrl: '',
    url: '',
    position: 'sidebar' as 'sidebar' | 'inline',
    ctaText: { en: 'Learn More', ar: 'تعرف أكثر', ur: 'مزید جانیں' },
    sponsor: '',
    isActive: true,
    startDate: '',
    endDate: '',
    priority: 1
  });

  useEffect(() => {
    if (editingAd) {
      setFormData({
        title: editingAd.title || { en: '', ar: '', ur: '' },
        description: editingAd.description || { en: '', ar: '', ur: '' },
        imageUrl: editingAd.imageUrl || '',
        url: editingAd.url || '',
        position: editingAd.position || 'sidebar',
        ctaText: editingAd.ctaText || { en: 'Learn More', ar: 'تعرف أكثر', ur: 'مزید جانیں' },
        sponsor: editingAd.sponsor || '',
        isActive: editingAd.isActive !== undefined ? editingAd.isActive : true,
        startDate: editingAd.startDate ? new Date(editingAd.startDate).toISOString().split('T')[0] : '',
        endDate: editingAd.endDate ? new Date(editingAd.endDate).toISOString().split('T')[0] : '',
        priority: editingAd.priority || 1
      });
    }
  }, [editingAd]);

  const handleInputChange = (field: string, value: any, lang?: string) => {
    if (lang && (field === 'title' || field === 'description' || field === 'ctaText')) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        alert('End date must be after start date');
        return;
      }
    }

    const submitData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    onSave(submitData);
  };

  const ctaOptions = [
    { value: 'learnMore', en: 'Learn More', ar: 'تعرف أكثر', ur: 'مزید جانیں' },
    { value: 'getStarted', en: 'Get Started', ar: 'ابدأ الآن', ur: 'شروع کریں' },
    { value: 'claimOffer', en: 'Claim Offer', ar: 'احصل على العرض', ur: 'پیشکش حاصل کریں' }
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
    <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900 dark:to-indigo-900/20 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {editingAd ? 'Update your advertisement details' : 'Fill in the details for your new advertisement'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-purple-200 dark:hover:bg-purple-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Content & Media */}
            <div className="space-y-6">
              {/* Multi-language Title */}
              <Card className="border-2 border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-blue-500 text-white p-1 rounded text-xs">📝</span>
                    {t.adTitle} *
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
                        onChange={(e) => handleInputChange('title', e.target.value, lang)}
                        placeholder={`Enter title in ${getLanguageLabel(lang)}`}
                        required={lang === 'en'}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Multi-language Description */}
              <Card className="border-2 border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-green-500 text-white p-1 rounded text-xs">📄</span>
                    {t.adDescription} *
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['en', 'ar', 'ur'].map((lang) => (
                    <div key={lang} className="space-y-2">
                      <Label className="text-xs font-medium capitalize">
                        {getLanguageLabel(lang)}
                        {lang === 'en' && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Textarea
                        value={formData.description[lang as keyof typeof formData.description]}
                        onChange={(e) => handleInputChange('description', e.target.value, lang)}
                        placeholder={`Enter description in ${getLanguageLabel(lang)}`}
                        required={lang === 'en'}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Media URLs */}
              <Card className="border-2 border-orange-100 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-orange-500 text-white p-1 rounded text-xs">🖼️</span>
                    Media & Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Image URL *</Label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Target URL *</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                      <Input
                        value={formData.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        placeholder="https://example.com"
                        required
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              {/* Advertisement Settings */}
              <Card className="border-2 border-purple-100 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-purple-500 text-white p-1 rounded text-xs">⚙️</span>
                    Advertisement Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Position *</Label>
                      <Select value={formData.position} onValueChange={(value: 'sidebar' | 'inline') => handleInputChange('position', value)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sidebar">{t.sidebar}</SelectItem>
                          <SelectItem value="inline">{t.inline}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Priority</Label>
                      <Select value={formData.priority.toString()} onValueChange={(value) => handleInputChange('priority', parseInt(value))}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Lowest</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Highest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Call to Action</Label>
                    <Select 
                      value={ctaOptions.find(opt => opt.en === formData.ctaText.en)?.value} 
                      onValueChange={(value) => {
                        const option = ctaOptions.find(opt => opt.value === value);
                        if (option) {
                          handleInputChange('ctaText', {
                            en: option.en,
                            ar: option.ar,
                            ur: option.ur
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sponsor & Dates */}
              <Card className="border-2 border-indigo-100 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-indigo-500 text-white p-1 rounded text-xs">🏢</span>
                    Sponsor & Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Sponsor *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                      <Input
                        value={formData.sponsor}
                        onChange={(e) => handleInputChange('sponsor', e.target.value)}
                        placeholder={t.sponsorName}
                        required
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Start Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          required
                          className="pl-10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">End Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          required
                          className="pl-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Preview */}
              <Card className="border-2 border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="bg-yellow-500 text-white p-1 rounded text-xs">📊</span>
                    Status & Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <div>
                        <div className="font-medium text-sm">Active Advertisement</div>
                        <div className="text-xs text-gray-500">Show this ad to users</div>
                      </div>
                    </Label>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
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
                        <span className="text-gray-500">Position:</span>
                        <Badge variant="outline" className="text-xs">
                          {formData.position}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <span className="font-medium">{formData.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant={formData.isActive ? "default" : "secondary"} className="text-xs">
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {loading ? 'Saving...' : (editingAd ? t.update : t.create)}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={loading}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};