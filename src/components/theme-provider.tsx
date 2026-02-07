"use client";

import { useEffect } from "react";
import { configManager } from "@/lib/config-manager";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply the saved theme on component mount
    const savedTheme = configManager.getTheme();
    configManager.applyTheme(savedTheme);
  }, []);

  return <>{children}</>;
}
