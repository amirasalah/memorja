import { appRouter } from '../server/trpc';

console.log('Background script started');

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({ count: 0 });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Handle different message types
  if (message.type === 'TRPC_REQUEST') {
    const { path, input } = message.payload;
    
    // Get the procedure from the router
    const procedure = path.split('.').reduce((acc, curr) => acc[curr], appRouter);
    
    if (procedure) {
      // Execute the procedure
      procedure.call({ input })
        .then(result => {
          sendResponse({ success: true, data: result });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
    } else {
      sendResponse({ success: false, error: 'Procedure not found' });
    }
    
    return true;
  }
  
  if (message.type === 'GET_COUNT') {
    chrome.storage.local.get(['count'], (result) => {
      sendResponse({ success: true, count: result.count || 0 });
    });
    return true;
  }
  
  if (message.type === 'INCREMENT_COUNT') {
    const amount = message.payload?.amount || 1;
    
    chrome.storage.local.get(['count'], (result) => {
      const newCount = (result.count || 0) + amount;
      chrome.storage.local.set({ count: newCount }, () => {
        sendResponse({ success: true, count: newCount });
      });
    });
    return true;
  }
});