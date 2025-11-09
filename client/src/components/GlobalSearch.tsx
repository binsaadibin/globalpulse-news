import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface GlobalSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const translations = {
  en: { search: 'Search news, videos...' },
  ar: { search: 'ابحث عن الأخبار، الفيديوهات...' },
  ur: { search: 'خبریں، ویڈیوز تلاش کریں...' },
};

export default function GlobalSearch({ onSearch, placeholder }: GlobalSearchProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || t.search}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9"
        data-testid="input-global-search"
      />
    </div>
  );
}
