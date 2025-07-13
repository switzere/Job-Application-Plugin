function extractGlassdoorDetails() {
  // TODO: Implement extraction logic for Glassdoor
  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription
  };
}

function attachGlassdoorSubmit() {
  function attach() {
    const btn = document.querySelector('[data-test="apply-button"], [data-test="apply-now-button"]');

    if (btn && !btn.dataset.jobRecorderAttached) {
      btn.dataset.jobRecorderAttached = "true";
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const job = extractGlassdoorDetails(); // Direct call
          if (job) sendJobApplication(job);
        }, 1000);
      });
    }
  }

  attach();
  const observer = new MutationObserver(attach);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.extractGlassdoorDetails = extractGlassdoorDetails;