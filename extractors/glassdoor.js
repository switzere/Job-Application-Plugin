function extractGlassdoorDetails() {
  // TODO: Implement extraction logic for Glassdoor
  return {
    jobTitle: jobTitle,
    companyInfo: companyInfo,
    url: window.location.href,
    jobDescription: jobDescription
  };
}

window.extractGlassdoorDetails = extractGlassdoorDetails;