export function extractWorkdayDetails() {
    const jobTitleElement = document.querySelector('[data-automation-id="jobPostingHeader"]');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    const locationElement = document.querySelector('[data-automation-id="locations"]');
    const location = locationElement ? locationElement.innerText : 'Location Not Found';

    const fullTimeElement = document.querySelector('[data-automation-id="time"]');
    const fullTime = fullTimeElement ? fullTimeElement.innerText : 'Time Posted Not Found';

    const datePostedElement = document.querySelector('[data-automation-id="postedOn"]');
    const datePosted = datePostedElement ? datePostedElement.innerText : 'Date Posted Not Found';
    
    const requisitionElement = document.querySelector('[data-automation-id="requisitionId"]');
    const requisition = requisitionElement ? requisitionElement.innerText : 'Requisition Not Found';

    const companyInfoElement = document.querySelector('[data-automation-id="headerTitle"]');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    const jobDescriptionElement = document.querySelector('[data-automation-id="jobPostingDescription"]');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        postingSource: 'Workday',
        location: location,
        fullTime: fullTime,
        datePosted: datePosted,
        requisition: requisition
      };
  }

  window.extractWorkdayDetails = extractWorkdayDetails;