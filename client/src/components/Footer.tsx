import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    categories: 'Categories',
    politics: 'Politics',
    business: 'Business',
    technology: 'Technology',
    sports: 'Sports',
    copyright: '© 2024 GlobalPulse News. All rights reserved.',
  },
  ar: {
    about: 'معلومات عنا',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    categories: 'الفئات',
    politics: 'سياسة',
    business: 'أعمال',
    technology: 'تكنولوجيا',
    sports: 'رياضة',
    copyright: '© 2024 جلوبال بالس نيوز. جميع الحقوق محفوظة.',
  },
  ur: {
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    privacy: 'رازداری کی پالیسی',
    terms: 'سروس کی شرائط',
    categories: 'زمرے',
    politics: 'سیاست',
    business: 'کاروبار',
    technology: 'ٹیکنالوجی',
    sports: 'کھیل',
    copyright: '© 2024 گلوبل پلس نیوز۔ تمام حقوق محفوظ ہیں۔',
  },
};

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t.about}</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                  {t.about}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.categories}</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-politics">
                  {t.politics}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-business">
                  {t.business}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-technology">
                  {t.technology}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-sports">
                  {t.sports}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.privacy}</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  {t.privacy}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                  {t.terms}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Social</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
