function extractLinkedInDetails() {
    // TODO: Implement extraction logic for LinkedIn
    const jobTitleElement = document.querySelector('.job-details-jobs-unified-top-card__job-title h1 a');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';
    
    // Extract company information from the second span element within the div with class "ia-JobHeader-information"
    const companyInfoElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    // Job Posting info ia-JobDescription
    const jobDescriptionElement = document.querySelector('#job-details');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    // Location info
    const extraDescriptionElement = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
    // split the location info to get the location "Toronto, ON · 2 days ago · Over 100 people clicked apply"
    // split on first ·
    const extraDescription = extraDescriptionElement ? extraDescriptionElement.innerText.split(" · ") : ['Location Info Not Found', 'Post Date Not Found'];
    const locationInfo = extraDescription[0] ? extraDescription[0] : 'Location Info Not Found';
    const postDate = extraDescription[1] ? extraDescription[1] : 'Post Date Not Found';

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        jobDescRaw: jobDescRaw,
        postingSource: 'LinkedIn',
        locationInfo: locationInfo,
        postDate: postDate
      };
}

function attachLinkedInSubmit(){
    let lastUrl = location.href;

    function attach() {
        const btns = document.querySelectorAll(
            'button[role="link"][aria-label^="Apply to"][data-live-test-job-apply-button], ' +
            'button[aria-label="Submit application"]'
        );
        //https://www.linkedin.com/jobs/view/4335137444/?trk=eml-email_job_alert_digest_01-primary_job_list-0-jobcard_body_14597860204&refId=MgQAI%2F0FGo20ppO3ypPCTw%3D%3D&trackingId=GZHv2StEwHQ00jaRbTs1oA%3D%3D
        //job links like this seem to be all dynamic so it can't find anything unless I webscrape based on words not html

        for (const btn of btns) {
            if (btn && !btn.dataset.jobRecorderAttached) {
                btn.dataset.jobRecorderAttached = "true";
                btn.addEventListener('click', () => {
                    setTimeout(() => {
                    const job = extractLinkedInDetails();
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

window.extractLinkedInDetails = extractLinkedInDetails;

window.attachLinkedInSubmit = attachLinkedInSubmit;