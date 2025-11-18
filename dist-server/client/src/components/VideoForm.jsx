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
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Send, X, Link, Image, Video, Star, TrendingUp } from 'lucide-react';
export function VideoForm(_a) {
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
