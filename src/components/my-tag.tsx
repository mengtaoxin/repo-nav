import * as React from "react";
import { configManager } from "@/lib/config-manager";

interface MyTagProps {
  name: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Generates a color class based on a string hash
 * Uses theme-aware colors that adapt to dark/light mode
 * @param str - The string to hash
 * @returns A Tailwind color class
 */
function stringToColorClass(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Theme-aware color palette that works in both light and dark modes
  const colorClasses = [
    "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
    "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
    "bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100",
    "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
    "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    "bg-cyan-100 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100",
    "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
    "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100",
  ];
  
  return colorClasses[Math.abs(hash) % colorClasses.length];
}

export function MyTag({ name, icon, disabled }: MyTagProps) {
  // Only apply color if icon is not provided and enable-tag-color is true
  const enableTagColor = configManager.getEnableTagColor();
  const colorClass = (icon || !enableTagColor) ? undefined : stringToColorClass(name);
  
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${colorClass || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon ? icon : name}
    </span>
  );
}
