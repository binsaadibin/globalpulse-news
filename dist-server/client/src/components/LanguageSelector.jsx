import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
var languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'ur', label: 'اردو' },
];
export default function LanguageSelector() {
    var _a = useLanguage(), language = _a.language, setLanguage = _a.setLanguage;
    return (<div className="flex gap-1 rounded-md border border-border p-1" data-testid="language-selector">
      {languages.map(function (lang) { return (<Button key={lang.code} variant={language === lang.code ? 'default' : 'ghost'} size="sm" onClick={function () { return setLanguage(lang.code); }} data-testid={"button-language-".concat(lang.code)} className="rounded-sm text-sm">
          {lang.label}
        </Button>); })}
    </div>);
}
