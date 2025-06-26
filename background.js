chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openPage",
    title: "View Recorded Applications",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openPage") {
    chrome.tabs.create({ url: chrome.runtime.getURL('page.html') });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 400,
    height: 600
  }, (newWindow) => {
    chrome.runtime.onMessage.addListener(function listener(message, sender, sendResponse) {
      if (message.action === 'popupReady') {
        chrome.runtime.onMessage.removeListener(listener);
        chrome.runtime.sendMessage({
          action: 'openPopup',
          tabId: tab.id,
          tabUrl: tab.url
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW_JOB_APPLICATION' && message.job) {
    chrome.storage.local.get(['jobDetails'], (result) => {
      const jobDetails = result.jobDetails || [];
      jobDetails.push(message.job);
      chrome.storage.local.set({ jobDetails });
    });
  }
});