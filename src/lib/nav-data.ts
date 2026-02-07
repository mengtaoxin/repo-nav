import defaultData from "@/resources/default-data.json";

const STORAGE_KEY = "repo_nav_data";

export interface Tag {
  name: string;
  icon?: string;
}

export interface NavItem {
  name: string;
  url: string;
  icon: string;
  localRepoPath?: string;
  tags?: string[];
  description?: string;
  category?: string;
}

export interface NavData {
  version: string;
  navs: NavItem[];
  tags?: Tag[];
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
  add(data: NavData, item: { name: string; url: string; icon: string; localRepoPath?: string; tags?: string; description?: string; category?: string }): NavData {
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
  update(data: NavData, index: number, item: { name: string; url: string; icon: string; localRepoPath?: string; tags?: string; description?: string; category?: string }): NavData {
    const processedItem = this.processItem(item);
    const newData = {
      ...data,
      navs: data.navs.map((nav, i) => (i === index ? processedItem : nav)),
    };
    this.save(newData);
    return newData;
  },

  /**
   * Process item to convert tags string to array and ensure category has a default
   */
  processItem(item: { name: string; url: string; icon: string; localRepoPath?: string; tags?: string | string[]; description?: string; category?: string }): NavItem {
    const processed: NavItem = {
      name: item.name,
      url: item.url,
      icon: item.icon,
      category: item.category || "uncategorized",
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
   * Reorder navigation items
   */
  reorder(data: NavData, fromIndex: number, toIndex: number): NavData {
    const newNavs = [...data.navs];
    const [movedItem] = newNavs.splice(fromIndex, 1);
    newNavs.splice(toIndex, 0, movedItem);
    
    const newData = {
      ...data,
      navs: newNavs,
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

  /**
   * Add a global tag
   */
  addTag(data: NavData, tag: Tag): NavData {
    const newData = {
      ...data,
      tags: [...(data.tags || []), tag],
    };
    this.save(newData);
    return newData;
  },

  /**
   * Update a global tag
   */
  updateTag(data: NavData, index: number, tag: Tag): NavData {
    const newData = {
      ...data,
      tags: (data.tags || []).map((t, i) => (i === index ? tag : t)),
    };
    this.save(newData);
    return newData;
  },

  /**
   * Delete a global tag (only if not used in any nav items)
   */
  deleteTag(data: NavData, index: number): NavData | null {
    const tags = data.tags || [];
    const tagToDelete = tags[index];
    
    // Check if tag is used in any nav items
    const isUsed = data.navs.some(nav => 
      nav.tags?.some(t => t === tagToDelete.name)
    );
    
    if (isUsed) {
      return null; // Cannot delete tag that is in use
    }
    
    const newData = {
      ...data,
      tags: tags.filter((_, i) => i !== index),
    };
    this.save(newData);
    return newData;
  },

  /**
   * Get tags usage count
   */
  getTagUsageCount(data: NavData, tagName: string): number {
    return data.navs.filter(nav => 
      nav.tags?.some(t => t === tagName)
    ).length;
  },
};
