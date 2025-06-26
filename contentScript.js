// contentScript.js
alert('Content script loaded!');

function getLinkedInJobInfo() {
  const jobTitle = document.querySelector('h1.topcard__title')?.innerText || '';
  const companyInfo = document.querySelector('.topcard__org-name-link, .topcard__flavor')?.innerText || '';
  const locationInfo = document.querySelector('.topcard__flavor--bullet')?.innerText || '';
  const jobDescription = document.querySelector('.description__text, .show-more-less-html__markup')?.innerText || '';
  const url = window.location.href;
  const postingSource = 'LinkedIn';
  const timestamp = new Date().toISOString();

  return { jobTitle, companyInfo, locationInfo, jobDescription, url, postingSource, timestamp, stage: 'Applied', notes: '' };
}

function getIndeedJobInfo() {
  const jobTitle = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText || '';
  const companyInfo = document.querySelector('.jobsearch-InlineCompanyRating div:first-child')?.innerText || '';
  const locationInfo = document.querySelector('.jobsearch-JobInfoHeader-subtitle div')?.innerText || '';
  const jobDescription = document.querySelector('#jobDescriptionText')?.innerText || '';
  const url = window.location.href;
  const postingSource = 'Indeed';
  const timestamp = new Date().toISOString();

  return { jobTitle, companyInfo, locationInfo, jobDescription, url, postingSource, timestamp, stage: 'Applied', notes: '' };
}

function sendJobApplication(job) {
  chrome.runtime.sendMessage({ type: 'NEW_JOB_APPLICATION', job });
}

function observeAndAttach(selector, getJobInfo) {
  function attach() {
    const btn = document.querySelector(selector);
    if (btn && !btn.dataset.jobRecorderAttached) {
      btn.dataset.jobRecorderAttached = "true";
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const job = getJobInfo();
            console.log(job)
          sendJobApplication(job);
        }, 1000);
      });
    }
  }
  // Initial attach
  attach();
  // Observe for dynamic changes
  const observer = new MutationObserver(attach);
  observer.observe(document.body, { childList: true, subtree: true });
}

// LinkedIn
if (window.location.hostname.includes('linkedin.com')) {
  // Only observe the true submit buttons in the modal
  observeAndAttach('button[aria-label="Submit application"], button[data-live-test-easy-apply-submit-button]', getLinkedInJobInfo);
}

// Indeed
if (window.location.hostname.includes('indeed.com')) {
  observeAndAttach('button.ia-IndeedApplyButton, button[aria-label*="Apply"]', getIndeedJobInfo);
}