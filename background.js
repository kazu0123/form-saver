chrome.runtime.onInstalled.addListener(() => {
  console.log("Form Saver installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'save') {
    const saveData = {};
    saveData[message.key] = message.data;
    chrome.storage.sync.set(saveData, () => {
      console.log(`Form data saved for key: ${message.key}`);
    });
  } else if (message.action === 'get') {
    chrome.storage.sync.get([message.key], (result) => {
      sendResponse({ data: result[message.key] });
    });
    return true; // これは非同期応答を示すために必要です
  }
});
