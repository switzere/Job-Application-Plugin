function extractLinkedInDetails() {
    // TODO: Implement extraction logic for LinkedIn
    const jobTitleElement = document.querySelector('.job-details-jobs-unified-top-card__job-title');
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
    const extraDescription = extraDescriptionElement.innerText.split(" · ");
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

  window.extractLinkedInDetails = extractLinkedInDetails;