document.addEventListener('DOMContentLoaded', () => {
  const jobDetailsTable = document.getElementById('job-details');
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const downloadButton = document.getElementById('downloadButton');
  const jobChartCanvas = document.getElementById('jobChart').getContext('2d');

  // Load job details from local storage and display them
  chrome.storage.local.get(['jobDetails'], (result) => {
    const details = result.jobDetails || [];
    displayJobDetails(details);
    createJobChart(details);
  });

  // Display job details in a table
  function displayJobDetails(details) {
    jobDetailsTable.innerHTML = '';
    if (details.length === 0) {
      jobDetailsTable.innerHTML = '<p>No job applications recorded.</p>';
    } else {
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      // Create table headers
      thead.innerHTML = `
        <tr>
          <th style="width: 15%;">Job Title</th>
          <th style="width: 15%;">Company Info</th>
          <th style="width: 10%;">URL</th>
          <th style="width: 20%;">Job Description</th>
          <th style="width: 10%;">Posting Source</th>
          <th style="width: 10%;">Timestamp</th>
          <th style="width: 10%;">Notes</th>
          <th style="width: 10%;">Stage</th>
          <th style="width: 10%;">Actions</th>
        </tr>
      `;

      // Create table rows
      details.forEach((detail, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td contenteditable="true" class="editable baseCol" data-field="jobTitle">${detail.jobTitle || 'N/A'}</td>
          <td contenteditable="true" class="editable baseCol" data-field="companyInfo">${detail.companyInfo || 'N/A'}</td>
          <td class="baseCol short-url"><a href="${detail.url}" target="_blank" title="${detail.url}">${truncateText(detail.url, 30) || 'N/A'}</a></td>
          <td contenteditable="true" class="editable baseCol desc" data-field="jobDescription" title="${detail.jobDescription || 'N/A'}">${detail.jobDescription || 'N/A'}</td>
          <td contenteditable="true" class="editable baseCol" data-field="postingSource">${detail.postingSource || 'N/A'}</td>
          <td class="baseCol">${detail.timestamp || 'N/A'}</td>
          <td contenteditable="true" class="editable baseCol" data-field="notes">${detail.notes || 'N/A'}</td>
          <td>
            <select class="stage-select" data-index="${index}">
              <option value="Applied" ${detail.stage === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Rejected" ${detail.stage === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="Interview" ${detail.stage === 'Interview' ? 'selected' : ''}>Interview</option>
            </select>
          </td>
          <td><button class="delete-button" data-index="${index}">Delete</button></td>
        `;
        tbody.appendChild(row);
      });

      jobDetailsTable.appendChild(thead);
      jobDetailsTable.appendChild(tbody);

      // Add event listeners to editable fields
      document.querySelectorAll('.editable').forEach(cell => {
        cell.addEventListener('input', handleCellEdit);
      });

      // Add event listeners to stage dropdowns
      document.querySelectorAll('.stage-select').forEach(select => {
        select.addEventListener('change', handleStageChange);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDeleteRow);
      });
    }
  }

  // Handle cell edit
  function handleCellEdit(event) {
    const cell = event.target;
    const field = cell.getAttribute('data-field');
    const rowIndex = cell.parentElement.rowIndex - 1; // Adjust for header row

    chrome.storage.local.get(['jobDetails'], (result) => {
      const details = result.jobDetails || [];
      details[rowIndex][field] = cell.textContent;
      chrome.storage.local.set({ jobDetails: details });
    });
  }

  // Handle stage change
  function handleStageChange(event) {
    const select = event.target;
    const rowIndex = select.getAttribute('data-index');

    chrome.storage.local.get(['jobDetails'], (result) => {
      const details = result.jobDetails || [];
      details[rowIndex].stage = select.value;
      chrome.storage.local.set({ jobDetails: details });
    });
  }

  // Handle delete row
  function handleDeleteRow(event) {
    const button = event.target;
    const rowIndex = button.getAttribute('data-index');

    chrome.storage.local.get(['jobDetails'], (result) => {
      let details = result.jobDetails || [];
      details.splice(rowIndex, 1); // Remove the row from the array
      chrome.storage.local.set({ jobDetails: details }, () => {
        displayJobDetails(details); // Refresh the table
        createJobChart(details); // Refresh the chart
      });
    });
  }

  // Handle file upload
  uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const details = JSON.parse(content);
        chrome.storage.local.set({ jobDetails: details }, () => {
          displayJobDetails(details);
          createJobChart(details);
        });
      };
      reader.readAsText(file);
    }
  });

  // Handle file download
  downloadButton.addEventListener('click', () => {
    chrome.storage.local.get(['jobDetails'], (result) => {
      const details = result.jobDetails || [];
      const content = JSON.stringify(details, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job_applications.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Utility function to truncate text
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  // Create a bar chart using Chart.js
  function createJobChart(details) {
    const stages = details.map(detail => detail.stage);
    const stageCounts = stages.reduce((counts, stage) => {
      counts[stage] = (counts[stage] || 0) + 1;
      return counts;
    }, {});

    const chartData = {
      labels: Object.keys(stageCounts),
      datasets: [{
        label: 'Number of Applications',
        data: Object.values(stageCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    new Chart(jobChartCanvas, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});