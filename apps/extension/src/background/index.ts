// Background service worker script

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Initialize default settings, etc.
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  // Handle different message types
  if (message.type === 'STORE_DATA') {
    // Handle storing data
    sendResponse({ success: true });
  }
  
  // Keep the message channel open for async responses
  return true;
});

export {};
