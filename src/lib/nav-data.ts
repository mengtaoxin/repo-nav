import defaultData from "@/resources/default-data.json";

const STORAGE_KEY = "repo_nav_data_v1";

export interface NavItem {
  name: string;
  url: string;
  icon: string;
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
  add(data: NavData, item: NavItem): NavData {
    const newData = {
      ...data,
      navs: [...data.navs, item],
    };
    this.save(newData);
    return newData;
  },

  /**
   * Update a navigation item at the specified index
   */
  update(data: NavData, index: number, item: NavItem): NavData {
    const newData = {
      ...data,
      navs: data.navs.map((nav, i) => (i === index ? item : nav)),
    };
    this.save(newData);
    return newData;
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
