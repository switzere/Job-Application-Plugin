function extractMonsterDetails() {
  const jobTitleElement = document.querySelector('[data-testid="jobTitle"]');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    const companyInfoElement = document.querySelector('[data-testid="company"]');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Info Not Found';

    const locationElement = document.querySelector('[data-testid="jobDetailLocation"]');
    const location = locationElement ? locationElement.innerText : 'Location Not Found';

    const datePostedElement = document.querySelector('[data-testid="jobDetailDateRecency"]');
    const datePosted = datePostedElement ? datePostedElement.innerText : 'Date Posted Not Found';

    const jobDescriptionElement = document.querySelector('[data-testid="svx-description-container-inner"]');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription,
    jobDescRaw: jobDescRaw,
    postingSource: 'Monster'
  };
}

window.extractMonsterDetails = extractMonsterDetails;