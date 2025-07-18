function extractGreenhouseDetails() {
  // TODO: Implement extraction logic for Greenhouse
  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription
  };
}

function attachGreenhouseSubmit() {
  function attach() {
    const btns = document.querySelectorAll('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');

    for (const btn of btns) {
      if (btn && !btn.dataset.jobRecorderAttached) {
        btn.dataset.jobRecorderAttached = "true";
        btn.addEventListener('click', () => {
          setTimeout(() => {
            const job = extractGreenhouseDetails(); // Direct call
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

window.extractGreenhouseDetails = extractGreenhouseDetails;

window.attachGreenhouseSubmit = attachGreenhouseSubmit;