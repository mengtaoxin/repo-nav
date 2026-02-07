import * as React from "react";

interface MyTagProps {
  name: string;
  icon?: React.ReactNode;
}

/**
 * Generates a consistent color based on a string hash
 * @param str - The string to hash
 * @returns A hex color string
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with fixed saturation and lightness for better readability
  const hue = hash % 360;
  const saturation = 65; // 65% saturation for vibrant but not overwhelming colors
  const lightness = 75; // 75% lightness for good contrast with text
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function MyTag({ name, icon }: MyTagProps) {
  const backgroundColor = icon ? undefined : stringToColor(name);
  
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {icon ? icon : name}
    </span>
  );
}
