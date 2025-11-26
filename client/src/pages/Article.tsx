import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Eye, 
  Clock, 
  ArrowLeft, 
  Share2, 
  MessageCircle, 
  ThumbsUp, 
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Link
} from 'lucide-react';

const translations = {
  en: {
    views: 'views',
    minutesRead: 'min read',
    share: 'Share',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied to clipboard!',
    backToHome: 'Back to Home',
    comments: 'Comments',
    writeComment: 'Write a comment...',
    postComment: 'Post Comment',
    like: 'Like',
    likes: 'likes',
    noComments: 'No comments yet',
    loading: 'Loading...',
    commentAdded: 'Comment added successfully!',
    commentError: 'Failed to add comment',
    likeError: 'Failed to like article',
    shareOnFacebook: 'Share on Facebook',
    shareOnTwitter: 'Share on Twitter',
    shareOnLinkedIn: 'Share on LinkedIn',
    relatedArticles: 'Related Articles'
  },
  ar: {
    views: 'مشاهدة',
    minutesRead: 'دقيقة قراءة',
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط!',
    backToHome: 'العودة إلى الرئيسية',
    comments: 'تعليقات',
    writeComment: 'اكتب تعليق...',
    postComment: 'نشر التعليق',
    like: 'إعجاب',
    likes: 'إعجابات',
    noComments: 'لا توجد تعليقات بعد',
    loading: 'جاري التحميل...',
    commentAdded: 'تم إضافة التعليق بنجاح!',
    commentError: 'فشل إضافة التعليق',
    likeError: 'فشل الإعجاب بالمقال',
    shareOnFacebook: 'مشاركة على فيسبوك',
    shareOnTwitter: 'مشاركة على تويتر',
    shareOnLinkedIn: 'مشاركة على لينكد إن',
    relatedArticles: 'مقالات ذات صلة'
  },
  ur: {
    views: 'ویوز',
    minutesRead: 'منٹ کی قرات',
    share: 'شیئر کریں',
    copyLink: 'لنک کاپی کریں',
    linkCopied: 'لنک کاپی ہوگیا!',
    backToHome: 'ہوم پر واپس جائیں',
    comments: 'تبصرے',
    writeComment: 'تبصرہ لکھیں...',
    postComment: 'تبصرہ شائع کریں',
    like: 'لائک',
    likes: 'لائکس',
    noComments: 'ابھی تک کوئی تبصرہ نہیں',
    loading: 'لوڈ ہو رہا ہے...',
    commentAdded: 'تبصرہ کامیابی سے شامل ہوگیا!',
    commentError: 'تبصرہ شامل کرنے میں ناکامی',
    likeError: 'مضمون کو لائک کرنے میں ناکامی',
    shareOnFacebook: 'فیس بک پر شیئر کریں',
    shareOnTwitter: 'ٹویٹر پر شیئر کریں',
    shareOnLinkedIn: 'لنکڈ ان پر شیئر کریں',
    relatedArticles: 'متعلقہ مضامین'
  },
};

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

export default function ArticlePage() {
  const params = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  
  const t = translations[language as 'en' | 'ar' | 'ur'];
  const articleId = params.id;

  useEffect(() => {
    if (articleId) {
      fetchArticleData();
      fetchRelatedArticles();
    }
  }, [articleId]);

  const fetchArticleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`);
      
      if (response.ok) {
        const articleData = await response.json();
        setArticle(articleData);
        setLikes(articleData.likes || 0);
        setComments(articleData.comments || []);
        setHasLiked(articleData.hasLiked || false);
        
        document.title = getDisplayText(articleData.title) + ' - GlobalPulse News';
      } else {
        throw new Error('Failed to fetch article');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles`);
      if (response.ok) {
        const result = await response.json();
        let articlesArray = [];
        
        if (Array.isArray(result)) {
          articlesArray = result;
        } else if (result && Array.isArray(result.data)) {
          articlesArray = result.data;
        } else if (result && Array.isArray(result.articles)) {
          articlesArray = result.articles;
        }
        
        const related = articlesArray
          .filter((a: any) => a._id !== articleId && a.category === article?.category)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
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
    if (!articleId) return;
    
    try {
      const newLikes = hasLiked ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setHasLiked(!hasLiked);

      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLikes(data.likes);
        setHasLiked(data.hasLiked);
      } else {
        setLikes(hasLiked ? likes + 1 : likes - 1);
        setHasLiked(hasLiked);
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !articleId) return;
    
    try {
      setCommentLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}/comments`, {
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
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const shareUrl = window.location.href;
  const articleTitle = article ? getDisplayText(article.title) : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert(t.linkCopied);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{t.loading}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <Button onClick={() => navigate('/')}>
              {t.backToHome}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToHome}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                <img 
                  src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'}
                  alt={getDisplayText(article.title)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
                      {formatCategory(article.category)}
                    </Badge>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {getDisplayText(article.title)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {article.views || 0} {t.views}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {article.readTime || '5'} {t.minutesRead}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {likes} {t.likes}
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none py-8">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {getDisplayText(article.description)}
                  </p>
                  
                  {article.content && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {getDisplayText(article.content)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.share}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => window.open(shareLinks.facebook, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Facebook className="h-4 w-4" />
                      {t.shareOnFacebook}
                    </Button>
                    <Button
                      onClick={() => window.open(shareLinks.twitter, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Twitter className="h-4 w-4" />
                      {t.shareOnTwitter}
                    </Button>
                    <Button
                      onClick={() => window.open(shareLinks.linkedin, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      {t.shareOnLinkedIn}
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Link className="h-4 w-4" />
                      {t.copyLink}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <Button
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${hasLiked ? 'bg-blue-500 text-white' : ''}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                    {t.like} ({likes})
                  </Button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t.comments} ({comments.length})
                    </h3>
                  </div>

                  <div className="mb-8">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t.writeComment}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={4}
                      disabled={commentLoading}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commentLoading}
                      className="mt-2"
                    >
                      {commentLoading ? t.loading : t.postComment}
                    </Button>
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
              </div>
            </article>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t.share}</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => window.open(shareLinks.facebook, '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => window.open(shareLinks.twitter, '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => window.open(shareLinks.linkedin, '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    {t.copyLink}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {relatedArticles.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t.relatedArticles}</h3>
                  <div className="space-y-3">
                    {relatedArticles.map((relatedArticle) => (
                      <div
                        key={relatedArticle._id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => navigate(`/article/${relatedArticle._id}`)}
                      >
                        <img
                          src={relatedArticle.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100&h=100&fit=crop'}
                          alt={getDisplayText(relatedArticle.title)}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {getDisplayText(relatedArticle.title)}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(relatedArticle.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}