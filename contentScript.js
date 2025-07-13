// contentScript.js
alert('Content script loaded!');

function sendJobApplication(job) {
  //print job details
  alert(`Job Application Details:\nTitle: ${job.jobTitle}\nCompany: ${job.companyInfo}\nURL: ${job.url}\nDescription: ${job.jobDescription}\nLocation: ${job.locationInfo}\nSource: ${job.postingSource}`);
  console.log('Job Application Details:', job);
  chrome.runtime.sendMessage({ type: 'newJobApp', job });
//     chrome.storage.local.get(['jobDetails'], (result) => {
//   const jobDetails = result.jobDetails || [];
//   jobDetails.push(job);
//   chrome.storage.local.set({ jobDetails: jobDetails }, () => {
//     // Optionally, do something after saving
//     console.log(jobDetails)
//   });
// });

}

function observeAndAttach(selectorOrFn) {
  function attach() {
    let btn;
    if (typeof selectorOrFn === 'string') {
      btn = document.querySelector(selectorOrFn);
    } else if (typeof selectorOrFn === 'function') {
      btn = selectorOrFn();
    }
    if (btn && !btn.dataset.jobRecorderAttached) {
      btn.dataset.jobRecorderAttached = "true";
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const job = getJobDetailsForCurrentSite();
          if (job) sendJobApplication(job);
        }, 1000);
      });
    }
  }
  if (window.location.hostname.includes('smartapply.indeed')) {
    // First, observe body for the addition of .ia-BasePage
    const basePageObserver = new MutationObserver(() => {
      const basePage = document.querySelector('.ia-BasePage');
      if (basePage) {
        // Once found, attach the real observer and disconnect this one
        const observer = new MutationObserver(attach);
        observer.observe(basePage, { childList: true, subtree: true });
        attach();
        basePageObserver.disconnect();
      }
    });
    basePageObserver.observe(document.body, { childList: true, subtree: true });
    // Also, try immediately in case it's already present
    if (document.querySelector('.ia-BasePage')) {
      const observer = new MutationObserver(attach);
      observer.observe(document.querySelector('.ia-BasePage'), { childList: true, subtree: true });
      attach();
      basePageObserver.disconnect();
    }
  } else {
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Attach extractors to specific sites
if (window.location.hostname.includes('linkedin.com')) {
  window.attachLinkedInSubmit();
  //observeAndAttach('button[aria-label="Submit application"], button[data-live-test-easy-apply-submit-button]');
} else if (window.location.hostname.includes('indeed.com')) {
  // id ="applyButtonLinkContainer" is Apply on company site
  window.attachIndeedSubmit();
  //observeAndAttach('#applyButtonLinkContainer');
} else if (window.location.hostname.includes('workday')) {
  observeAndAttach('button[aria-label="Submit Application"], button[aria-label="Apply Now"]');
} else if (window.location.hostname.includes('monster')) {
  window.attachMonsterSubmit();
} else if (window.location.hostname.includes('glassdoor')) {
  observeAndAttach('button[data-test="apply-button"], button[data-test="apply-now-button"]');
} else if (window.location.hostname.includes('lever')) {
  observeAndAttach('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');
} else if (window.location.hostname.includes('greenhouse')) {
  observeAndAttach('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');
} else if (window.location.hostname.includes('vector')) {
  observeAndAttach('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');
} else if (window.location.hostname.includes('smartapply.indeed')) {
  observeAndAttach(() => {
      const reviewContainer = document.querySelector('.ia-BasePage.ia-Review');
      if (!reviewContainer) return null;
      const buttons = reviewContainer.querySelectorAll('button');
      return buttons.length ? buttons[buttons.length - 1] : null;
    });
} else {
  // For other sites do not trigger on any buttons
}


function getJobDetailsForCurrentSite() {
  const hostname = window.location.hostname;
  if (hostname.includes('linkedin.com')) {
    return window.extractLinkedInDetails();
  } else if (hostname.includes('indeed.com')) {
    return window.extractIndeedDetails();
  } else if (hostname.includes('workday')) {
    return window.extractWorkdayDetails();
  } else if (hostname.includes('monster')) {
    return window.extractMonsterDetails();
  } else if (hostname.includes('glassdoor')) {
    return window.extractGlassdoorDetails();
  } else if (hostname.includes('lever')) {
    return window.extractLeverDetails();
  } else if (hostname.includes('greenhouse')) {
    return window.extractGreenhouseDetails();
  } else if (hostname.includes('vector')) {
    return window.extractVectorDetails();
  } else if (hostname.includes('smartapply.indeed')) {
    return window.extractSmartApplyIndeedDetails();
  } else {
    return window.extractGeneralDetails();
  }
}
