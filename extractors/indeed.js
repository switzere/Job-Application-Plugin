function extractIndeedDetails() {
    let jobTitleElement = document.querySelector('.jobsearch-JobInfoHeader-title-container');
    if (!jobTitleElement) {
        jobTitleElement = document.querySelector('[data-testid="jobDetailTitle"]');
    }
    let jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    //if " - job post" in jobTitle, remove it
    let jobTitleIndex = jobTitle.indexOf('\n- job post');
    if (jobTitleIndex !== -1) {
        console.log(jobTitle)
        jobTitle = jobTitle.substring(0, jobTitleIndex);
    }
//document.querySelector('[data-testid="job-location"]');
    const locationElement = document.querySelector('[data-testid="inlineHeader-companyLocation"]');
    const location = locationElement ? locationElement.innerText : 'Location Not Found';

    let companyInfoElement = document.querySelector('[data-testid="inlineHeader-companyName"]');
    if (!companyInfoElement) {
        companyInfoElement = document.querySelector('[data-testid="jobDetailSubtitle"]');
    }
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    let jobDescriptionElement = document.querySelector('#jobDescriptionText');
    if (!jobDescriptionElement) {
        jobDescriptionElement = document.querySelector('[data-testid="jobDetailDescription"]');
    }
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        jobDescRaw: jobDescRaw,
        locationInfo: location,
        postingSource: 'Indeed'
      };
}

function attachIndeedSubmit(){
    function attach() {
        const btn = document.querySelector('#applyButtonLinkContainer button, #applyButtonLinkContainer a');

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

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

}


window.extractIndeedDetails = extractIndeedDetails;

window.attachIndeedSubmit = attachIndeedSubmit;
