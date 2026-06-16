function extractBambooHRDetails() {
    // TODO: Implement extraction logic for BambooHR
    const jobTitleElement = document.querySelector('[data-fabric-component="Headline"]');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';
    
    // Extract company information from the second span element within the div with class "ia-JobHeader-information"
    // https://inuvialuit.bamboohr.com/careers/351 get company name from url
    // <div class="fabric-95l02p-description">IRC - Nanilavut Initiative - Inuvik, Northwest Territories</div>
    // company name and location
    const urlParts = window.location.href.split('/');
    const companyFromUrl = urlParts.length > 2 ? urlParts[2] : 'Company Info Not Found';
    const companyNameFromUrl = companyFromUrl.split('.')[0]; // Get the first part before any dot
    const companyInfo = companyNameFromUrl ? companyNameFromUrl : 'Company Info Not Found';

    // Job Posting info ia-JobDescription
    const jobDescriptionElement = document.querySelector('.BambooRichText');
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
        postingSource: 'BambooHR',
        locationInfo: locationInfo,
        postDate: postDate
      };
}

function attachBambooHRSubmit(){
    let lastUrl = location.href;

    function attach() {
        // submit button: data-bi-id="careers-site-apply-button"
        const btns = document.querySelectorAll(
            'button[data-bi-id="careers-site-apply-button"]'
        );

        for (const btn of btns) {
            if (btn && !btn.dataset.jobRecorderAttached) {
                btn.dataset.jobRecorderAttached = "true";
                btn.addEventListener('click', () => {

                    const job = extractBambooHRDetails();
                    if (job ) sendJobApplication(job);

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

window.extractBambooHRDetails = extractBambooHRDetails;

window.attachBambooHRSubmit = attachBambooHRSubmit;