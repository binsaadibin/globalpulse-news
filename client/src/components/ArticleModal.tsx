import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Clock, X, Share2, MessageCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface ArticleModalProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
}

const translations = {
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

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

export default function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  
  const t = translations[language as 'en' | 'ar' | 'ur'];

  useEffect(() => {
    if (article && isOpen) {
      fetchArticleData();
    }
  }, [article, isOpen]);

  const fetchArticleData = async () => {
    if (!article?._id) return;
    
    try {
      setLoading(true);
      // Use correct endpoint - no /details
      const response = await fetch(`${API_BASE_URL}/api/articles/${article._id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLikes(data.data.likes || 0);
          setComments(data.data.comments || []);
          setHasLiked(data.data.hasLiked || false);
        }
      } else {
        // Fallback to article data from props
        setLikes(article.likes || 0);
        setComments(article.comments || []);
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
      // Fallback to article props
      setLikes(article.likes || 0);
      setComments(article.comments || []);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: { en: string; ar: string; ur: string } } = {
      technology: { en: 'Technology', ar: 'تكنولوجيا', ur: 'ٹیکنالوجی' },
      business: { en: 'Business', ar: 'أعمال', ur: 'کاروبار' },
      sports: { en: 'Sports', ar: 'رياضة', ur: 'کھیل' },
      politics: { en: 'Politics', ar: 'سياسة', ur: 'سیاست' },
      environment: { en: 'Environment', ar: 'بيئة', ur: 'ماحول' },
      health: { en: 'Health', ar: 'صحة', ur: 'صحت' }
    };
    
    return categoryMap[cat]?.[language] || categoryMap[cat]?.en || cat;
  };

  const handleLike = async () => {
    if (!article?._id) return;
    
    try {
      // Optimistic update
      const newLikes = hasLiked ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setHasLiked(!hasLiked);

      const response = await fetch(`${API_BASE_URL}/api/articles/${article._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        // Revert optimistic update if failed
        setLikes(hasLiked ? likes + 1 : likes - 1);
        setHasLiked(hasLiked);
        throw new Error(t.likeError);
      }

      const data = await response.json();
      if (data.success) {
        setLikes(data.likes);
        setHasLiked(data.hasLiked);
      }
    } catch (error) {
      console.error('Error liking article:', error);
      toast({
        title: t.likeError,
        description: t.likeError,
        variant: 'destructive'
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !article?._id) return;
    
    try {
      setCommentLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/articles/${article._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          user: 'Current User'
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        toast({
          title: t.commentAdded,
          description: t.commentAdded,
        });
      } else {
        throw new Error(data.message || t.commentError);
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: t.commentError,
        description: error.message || t.commentError,
        variant: 'destructive'
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    const articleUrl = window.location.href;
    const title = getDisplayText(article?.title);

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: getDisplayText(article?.description),
          url: articleUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(articleUrl);
        toast({
          title: t.linkCopied,
          description: 'Article link copied to clipboard',
        });
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = articleUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: t.linkCopied,
          description: 'Article link copied to clipboard',
        });
      }
    }
  };

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-0 shadow-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{getDisplayText(article.title)}</DialogTitle>
          <DialogDescription>Article details and comments</DialogDescription>
        </DialogHeader>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Article Image with Error Handling */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={getDisplayText(article.title)}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback image
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white opacity-80" />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
                {formatCategory(article.category)}
              </Badge>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
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
                <Eye className="h-4 w-4 mr-2" />
                {article.views || 0} {t.views}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {article.readTime || '5'} {t.minutesRead}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {likes} {t.likes}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 ${hasLiked ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
              >
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                {t.like}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                {t.share}
              </Button>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {getDisplayText(article.description)}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.comments} ({comments.length})
              </h3>
            </div>

            <div className="mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t.writeComment}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                    disabled={commentLoading}
                  />
                </div>
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || commentLoading}
                  className="self-end"
                >
                  {commentLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t.loading}
                    </div>
                  ) : (
                    t.postComment
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t.noComments}</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment.id || index} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.user?.[0]?.toUpperCase() || 'U'}
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
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? `نشر بواسطة ${article.createdByUsername || 'محرر'}`
                  : language === 'ur'
                  ? `بذریعہ شائع کیا گیا ${article.createdByUsername || 'ایڈیٹر'}`
                  : `Published by ${article.createdByUsername || 'Editor'}`
                }
              </div>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-700 dark:border-gray-400 dark:text-gray-300 bg-white dark:bg-gray-800"
              >
                {t.close}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}