export function extractGeneralDetails() {
  const websiteName = document.title;
  const mainText = document.body.innerText;

  return {
    jobTitle: websiteName,
    companyInfo: websiteName,
    url: window.location.href,
    jobDescription: mainText,
    postingSource: 'Other'
  };
}

window.extractGeneralDetails = extractGeneralDetails;