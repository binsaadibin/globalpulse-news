import GlobalSearch from '../GlobalSearch';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function GlobalSearchExample() {
  return (
    <LanguageProvider>
      <div className="p-4">
        <GlobalSearch onSearch={(q) => console.log('Search query:', q)} />
      </div>
    </LanguageProvider>
  );
}
