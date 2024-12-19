export function extractSmartApplyIndeedDetails() {
    // Extract job title from the element with id "ia-JobInfoCard-header-title"
    const jobTitleElement = document.querySelector('#ia-JobInfoCard-header-title');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';
  
    // Extract company information from the second span element within the div with class "ia-JobHeader-information"
    const companyInfoElement = document.querySelector('.ia-JobHeader-information span:nth-of-type(2)');
    let companyInfo = 'Company Info Not Found';
    let locationInfo = 'Location Info Not Found';
    if (companyInfoElement) {
      const compnayInfoSplit = companyInfoElement ? companyInfoElement.innerText.split(" - ") : 'Company Info Not Found';
      companyInfo = compnayInfoSplit[0];
      locationInfo = compnayInfoSplit[1];
    }
  
    // Job Posting info ia-JobDescription
    const jobDescriptionElement = document.querySelector('.ia-JobDescription');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
      jobTitle: jobTitle,
      companyInfo: companyInfo,
      url: window.location.href,
      jobDescription: jobDescription,
      jobDescRaw: jobDescRaw,
      locationInfo: locationInfo,
      postingSource: 'Indeed'
    };
  }