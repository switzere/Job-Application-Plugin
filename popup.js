const extractors = {
    //specific keys first
    'smartapply.indeed': 'extractors/smartapply.indeed.js', 

    'workday': 'extractors/workday.js',
    'linkedin': 'extractors/linkedin.js',
    'indeed': 'extractors/indeed.js',
    'monster': 'extractors/monster.js',
    'glassdoor': 'extractors/glassdoor.js',
    'lever': 'extractors/lever.js',
    'greenhouse': 'extractors/greenhouse.js',
    'vector': 'extractors/vector.js',
    'default': 'extractors/default.js'
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const statusMessage = document.getElementById('statusMessage');
    const jobDetailsDiv = document.getElementById('jobDetails');
    const jobTitleSpan = document.getElementById('jobTitle');
    const companyInfoSpan = document.getElementById('companyInfo');
    const websiteURLSpan = document.getElementById('websiteURL');
    const jobDescriptionSpan = document.getElementById('jobDescription');
    const postingSourceSpan = document.getElementById('postingSource');
    const confirmButton = document.getElementById('confirmButton');
  
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
  
      // Dynamically import the script and execute the extraction function
      import(chrome.runtime.getURL(scriptPath)).then((module) => {
        const extractionFunction = module[Object.keys(module)[0]];
        console.log(`Executing extraction function from: ${scriptPath}`);
        executeScriptAndHandleResults(tab.id, extractionFunction);
      }).catch((error) => {
        console.error('Failed to load script:', error);
        statusMessage.textContent = 'Failed to Record Details.';
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
  
          jobTitleSpan.textContent = details.jobTitle || 'Job Title Not Found';
          companyInfoSpan.textContent = details.companyInfo || 'Company Info Not Found';
          websiteURLSpan.textContent = details.url || 'URL Not Found';
          jobDescriptionSpan.textContent = details.jobDescription || 'Job Description Not Found';
          postingSourceSpan.textContent = details.postingSource || 'Posting Source Not Found';

          details.timestamp = new Date().toISOString();
          details.notes = '';  // Add a blank notes field
          details.stage = 'Applied';  // Add a stage field with default value "Applied"
  
          statusMessage.style.display = 'none';
          jobDetailsDiv.style.display = 'block';
  
          confirmButton.addEventListener('click', () => {
            // get info from the popup
            details.jobTitle = document.getElementById('jobTitle').value;
            details.companyInfo = document.getElementById('companyInfo').value;
            details.url = document.getElementById('websiteURL').value;
            details.jobDescription = document.getElementById('jobDescription').value;
            details.postingSource = document.getElementById('postingSource').value;

            // Separate standard fields and extra fields
            const standardFields = ['jobTitle', 'companyInfo', 'url', 'jobDescription', 'postingSource', 'timestamp', 'notes', 'stage'];
            const extraFields = {};
            for (const key in details) {
              if (!standardFields.includes(key)) {
                extraFields[key] = details[key];
              }
            }

            //const content = JSON.stringify({ ...details, extra: extraFields }, null, 2);
            //const blob = new Blob([content], { type: 'application/json' });
            //const url = URL.createObjectURL(blob);
            //const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            //const filename = `job_app_details_${timestamp}.json`;
  
            //downloadFile(url, filename);

              // Store the details in local storage
            chrome.storage.local.get(['jobDetails'], (result) => {
              const jobDetails = result.jobDetails || [];
              jobDetails.push(details);
              chrome.storage.local.set({ jobDetails: jobDetails });
            });

            statusMessage.textContent = 'Details Recorded Successfully!';
            statusMessage.style.display = 'block';
            jobDetailsDiv.style.display = 'none';
          }, { once: true }); // Ensure the event listener is added only once
        } else {
          statusMessage.textContent = 'Failed to Record Details.';
        }
      });
    }

  });
  