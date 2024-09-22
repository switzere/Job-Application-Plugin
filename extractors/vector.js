export function extractVectorDetails() {
    const jobTitleElementAndCompany = document.querySelector('.jobDetail-headerIntro');

    // Extract the job title from the <h1> element
    const jobTitleElement = jobTitleElementAndCompany.querySelector('.u-mv--remove.u-textH2');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    // Extract the company name from the <strong> element
    const companyInfoElement = jobTitleElementAndCompany.querySelector('.text-primary.text-large');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Name Not Found';

    const jobDescriptionElement = document.querySelector('.job-body');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        postingSource: 'Vector'
    };

}
