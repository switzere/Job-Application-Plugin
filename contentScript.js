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

console.log('Hostname:', window.location.hostname);

// Attach extractors to specific sites
if (window.location.hostname.includes('linkedin.com')) {
  window.attachLinkedInSubmit();
} else if (window.location.hostname.includes('smartapply.indeed')) {
  //window.attachSmartApplyIndeedSubmit();
  //done from indeed.com, could be done through SmartApply but not currently
} else if (window.location.hostname.includes('indeed.com')) {
  window.attachIndeedSubmit();
} else if (window.location.hostname.includes('workday')) {
  window.attachWorkdaySubmit();
} else if (window.location.hostname.includes('monster')) {
  window.attachMonsterSubmit();
} else if (window.location.hostname.includes('glassdoor')) {
  window.attachGlassdoorSubmit();
} else if (window.location.hostname.includes('lever')) {
  window.attachLeverSubmit();
} else if (window.location.hostname.includes('greenhouse')) {
  window.attachGreenhouseSubmit();
} else if (window.location.hostname.includes('vector')) {
  window.attachVectorSubmit();
} else {
  // For other sites do not trigger on any buttons
}
