"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataManager } from "@/components/data-manager";
import { navDataManager, type NavData } from "@/lib/nav-data";
import { configManager, type Theme } from "@/lib/config-manager";

export default function Settings() {
  const [data, setData] = useState<NavData | null>(null);
  const [theme, setTheme] = useState<Theme>("default");
  const [enableTagColor, setEnableTagColor] = useState<boolean>(true);

  // Load data and theme on client side
  useEffect(() => {
    const loadSettings = () => {
      const loadedData = navDataManager.load();
      if (loadedData) {
        setData(loadedData);
      }
      setTheme(configManager.getTheme());
      setEnableTagColor(configManager.getEnableTagColor());
    };
    loadSettings();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    configManager.setTheme(newTheme);
  };

  const handleTagColorToggle = () => {
    const newValue = !enableTagColor;
    setEnableTagColor(newValue);
    configManager.setEnableTagColor(newValue);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your preferences and data
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Choose your preferred color theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="theme-select" className="mb-2 block">
                  Color Theme
                </Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tag Color Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tag Colors</CardTitle>
            <CardDescription>
              Enable or disable dynamic colors for tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="tag-color-toggle">Enable tag colors</Label>
              <Switch
                id="tag-color-toggle"
                checked={enableTagColor}
                onCheckedChange={handleTagColorToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download your navigation data as a JSON file for backup or transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataManager onDataImported={setData} currentData={data} exportOnly={true} />
          </CardContent>
        </Card>

        {/* Data Import */}
        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Upload a previously exported navigation data file to restore or transfer your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataManager onDataImported={setData} currentData={data} importOnly={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
