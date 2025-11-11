import { useEffect, useState } from 'react';

const THEME_PREFIX = 'theme-';

export function useTheme(defaultTheme: string) {
  const [theme, setTheme] = useState<string>(() =>
    localStorage.getItem('wf-theme') || defaultTheme
  );

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Remove all existing theme classes from body and html
    const existingThemes = Array.from(body.classList).filter(cls =>
      cls.startsWith(THEME_PREFIX)
    );
    existingThemes.forEach(cls => {
      body.classList.remove(cls);
      html.classList.remove(cls);
    });

    // Add new theme class to both body and html
    body.classList.add(theme);
    html.classList.add(theme);

    // Force CSS repaint
    body.style.display = 'none';
    body.offsetHeight; // Trigger reflow
    body.style.display = '';

    localStorage.setItem('wf-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
