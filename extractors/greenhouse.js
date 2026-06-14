function extractGreenhouseDetails() {
  // TODO: Implement extraction logic for Greenhouse
  const jobTitleElement = document.querySelector('.job__title');
  const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

  //fix company name
  //https://job-boards.greenhouse.io/geotab get company name from url
  const urlParts = window.location.pathname.split('/');
  const companyInfo = urlParts.length > 1 ? urlParts[1] : 'Company Not Found';

  const locationElement = document.querySelector('.job__location');
  const locationInfo = locationElement ? locationElement.innerText : 'Location Info Not Found';

  //fix post date
  const postDateElement = document.querySelector('.application--post-date');
  const postDate = postDateElement ? postDateElement.innerText : 'Post Date Not Found';

  const jobDescriptionElement = document.querySelector('.job__description body');
  const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
  const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';
  
  const payRange = document.querySelector('.pay-range');
  const payRangeInfo = payRange ? payRange.innerText : 'Pay Range Not Found';

  console.log(jobTitle)

  return {
      jobTitle: jobTitle,
      companyInfo: companyInfo,
      url: window.location.href,
      jobDescription: jobDescription,
      jobDescRaw: jobDescRaw,
      postingSource: 'Greenhouse',
      locationInfo: locationInfo,
      postDate: postDate
    };
}

function attachGreenhouseSubmit() {
  let lastUrl = location.href;
  console.log("Attaching Greenhouse submit listener to URL:", lastUrl);

  function attach() {
    //make btns selector for application--submit
    const btns = document.querySelectorAll('.application--submit');
    //const btns = document.querySelectorAll('button[data-automation="apply-button"], button[data-automation="apply-now-button"]');

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
  const observer = new MutationObserver(() => {
    setTimeout(() => {
        attach(); 
    }, 200);
  });
  observer.observe(document.body, { childList: true, subtree: true });

          // Observe URL changes (SPA navigation)
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            attach(); // Re-attach listeners for new job post
        }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });
}

window.extractGreenhouseDetails = extractGreenhouseDetails;

window.attachGreenhouseSubmit = attachGreenhouseSubmit;