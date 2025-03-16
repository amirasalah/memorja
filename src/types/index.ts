export interface Message {
    type: string;
    payload?: any;
  }
  
  export interface StorageData {
    count: number;
    lastUpdated?: string;
    [key: string]: any;
  }