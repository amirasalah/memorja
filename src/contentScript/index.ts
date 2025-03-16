console.log('Content script loaded on:', window.location.href);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'ANALYZE_PAGE') {
    // Example analysis: count elements on the page
    const elementCount = document.querySelectorAll('*').length;
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
    const links = document.querySelectorAll('a').length;
    const images = document.querySelectorAll('img').length;
    
    // Send analysis back to popup
    sendResponse({
      success: true,
      data: {
        url: window.location.href,
        title: document.title,
        elementCount,
        headings,
        links,
        images,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  return true;
});

// Initialize content script
const initialize = () => {
  console.log('Initializing content script');
  
  // Optional: Send a message to the background script to notify that the content script is loaded
  chrome.runtime.sendMessage({
    type: 'CONTENT_SCRIPT_LOADED',
    payload: {
      url: window.location.href,
      title: document.title
    }
  });
};

// Run when DOM is fully loaded
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}