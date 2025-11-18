import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
export default function ThemeToggle() {
    var _a = useTheme(), theme = _a.theme, toggleTheme = _a.toggleTheme;
    return (<Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle" className="rounded-md">
      {theme === 'light' ? (<Moon className="h-5 w-5"/>) : (<Sun className="h-5 w-5"/>)}
    </Button>);
}
