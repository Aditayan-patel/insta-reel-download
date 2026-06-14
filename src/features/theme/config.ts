export const themes = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export const DEFAULT_THEME = themes.DARK; // ⭐ DARK default

export const themesList = [themes.DARK, themes.LIGHT] as const;
