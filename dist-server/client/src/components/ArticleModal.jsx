var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Clock, X, Share2, MessageCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
var translations = {
    en: {
        views: 'views',
        minutesRead: 'min read',
        share: 'Share',
        copyLink: 'Copy Link',
        linkCopied: 'Link copied to clipboard!',
        shareArticle: 'Share this article',
        close: 'Close',
        comments: 'Comments',
        writeComment: 'Write a comment...',
        postComment: 'Post Comment',
        like: 'Like',
        likes: 'likes',
        noComments: 'No comments yet',
        loading: 'Loading...',
        commentAdded: 'Comment added successfully!',
        commentError: 'Failed to add comment',
        likeError: 'Failed to like article'
    },
    ar: {
        views: 'مشاهدة',
        minutesRead: 'دقيقة قراءة',
        share: 'مشاركة',
        copyLink: 'نسخ الرابط',
        linkCopied: 'تم نسخ الرابط!',
        shareArticle: 'شارك هذا المقال',
        close: 'إغلاق',
        comments: 'تعليقات',
        writeComment: 'اكتب تعليق...',
        postComment: 'نشر التعليق',
        like: 'إعجاب',
        likes: 'إعجابات',
        noComments: 'لا توجد تعليقات بعد',
        loading: 'جاري التحميل...',
        commentAdded: 'تم إضافة التعليق بنجاح!',
        commentError: 'فشل إضافة التعليق',
        likeError: 'فشل الإعجاب بالمقال'
    },
    ur: {
        views: 'ویوز',
        minutesRead: 'منٹ کی قرات',
        share: 'شیئر کریں',
        copyLink: 'لنک کاپی کریں',
        linkCopied: 'لنک کاپی ہوگیا!',
        shareArticle: 'یہ مضمون شیئر کریں',
        close: 'بند کریں',
        comments: 'تبصرے',
        writeComment: 'تبصرہ لکھیں...',
        postComment: 'تبصرہ شائع کریں',
        like: 'لائک',
        likes: 'لائکس',
        noComments: 'ابھی تک کوئی تبصرہ نہیں',
        loading: 'لوڈ ہو رہا ہے...',
        commentAdded: 'تبصرہ کامیابی سے شامل ہوگیا!',
        commentError: 'تبصرہ شامل کرنے میں ناکامی',
        likeError: 'مضمون کو لائک کرنے میں ناکامی'
    }
};
var API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';
export default function ArticleModal(_a) {
    var _this = this;
    var article = _a.article, isOpen = _a.isOpen, onClose = _a.onClose;
    var language = useLanguage().language;
    var toast = useToast().toast;
    var _b = useState([]), comments = _b[0], setComments = _b[1];
    var _c = useState(''), newComment = _c[0], setNewComment = _c[1];
    var _d = useState(0), likes = _d[0], setLikes = _d[1];
    var _e = useState(false), hasLiked = _e[0], setHasLiked = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    var _g = useState(false), commentLoading = _g[0], setCommentLoading = _g[1];
    var t = translations[language];
    useEffect(function () {
        console.log('🔍 ArticleModal - Received article:', article);
        console.log('🔍 ArticleModal - Article ID:', article === null || article === void 0 ? void 0 : article._id);
        console.log('🔍 ArticleModal - Article title:', article === null || article === void 0 ? void 0 : article.title);
        if (article && isOpen) {
            fetchArticleData();
        }
    }, [article, isOpen]);
    var fetchArticleData = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, articleData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(article === null || article === void 0 ? void 0 : article._id))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    console.log('📡 Fetching article details for:', article._id);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/articles/").concat(article._id))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    articleData = _a.sent();
                    console.log('✅ Article details response:', articleData);
                    // Your backend returns article directly, not wrapped in success/data
                    setLikes(articleData.likes || 0);
                    setComments(articleData.comments || []);
                    setHasLiked(articleData.hasLiked || false);
                    return [3 /*break*/, 5];
                case 4:
                    console.log('⚠️ Using fallback article data');
                    // Fallback to original article data
                    setLikes(article.likes || 0);
                    setComments(article.comments || []);
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('❌ Error fetching article details:', error_1);
                    // Fallback to original article data
                    setLikes(article.likes || 0);
                    setComments(article.comments || []);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var getDisplayText = function (textObject) {
        if (!textObject)
            return '';
        if (typeof textObject === 'string')
            return textObject;
        return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
    };
    var formatCategory = function (cat) {
        var _a, _b;
        var categoryMap = {
            technology: { en: 'Technology', ar: 'تكنولوجيا', ur: 'ٹیکنالوجی' },
            business: { en: 'Business', ar: 'أعمال', ur: 'کاروبار' },
            sports: { en: 'Sports', ar: 'رياضة', ur: 'کھیل' },
            politics: { en: 'Politics', ar: 'سياسة', ur: 'سیاست' },
            environment: { en: 'Environment', ar: 'بيئة', ur: 'ماحول' },
            health: { en: 'Health', ar: 'صحة', ur: 'صحت' }
        };
        return ((_a = categoryMap[cat]) === null || _a === void 0 ? void 0 : _a[language]) || ((_b = categoryMap[cat]) === null || _b === void 0 ? void 0 : _b.en) || cat;
    };
    var handleLike = function () { return __awaiter(_this, void 0, void 0, function () {
        var newLikes, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(article === null || article === void 0 ? void 0 : article._id))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    newLikes = hasLiked ? likes - 1 : likes + 1;
                    setLikes(newLikes);
                    setHasLiked(!hasLiked);
                    console.log('❤️ Liking article:', article._id);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/articles/").concat(article._id, "/like"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log('✅ Like response:', data);
                    if (response.ok && data.success) {
                        // Use the actual response data
                        setLikes(data.likes);
                        setHasLiked(data.hasLiked);
                    }
                    else {
                        // Revert optimistic update if failed
                        setLikes(hasLiked ? likes + 1 : likes - 1);
                        setHasLiked(hasLiked);
                        throw new Error(data.message || t.likeError);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('❌ Error liking article:', error_2);
                    toast({
                        title: t.likeError,
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleAddComment = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newComment.trim() || !(article === null || article === void 0 ? void 0 : article._id))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setCommentLoading(true);
                    console.log('💬 Adding comment to article:', article._id);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/articles/").concat(article._id, "/comments"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                text: newComment,
                                user: 'Current User'
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_1 = _a.sent();
                    console.log('✅ Comment response:', data_1);
                    if (response.ok && data_1.success) {
                        setComments(function (prev) { return __spreadArray([data_1.comment], prev, true); });
                        setNewComment('');
                        toast({
                            title: t.commentAdded,
                            description: t.commentAdded,
                        });
                    }
                    else {
                        throw new Error(data_1.message || t.commentError);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    console.error('❌ Error adding comment:', error_3);
                    toast({
                        title: t.commentError,
                        description: error_3.message || t.commentError,
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setCommentLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleShare = function () { return __awaiter(_this, void 0, void 0, function () {
        var articleUrl, title, error_4, err_1, textArea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    articleUrl = window.location.href;
                    title = getDisplayText(article === null || article === void 0 ? void 0 : article.title);
                    if (!navigator.share) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.share({
                            title: title,
                            text: getDisplayText(article === null || article === void 0 ? void 0 : article.description),
                            url: articleUrl,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.log('Share cancelled');
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 8];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, navigator.clipboard.writeText(articleUrl)];
                case 6:
                    _a.sent();
                    toast({
                        title: t.linkCopied,
                        description: 'Article link copied to clipboard',
                    });
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    textArea = document.createElement('textarea');
                    textArea.value = articleUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    toast({
                        title: t.linkCopied,
                        description: 'Article link copied to clipboard',
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    if (!article)
        return null;
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-0 shadow-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{getDisplayText(article.title)}</DialogTitle>
          <DialogDescription>Article details and comments</DialogDescription>
        </DialogHeader>

        <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 h-8 w-8 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <X className="h-4 w-4"/>
        </Button>

        {/* Article Image with Error Handling */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
          {article.imageUrl ? (<img src={article.imageUrl} alt={getDisplayText(article.title)} className="w-full h-full object-cover" onError={function (e) {
                // Fallback image
                e.target.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop';
            }}/>) : (<div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white opacity-80"/>
            </div>)}
        </div>

        <div className="p-6">
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
                {formatCategory(article.category)}
              </Badge>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Calendar className="h-4 w-4 mr-2"/>
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white pr-8">
              {getDisplayText(article.title)}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Eye className="h-4 w-4 mr-2"/>
                {article.views || 0} {t.views}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-2"/>
                {article.readTime || '5'} {t.minutesRead}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <ThumbsUp className="h-4 w-4 mr-2"/>
                {likes} {t.likes}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLike} className={"flex items-center gap-2 ".concat(hasLiked ? 'bg-blue-50 border-blue-200 text-blue-600' : '')}>
                <ThumbsUp className={"h-4 w-4 ".concat(hasLiked ? 'fill-current' : '')}/>
                {t.like}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="h-4 w-4"/>
                {t.share}
              </Button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {getDisplayText(article.description)}
            </p>
            
            {/* Show article content if available */}
            {article.content && (<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {getDisplayText(article.content)}
                </p>
              </div>)}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.comments} ({comments.length})
              </h3>
            </div>

            <div className="mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea value={newComment} onChange={function (e) { return setNewComment(e.target.value); }} placeholder={t.writeComment} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" rows={3} disabled={commentLoading}/>
                </div>
                <Button onClick={handleAddComment} disabled={!newComment.trim() || commentLoading} className="self-end">
                  {commentLoading ? (<div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t.loading}
                    </div>) : (t.postComment)}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50"/>
                  <p>{t.noComments}</p>
                </div>) : (comments.map(function (comment, index) {
            var _a, _b;
            return (<div key={comment.id || index} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {((_b = (_a = comment.user) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.user || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  </div>);
        }))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar'
            ? "\u0646\u0634\u0631 \u0628\u0648\u0627\u0633\u0637\u0629 ".concat(article.createdByUsername || 'محرر')
            : language === 'ur'
                ? "\u0628\u0630\u0631\u06CC\u0639\u06C1 \u0634\u0627\u0626\u0639 \u06A9\u06CC\u0627 \u06AF\u06CC\u0627 ".concat(article.createdByUsername || 'ایڈیٹر')
                : "Published by ".concat(article.createdByUsername || 'Editor')}
              </div>
              <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-700 dark:border-gray-400 dark:text-gray-300 bg-white dark:bg-gray-800">
                {t.close}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
