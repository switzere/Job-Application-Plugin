function extractLeverDetails() {
  // TODO: Implement extraction logic for Lever
  
  // Select the <h2> element within the <div class="posting-headline">
  const jobTitleElement = document.querySelector('.posting-headline h2');
  // Get the text content of the <h2> element
  const jobTitle = jobTitleElement.textContent.trim();

  const companyInfoElement = document.title
  const companyInfo = companyInfoElement ? companyInfoElement : 'Company Info Not Found';

  const jobDescriptionElement = document.querySelector('[data-qa="job-description"]');
  const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
  const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

  const locationElement = document.querySelector('.location');
  const location = locationElement ? locationElement.innerText : 'Location Not Found';

  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription,
    jobDescRaw: jobDescRaw,
    postingSource: 'Lever',
    locationInfo: location
  };
}

function attachLeverSubmit() {
  function attach() {
    const btns = document.querySelectorAll('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');

    for (const btn of btns) {
      if (btn && !btn.dataset.jobRecorderAttached) {
        btn.dataset.jobRecorderAttached = "true";
        btn.addEventListener('click', () => {
          setTimeout(() => {
            const job = extractLeverDetails(); // Direct call
            if (job) sendJobApplication(job);
          }, 1000);
        });
      }
    }
  }
  attach();
  const observer = new MutationObserver(attach);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.extractLeverDetails = extractLeverDetails;

window.attachLeverSubmit = attachLeverSubmit;