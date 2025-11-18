import { createContext, useContext, useEffect, useState } from 'react';
var ThemeContext = createContext(undefined);
export function ThemeProvider(_a) {
    var children = _a.children;
    var _b = useState(function () {
        var stored = localStorage.getItem('theme');
        return stored || 'light';
    }), theme = _b[0], setTheme = _b[1];
    useEffect(function () {
        var root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    var toggleTheme = function () {
        setTheme(function (prev) { return prev === 'light' ? 'dark' : 'light'; });
    };
    return (<ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>);
}
export function useTheme() {
    var context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
