chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const url = new URL(tab.url);
  const hostname = url.hostname;

  // Determine the script path based on the hostname
  let scriptPath = extractors['default'];
  for (const key in extractors) {
    if (hostname.includes(key)) {
      scriptPath = extractors[key];
      break;
    }
  }

  console.log(`Loading script: ${scriptPath}`);

  // Check if a custom extractor is available
  chrome.storage.local.get([hostname], (result) => {
    if (result[hostname]) {
      const scriptContent = result[hostname];
      const scriptBlob = new Blob([scriptContent], { type: 'application/javascript' });
      const scriptURL = URL.createObjectURL(scriptBlob);

      // Dynamically import the custom extractor script
      import(scriptURL).then((module) => {
        const extractionFunction = module[Object.keys(module)[0]];
        console.log('Executing custom extraction function');
        executeScriptAndHandleResults(tab.id, extractionFunction);
      }).catch((error) => {
        console.error('Failed to load custom script:', error);
        statusMessage.textContent = 'Failed to Record Details.';
      });
    } else {
      // Dynamically import the script and execute the extraction function
      import(chrome.runtime.getURL(scriptPath)).then((module) => {
        const extractionFunction = module[Object.keys(module)[0]];
        console.log(`Executing extraction function from: ${scriptPath}`);
        executeScriptAndHandleResults(tab.id, extractionFunction);
      }).catch((error) => {
        console.error('Failed to load script:', error);
        statusMessage.textContent = 'Failed to Record Details.';
      });
    }
  });
});

function executeScriptAndHandleResults(tabId, extractionFunction) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: extractionFunction
  }, (results) => {
    if (results && results[0] && results[0].result) {
      const details = results[0].result;
      console.log('Extraction results:', details);
      // Process the extracted details
    } else {
      statusMessage.textContent = 'Failed to Record Details.';
    }
  });
}