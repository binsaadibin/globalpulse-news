import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Advertisement() {
  const { language } = useLanguage();

  const translations = {
    en: {
      advertisement: 'Advertisement',
      sponsored: 'Sponsored Content',
      discover: 'Discover the latest products and services',
      learnMore: 'Learn More'
    },
    ar: {
      advertisement: 'إعلان',
      sponsored: 'محتوى مدفوع',
      discover: 'اكتشف أحدث المنتجات والخدمات',
      learnMore: 'اكتشف المزيد'
    },
    ur: {
      advertisement: 'اشتہار',
      sponsored: 'سپانسرڈ مواد',
      discover: 'تازہ ترین مصنوعات اور خدمات دریافت کریں',
      learnMore: 'مزید دریافت کریں'
    }
  };

  const t = translations[language as 'en' | 'ar' | 'ur'];

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-dashed border-blue-300 dark:border-blue-700">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
            {t.advertisement}
          </Badge>
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.sponsored}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t.discover}
        </p>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          {t.learnMore}
        </Button>
      </CardContent>
    </Card>
  );
}