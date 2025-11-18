import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
var translations = {
    en: { search: 'Search news, videos...' },
    ar: { search: 'ابحث عن الأخبار، الفيديوهات...' },
    ur: { search: 'خبریں، ویڈیوز تلاش کریں...' },
};
export default function GlobalSearch(_a) {
    var onSearch = _a.onSearch, placeholder = _a.placeholder;
    var language = useLanguage().language;
    var t = translations[language];
    var _b = useState(''), query = _b[0], setQuery = _b[1];
    var handleChange = function (value) {
        setQuery(value);
        onSearch(value);
    };
    return (<div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
      <Input type="search" placeholder={placeholder || t.search} value={query} onChange={function (e) { return handleChange(e.target.value); }} className="pl-9" data-testid="input-global-search"/>
    </div>);
}
