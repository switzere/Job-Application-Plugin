document.addEventListener('DOMContentLoaded', () => {
  const jobDetailsDiv = document.getElementById('job-details');
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const downloadButton = document.getElementById('downloadButton');

  // Load job details from local storage and display them
  chrome.storage.local.get(['jobDetails'], (result) => {
    const details = result.jobDetails || [];
    displayJobDetails(details);
  });

  // Display job details
  function displayJobDetails(details) {
    jobDetailsDiv.innerHTML = '';
    if (details.length === 0) {
      jobDetailsDiv.innerHTML = '<p>No job applications recorded.</p>';
    } else {
      details.forEach((detail, index) => {
        const detailDiv = document.createElement('div');
        detailDiv.innerHTML = `
          <h2>Job Application ${index + 1}</h2>
          <p><strong>Job Title:</strong> ${detail.jobTitle || 'N/A'}</p>
          <p><strong>Company Info:</strong> ${detail.companyInfo || 'N/A'}</p>
          <p><strong>URL:</strong> ${detail.url || 'N/A'}</p>
          <p><strong>Job Description:</strong> ${detail.jobDescription || 'N/A'}</p>
          <p><strong>Posting Source:</strong> ${detail.postingSource || 'N/A'}</p>
          <p><strong>Timestamp:</strong> ${detail.timestamp || 'N/A'}</p>
          <p><strong>Notes:</strong> ${detail.notes || 'N/A'}</p>
          <p><strong>Stage:</strong> ${detail.stage || 'N/A'}</p>
        `;
        jobDetailsDiv.appendChild(detailDiv);
      });
    }
  }

  // Handle file upload
  uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const details = csvToJson(content);
        chrome.storage.local.set({ jobDetails: details }, () => {
          displayJobDetails(details);
        });
      };
      reader.readAsText(file);
    }
  });

  // Handle file download
  downloadButton.addEventListener('click', () => {
    chrome.storage.local.get(['jobDetails'], (result) => {
      const details = result.jobDetails || [];
      const content = jsonToCsv(details);
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job_applications.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Convert CSV to JSON
  function csvToJson(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  }

  // Convert JSON to CSV
  function jsonToCsv(json) {
    if (json.length === 0) return '';

    const headers = Object.keys(json[0]);
    const csv = [headers.join(',')];

    json.forEach((row) => {
      const values = headers.map((header) => row[header]);
      csv.push(values.join(','));
    });

    return csv.join('\n');
  }
});