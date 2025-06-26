// contentScript.js

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

function setupLinkedInListener() {
  const applyButton = document.querySelector('button.jobs-apply-button, button[data-control-name="jobdetails_topcard_inapply"]');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      setTimeout(() => {
        const job = getLinkedInJobInfo();
        sendJobApplication(job);
      }, 1000); // Wait for any async UI changes
    });
  }
}

function setupIndeedListener() {
  const applyButton = document.querySelector('button.ia-IndeedApplyButton, button[aria-label*="Apply"]');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      setTimeout(() => {
        const job = getIndeedJobInfo();
        sendJobApplication(job);
      }, 1000);
    });
  }
}

if (window.location.hostname.includes('linkedin.com')) {
  setupLinkedInListener();
}
if (window.location.hostname.includes('indeed.com')) {
  setupIndeedListener();
}