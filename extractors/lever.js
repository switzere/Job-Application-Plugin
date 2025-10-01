function extractLeverDetails() {

  // Select the <h2> element within the <div class="posting-header">
  const jobTitleElement = document.querySelector('.posting-header h2');
  const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : 'Job Title Not Found';

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
    const btn = document.getElementById('btn-submit');

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
  attach();
  const observer = new MutationObserver(attach);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.extractLeverDetails = extractLeverDetails;

window.attachLeverSubmit = attachLeverSubmit;