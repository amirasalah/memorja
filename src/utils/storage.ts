import { StorageData } from '@/types';

export const getStorage = async (): Promise<StorageData> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (result: StorageData) => {
      resolve(result);
    });
  });
};

export const setStorage = async (data: Partial<StorageData>): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => {
      resolve();
    });
  });
};

export const updateCount = async (increment = 1): Promise<number> => {
  const data = await getStorage();
  const newCount = (data.count || 0) + increment;
  await setStorage({ 
    count: newCount,
    lastUpdated: new Date().toISOString()
  });
  return newCount;
};