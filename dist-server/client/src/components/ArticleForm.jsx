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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Send, X } from 'lucide-react';
export function ArticleForm(_a) {
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
