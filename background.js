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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'newJobApp' && message.job) {

    const details = message.job;

    details.timestamp = new Date().toISOString();
    details.notes = '';  // Add a blank notes field
    details.stage = 'Applied';  // Add a stage field with default value "Applied"

    chrome.storage.local.get(['jobDetails'], (result) => {
      const jobDetails = result.jobDetails || [];
      jobDetails.unshift(details);
      chrome.storage.local.set({ jobDetails });
      console.log('Received newJobApp message:', details);
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'open_side_panel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // This callback is still considered a user gesture
      chrome.sidePanel.open({ windowId: tabs[0].windowId });
    });
  }
});