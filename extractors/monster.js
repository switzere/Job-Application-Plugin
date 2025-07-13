function extractMonsterDetails() {
  const jobTitleElement = document.querySelector('[data-testid="jobTitle"]');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    const companyInfoElement = document.querySelector('[data-testid="company"]');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    const locationElement = document.querySelector('[data-testid="jobDetailLocation"]');
    const location = locationElement ? locationElement.innerText : 'Location Not Found';

    const datePostedElement = document.querySelector('[data-testid="jobDetailDateRecency"]');
    const datePosted = datePostedElement ? datePostedElement.innerText : 'Date Posted Not Found';

    const jobDescriptionElement = document.querySelector('[data-testid="svx-description-container-inner"]');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription,
    jobDescRaw: jobDescRaw,
    postingSource: 'Monster'
  };
}

function attachMonsterSubmit() {
  function attach() {
    const btns = document.querySelectorAll('[data-testid="quick-apply-button"], [data-testid="apply-button"]');

    for (const btn of btns) {
      if (btn && !btn.dataset.jobRecorderAttached) {
        btn.dataset.jobRecorderAttached = "true";
        btn.addEventListener('click', () => {
          setTimeout(() => {
            const job = extractMonsterDetails(); // Direct call
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

window.extractMonsterDetails = extractMonsterDetails;

window.attachMonsterSubmit = attachMonsterSubmit;