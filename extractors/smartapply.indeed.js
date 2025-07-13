function extractSmartApplyIndeedDetails() {
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

function attachSmartApplyIndeedSubmit() {
    let reviewObserver = null;

    function attach() {
        const reviewContainer = document.querySelector('.ia-BasePage.ia-Review');
        if (!reviewContainer) return;

        const buttons = reviewContainer.querySelectorAll('button');
        if (!buttons.length) return;

        console.log('Smart Apply Indeed: Buttons found:', buttons.length, buttons);

        // Prefer button with text "Submit your application"
        let submitBtn = Array.from(buttons).find(btn => {
            const btnText = (btn.innerText || btn.textContent || '').trim().toLowerCase();
            return btnText === "submit your application";
        });

        // Fallback: last button
        if (!submitBtn) submitBtn = buttons[buttons.length - 1];

        if (submitBtn && !submitBtn.dataset.jobRecorderAttached) {
            submitBtn.dataset.jobRecorderAttached = "true";
            submitBtn.addEventListener('click', () => {
                setTimeout(() => {
                    const job = extractSmartApplyIndeedDetails();
                    if (job) sendJobApplication(job);
                }, 1000);
            });
        }
    }
    
// Always keep this observer running to catch new .ia-BasePage nodes
    const basePageObserver = new MutationObserver(() => {
        const basePage = document.querySelector('.ia-BasePage');
        if (basePage) {
            console.log('Smart Apply Indeed: .ia-BasePage found or updated!');
            // If we already have a reviewObserver, disconnect it before creating a new one
            if (reviewObserver) reviewObserver.disconnect();
            reviewObserver = new MutationObserver((mutationsList, observer) => {
                console.log('Smart Apply Indeed: .ia-BasePage updated!', mutationsList);
                for (const mutation of mutationsList) {
                    attach();
                }
            });
            reviewObserver.observe(basePage, { childList: true, subtree: true });
            attach();
        }
    });
    basePageObserver.observe(document.body, { childList: true, subtree: true });

    // Also, try immediately in case it's already present
    const basePageNow = document.querySelector('.ia-BasePage');
    if (basePageNow) {
        if (reviewObserver) reviewObserver.disconnect();
        reviewObserver = new MutationObserver((mutationsList, observer) => {
            console.log('Smart Apply Indeed: .ia-BasePage updated!', mutationsList);
            for (const mutation of mutationsList) {
                attach();
            }
        });
        reviewObserver.observe(basePageNow, { childList: true, subtree: true });
        attach();
    }
}

window.extractSmartApplyIndeedDetails = extractSmartApplyIndeedDetails;

window.attachSmartApplyIndeedSubmit = attachSmartApplyIndeedSubmit;