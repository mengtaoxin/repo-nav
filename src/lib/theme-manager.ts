import { configManager } from "@/lib/config-manager";

export type Theme = "default" | "dark" | "light";

export const themeManager = {
  /**
   * Load theme from config manager
   */
  load(): Theme {
    return configManager.getTheme();
  },

  /**
   * Save theme and apply it to the document
   */
  save(theme: Theme): void {
    configManager.setTheme(theme);
    this.apply(theme);
  },

  /**
   * Apply theme to the document element
   */
  apply(theme: Theme): void {
    configManager.applyTheme(theme);
  },
};
