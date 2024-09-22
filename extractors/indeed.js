export function extractIndeedDetails() {
    const jobTitleElement = document.querySelector('.jobsearch-JobInfoHeader-title-container');
    let jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    //if " - job post" in jobTitle, remove it
    const jobTitleIndex = jobTitle.indexOf('\n- job post');
    if (jobTitleIndex !== -1) {
        console.log(jobTitle)
        jobTitle = jobTitle.substring(0, jobTitleIndex);
    }

    const locationElement = document.querySelector('[data-testid="job-location"]');
    const location = locationElement ? locationElement.innerText : 'Location Not Found';

    const companyInfoElement = document.querySelector('[data-testid="jobsearch-CompanyInfoContainer"]');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    const jobDescriptionElement = document.querySelector('#jobDescriptionText');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        postingSource: 'Indeed'
      };
  }