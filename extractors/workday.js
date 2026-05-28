function extractWorkdayDetails() {
    const jobTitleElement = document.querySelector('[data-automation-id="jobPostingHeader"]');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    const locationElement = document.querySelector('[data-automation-id="locations"] dd');
    const location = locationElement?.textContent?.trim() || 'Location Not Found';

    // const fullTimeElement = document.querySelector('[data-automation-id="time"]');
    // const fullTime = fullTimeElement ? fullTimeElement.innerText : 'Time Posted Not Found';

    // const datePostedElement = document.querySelector('[data-automation-id="postedOn"]');
    // const datePosted = datePostedElement ? datePostedElement.innerText : 'Date Posted Not Found';
    
    const requisitionElement = document.querySelector('[data-automation-id="requisitionId"]');
    const requisition = requisitionElement ? requisitionElement.innerText : 'Requisition Not Found';

    const companyInfoElement = document.querySelector('[data-automation-id="headerTitle"]');
    const companyInfo =
    companyInfoElement?.innerText?.trim()
        ? companyInfoElement.innerText.trim()
        : window.location.pathname.split('/').filter(Boolean)[0] || 'Company Info Not Found';

    const jobDescriptionElement = document.querySelector('[data-automation-id="jobPostingDescription"]');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    //<script type="application/ld+json"> could be useful

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        jobDescRaw: jobDescRaw,
        postingSource: 'Workday',
        locationInfo: location,
        requisition: requisition
      };
  }

function attachWorkdaySubmit() {
    let lastUrl = location.href;

    function attach() {
        const btn = document.querySelector(
            'button[aria-label="Submit Application"], button[aria-label="Apply Now"], ' +
            'a[role="button"][data-uxi-element-id="Apply_adventureButton"], ' +
            'a[role="button"][data-uxi-widget-type="adventureButton"]'
        );

        if (btn && !btn.dataset.jobRecorderAttached) {
            btn.dataset.jobRecorderAttached = "true";
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const job = extractWorkdayDetails(); // Direct call
                    if (job) sendJobApplication(job);
                }, 1000);
            });
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

window.extractWorkdayDetails = extractWorkdayDetails;

window.attachWorkdaySubmit = attachWorkdaySubmit;