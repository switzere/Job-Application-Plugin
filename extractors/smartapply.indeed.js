export function extractSmartApplyIndeedDetails() {
    // Extract job title from the element with id "ia-JobInfoCard-header-title"
    const jobTitleElement = document.querySelector('#ia-JobInfoCard-header-title');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';
  
    // Extract company information from the second span element within the div with class "ia-JobHeader-information"
    const companyInfoElement = document.querySelector('.ia-JobHeader-information span:nth-of-type(2)');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';
  
    // Job Posting info ia-JobDescription
    const jobDescriptionElement = document.querySelector('.ia-JobDescription');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
      jobTitle: jobTitle,
      companyInfo: companyInfo,
      url: window.location.href,
      jobDescription: jobDescription,
      postingSource: 'Indeed'
    };
  }