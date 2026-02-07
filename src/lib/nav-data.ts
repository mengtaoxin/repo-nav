import defaultData from "@/resources/default-data.json";

const STORAGE_KEY = "repo_nav_data_v1";

export interface NavItem {
  name: string;
  url: string;
  icon: string;
  localRepoPath?: string;
  tags?: string[];
  description?: string;
}

export interface NavData {
  version: string;
  navs: NavItem[];
}

export const navDataManager = {
  /**
   * Load data from local storage, or initialize with default data if not found
   */
  load(): NavData | null {
    if (typeof window === "undefined") return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initialData = defaultData as NavData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
  },

  /**
   * Save data to local storage
   */
  save(data: NavData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Add a new navigation item
   */
  add(data: NavData, item: any): NavData {
    const processedItem = this.processItem(item);
    const newData = {
      ...data,
      navs: [...data.navs, processedItem],
    };
    this.save(newData);
    return newData;
  },

  /**
   * Update a navigation item at the specified index
   */
  update(data: NavData, index: number, item: any): NavData {
    const processedItem = this.processItem(item);
    const newData = {
      ...data,
      navs: data.navs.map((nav, i) => (i === index ? processedItem : nav)),
    };
    this.save(newData);
    return newData;
  },

  /**
   * Process item to convert tags string to array
   */
  processItem(item: any): NavItem {
    const processed: NavItem = {
      name: item.name,
      url: item.url,
      icon: item.icon,
    };
    
    if (item.localRepoPath) {
      processed.localRepoPath = item.localRepoPath;
    }
    
    if (item.tags) {
      if (typeof item.tags === 'string') {
        processed.tags = item.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      } else if (Array.isArray(item.tags)) {
        processed.tags = item.tags;
      }
    }
    
    if (item.description) {
      processed.description = item.description;
    }
    
    return processed;
  },

  /**
   * Delete a navigation item at the specified index
   */
  delete(data: NavData, index: number): NavData {
    const newData = {
      ...data,
      navs: data.navs.filter((_, i) => i !== index),
    };
    this.save(newData);
    return newData;
  },

  /**
   * Reset data to default
   */
  reset(): NavData {
    const data = defaultData as NavData;
    this.save(data);
    return data;
  },
};
