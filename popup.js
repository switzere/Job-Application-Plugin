document.addEventListener('DOMContentLoaded', () => {
  // Show jobs applied today
//   const jobsTodayCount = document.getElementById('jobsTodayCount');
//   chrome.storage.local.get(['jobDetails'], (result) => {
//     const details = result['jobDetails'] || [];
//     const dates = details.map(detail => new Date(detail.timestamp));

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const jobsToday = dates.filter(date => date >= today).length;
//     jobsTodayCount.textContent = `Today: ${jobsToday}`;

//   });

  // Settings page link
  document.getElementById('settingsButton').addEventListener('click', () => {
    window.open('settings.html', '_blank');
  });

  // Charts/Graphs page link
  document.getElementById('chartsButton').addEventListener('click', () => {
    window.open('page.html', '_blank');
  });

    document.getElementById('openSidePanel').addEventListener('click', function() {
        chrome.runtime.sendMessage({action: 'open_side_panel'});
    });

});