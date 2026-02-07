"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { navDataManager, type NavData } from "@/lib/nav-data";

interface DataManagerProps {
  onDataImported: (data: NavData) => void;
  currentData: NavData | null;
}

export function DataManager({ onDataImported, currentData }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!currentData) return;
    
    const jsonString = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `repo-nav-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as NavData;
        
        // Validate the imported data structure
        if (!importedData.version || !Array.isArray(importedData.navs)) {
          alert("Invalid data format. Please select a valid navigation data file.");
          return;
        }

        navDataManager.save(importedData);
        onDataImported(importedData);
        alert("Data imported successfully!");
      } catch (error) {
        alert("Failed to import data. Please check the file format.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleExport}>
        Export Data
      </Button>
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        Import Data
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </>
  );
}
