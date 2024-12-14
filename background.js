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
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      chrome.runtime.sendMessage({ action: 'togglePopup' });
    }
  });
});