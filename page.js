document.addEventListener('DOMContentLoaded', () => {
  const jobDetailsTable = document.getElementById('job-details');
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const downloadButton = document.getElementById('downloadButton');
  const refreshButton = document.getElementById('refreshButton');
  const jobChartCanvas = document.getElementById('jobChart').getContext('2d');
  const dateChartCanvas = document.getElementById('dateChart').getContext('2d');
  const sourceChartCanvas = document.getElementById('sourceChart').getContext('2d');
  const totalJobsCount = document.getElementById('totalJobsCount');
  const jobsThisWeekCount = document.getElementById('jobsThisWeekCount');


  let jobChartInstance;
  let dateChartInstance;
  let sourceChartInstance;

  // Load job details from local storage and display them
  chrome.storage.local.get(['jobDetails'], (result) => {
    const details = result.jobDetails || [];
    displayJobDetails(details);
    createJobChart(details);
    createDateChart(details);
    createSourceChart(details);
    updateCounts(details);
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
              <option value="Interview 1" ${detail.stage === 'Interview 1' ? 'selected' : ''}>Interview 1</option>
              <option value="Interview 2" ${detail.stage === 'Interview 2' ? 'selected' : ''}>Interview 2</option>
              <option value="Ghosted" ${detail.stage === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
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
      chrome.storage.local.set({ jobDetails: details }, () => {
        displayJobDetails(details); // Refresh the table
        // createJobChart(details); // Refresh the chart
        // createDateChart(details); // Refresh the date chart
        // createSourceChart(details); // Refresh the source chart
      });
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
        // createJobChart(details); // Refresh the chart
        // createDateChart(details); // Refresh the date chart
        // createSourceChart(details); // Refresh the source chart
        updateCounts(details); // Update counts
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
          displayJobDetails(details); // Refresh the table
          createJobChart(details); // Refresh the chart
          createDateChart(details); // Refresh the date chart
          createSourceChart(details); // Refresh the source chart
          updateCounts(details); // Update counts
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

  // Handle refresh button
  refreshButton.addEventListener('click', () => {
    chrome.storage.local.get(['jobDetails'], (result) => {
      const details = result.jobDetails || [];
      createJobChart(details); // Refresh the chart
      createDateChart(details); // Refresh the date chart
      createSourceChart(details); // Refresh the source chart
      updateCounts(details); // Update counts
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
    if (jobChartInstance) {
      jobChartInstance.destroy();
    }

    const stages = details.map(detail => detail.stage);
    const stageCounts = stages.reduce((counts, stage) => {
      counts[stage] = (counts[stage] || 0) + 1;
      return counts;
    }, {});

    const stageOrder = ['Applied', 'Interview 1', 'Interview 2', 'Rejected', 'Ghosted'];
    const orderedStageCounts = stageOrder.map(stage => stageCounts[stage] || 0);

    const chartData = {
      labels: stageOrder,
      datasets: [{
        label: 'Number of Applications',
        data: orderedStageCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    jobChartInstance = new Chart(jobChartCanvas, {
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

// Create a line chart of job applications by date
function createDateChart(details) {
  if (dateChartInstance) {
    dateChartInstance.destroy();
  }

  const dates = details.map(detail => new Date(detail.timestamp));
  const dateCounts = dates.reduce((counts, date) => {
    const dateString = date.toISOString().split('T')[0];
    counts[dateString] = (counts[dateString] || 0) + 1;
    return counts;
  }, {});

  // Calculate cumulative totals
  const cumulativeCounts = [];
  let cumulativeTotal = 0;
  Object.keys(dateCounts).forEach(date => {
    cumulativeTotal += dateCounts[date];
    cumulativeCounts.push(cumulativeTotal);
  });

  const chartData = {
    labels: Object.keys(dateCounts),
    datasets: [{
      label: 'Cumulative Applications by Date',
      data: cumulativeCounts,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
      fill: false
    }]
  };

  dateChartInstance = new Chart(dateChartCanvas, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

  // Create a pie chart of job applications by posting source
  function createSourceChart(details) {
    if (sourceChartInstance) {
      sourceChartInstance.destroy();
    }

    const sources = details.map(detail => detail.postingSource);
    const sourceCounts = sources.reduce((counts, source) => {
      counts[source] = (counts[source] || 0) + 1;
      return counts;
    }, {});

    const chartData = {
      labels: Object.keys(sourceCounts),
      datasets: [{
        label: 'Applications by Source',
        data: Object.values(sourceCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    sourceChartInstance = new Chart(sourceChartCanvas, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right' // Position the legend on the right side
          }
        }
      }
    });
  }

  // Update counts
  function updateCounts(details) {
    // Update total jobs count
    totalJobsCount.textContent = `Total Jobs: ${details.length}`;

    // Update jobs this week count
    const dates = details.map(detail => new Date(detail.timestamp));
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const jobsThisWeek = dates.filter(date => date >= oneWeekAgo).length;
    jobsThisWeekCount.textContent = `This Week: ${jobsThisWeek}`;
  }
});