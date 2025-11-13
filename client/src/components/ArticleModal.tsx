import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, Eye, Calendar, User, Send } from 'lucide-react';

interface ArticleModalProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export default function ArticleModal({ article, isOpen, onClose, language }: ArticleModalProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const formatCategory = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      technology: language === 'ar' ? 'تكنولوجيا' : language === 'ur' ? 'ٹیکنالوجی' : 'Technology',
      business: language === 'ar' ? 'أعمال' : language === 'ur' ? 'کاروبار' : 'Business',
      sports: language === 'ar' ? 'رياضة' : language === 'ur' ? 'کھیل' : 'Sports',
      politics: language === 'ar' ? 'سياسة' : language === 'ur' ? 'سیاست' : 'Politics',
      environment: language === 'ar' ? 'بيئة' : language === 'ur' ? 'ماحول' : 'Environment',
      health: language === 'ar' ? 'صحة' : language === 'ur' ? 'صحت' : 'Health'
    };
    return categoryMap[cat] || cat;
  };

  // Fetch likes and comments when modal opens
  useEffect(() => {
    if (article && isOpen) {
      fetchArticleData();
    }
  }, [article, isOpen]);

  const fetchArticleData = async () => {
    if (!article?._id) return;
    
    try {
      const response = await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/articles/${article._id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes || 0);
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  };

  const handleLike = async () => {
    if (!article?._id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/articles/${article._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error liking article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!article?._id || !newComment.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/articles/${article._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment.trim(),
          author: 'User' // In real app, use actual user name
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {getDisplayText(article.title)}
          </DialogTitle>
        </DialogHeader>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <img 
              src={article.imageUrl} 
              alt={getDisplayText(article.title)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {formatCategory(article.category)}
          </Badge>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {article.views || 0} {language === 'ar' ? 'مشاهدة' : language === 'ur' ? 'ویوز' : 'views'}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {article.createdByUsername || 'Admin'}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {getDisplayText(article.description)}
          </p>
        </div>

        {/* Engagement Section */}
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center space-x-2 ${
                  liked ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600"
              >
                <Share className="h-5 w-5" />
                <span>{language === 'ar' ? 'مشاركة' : language === 'ur' ? 'شیئر' : 'Share'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {language === 'ar' ? 'التعليقات' : language === 'ur' ? 'تبصرے' : 'Comments'} ({comments.length})
          </h3>
          
          {/* Add Comment */}
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder={language === 'ar' ? 'أضف تعليقًا...' : language === 'ur' ? 'تبصرہ شامل کریں...' : 'Add a comment...'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || loading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.author?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                {language === 'ar' ? 'لا توجد تعليقات بعد' : language === 'ur' ? 'ابھی تک کوئی تبصرہ نہیں' : 'No comments yet'}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}