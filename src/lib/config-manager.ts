import defaultSettings from "@/resources/default-settings.json";

const STORAGE_KEY = "repo_nav_configs_v1";

export type Theme = "default" | "dark" | "light";

export interface AppConfig {
  version: string;
  theme: Theme;
  "enable-tag-color": boolean;
}

export const configManager = {
  /**
   * Load config from local storage, or initialize with default settings if not found
   */
  load(): AppConfig {
    if (typeof window === "undefined") {
      return defaultSettings as AppConfig;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppConfig;
    } else {
      const initialConfig = defaultSettings as AppConfig;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialConfig));
      return initialConfig;
    }
  },

  /**
   * Save config to local storage
   */
  save(config: AppConfig): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  /**
   * Update theme and save
   */
  setTheme(theme: Theme): AppConfig {
    const config = this.load();
    const updated = { ...config, theme };
    this.save(updated);
    this.applyTheme(theme);
    return updated;
  },

  /**
   * Get current theme
   */
  getTheme(): Theme {
    const config = this.load();
    return config.theme;
  },

  /**
   * Apply theme to the document element
   */
  applyTheme(theme: Theme): void {
    if (typeof window === "undefined") return;

    const html = document.documentElement;

    // Remove all theme classes
    html.classList.remove("dark", "light", "default");

    // Apply the selected theme
    if (theme === "dark") {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
      // light is the default, no need to add a class
    }
    // default theme doesn't require any class changes
  },

  /**
   * Get enable-tag-color setting
   */
  getEnableTagColor(): boolean {
    const config = this.load();
    return config["enable-tag-color"];
  },

  /**
   * Set enable-tag-color setting
   */
  setEnableTagColor(enabled: boolean): AppConfig {
    const config = this.load();
    const updated = { ...config, "enable-tag-color": enabled };
    this.save(updated);
    return updated;
  },
};
