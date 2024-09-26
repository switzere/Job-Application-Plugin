export function extractLeverDetails() {
  // TODO: Implement extraction logic for Lever
  
  // Select the <h2> element within the <div class="posting-headline">
  const jobTitleElement = document.querySelector('.posting-headline h2');
  // Get the text content of the <h2> element
  const jobTitle = jobTitleElement.textContent.trim();

  const companyInfoElement = document.title
  const companyInfo = companyInfoElement ? companyInfoElement : 'Company Info Not Found';

  const jobDescriptionElement = document.querySelector('[data-qa="job-description"]');
  const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

  const locationElement = document.querySelector('.location');
  const location = locationElement ? locationElement.innerText : 'Location Not Found';

  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription,
    postingSource: 'Lever'
  };
}