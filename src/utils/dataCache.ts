// Utility for caching data with localStorage
export class DataCache {
  private static prefix = 'agriguide_';

  static set(key: string, data: any, expiryMinutes?: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : null,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error caching ${key}:`, error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  static getAge(key: string): number | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      return Date.now() - item.timestamp;
    } catch (error) {
      return null;
    }
  }
}

// Cache keys constants
export const CACHE_KEYS = {
  WEATHER_DATA: 'weather_data',
  SOIL_ANALYSIS: 'soil_analysis',
  PEST_PREDICTIONS: 'pest_predictions',
  FARM_DATA: 'farm_data',
  ANALYTICS_DATA: 'analytics_data',
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_QUEUE: 'offline_queue',
};
