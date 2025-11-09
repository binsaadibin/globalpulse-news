import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 rounded-md border border-border p-1" data-testid="language-selector">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          data-testid={`button-language-${lang.code}`}
          className="rounded-sm text-sm"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
