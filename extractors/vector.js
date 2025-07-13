function extractVectorDetails() {
    const jobTitleElementAndCompany = document.querySelector('.jobDetail-headerIntro');

    // Extract the job title from the <h1> element
    const jobTitleElement = jobTitleElementAndCompany.querySelector('.u-mv--remove.u-textH2');
    const jobTitle = jobTitleElement ? jobTitleElement.innerText : 'Job Title Not Found';

    // Extract the company name from the <strong> element
    const companyInfoElement = jobTitleElementAndCompany.querySelector('.text-primary.text-large');
    const companyInfo = companyInfoElement ? companyInfoElement.innerText : 'Company Name Not Found';

    const jobDescriptionElement = document.querySelector('.job-body');
    const jobDescription = jobDescriptionElement ? jobDescriptionElement.innerHTML : 'Job Description Not Found';
    const jobDescRaw = jobDescriptionElement ? jobDescriptionElement.innerText : 'Job Description Not Found';

    const experienceElement = document.querySelector('.field_level_of_experience_value');
    const experience = experienceElement ? experienceElement.innerText : 'Experience Not Found';

    const degreeElement = document.querySelector('.field_minimum_degree_level_value');
    const degree = degreeElement ? degreeElement.innerText : 'Degree Not Found';

    const industryElement = document.querySelector('.field_job_industry_value');
    const industry = industryElement ? industryElement.innerText : 'Industry Not Found';

    const companySizeElement = document.querySelector('.field_company_size_value');
    const companySize = companySizeElement ? companySizeElement.innerText : 'Company Size Not Found';

    const locationElement = document.querySelector('.jobDetail-headerIntro').innerText.split('\n')[2];
    const locationInfo = locationElement ? locationElement : 'Location Info Not Found';


    return {
        jobTitle: jobTitle,
        companyInfo: companyInfo,
        url: window.location.href,
        jobDescription: jobDescription,
        jobDescRaw: jobDescRaw,
        locationInfo: locationInfo,
        experience: experience,
        degree: degree,
        industry: industry,
        companySize: companySize,
        postingSource: 'Vector'
    };

}

function attachVectorSubmit() {
    function attach() {
        const btns = document.querySelectorAll('#apply_button_job-details-sidebar, #apply_button_job-details-bottom');

        for (const btn of btns) {
            if (btn && !btn.dataset.jobRecorderAttached) {
                btn.dataset.jobRecorderAttached = "true";
                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        const job = extractVectorDetails();
                        if (job) sendJobApplication(job);
                    }, 1000);
                });
            }
        }
    }

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
}

window.extractVectorDetails = extractVectorDetails;

window.attachVectorSubmit = attachVectorSubmit;