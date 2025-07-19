document.addEventListener('DOMContentLoaded', () => {
  // Show jobs applied today
  const jobsTodayCount = document.getElementById('jobsTodayCount');
  chrome.storage.local.get(['jobDetails'], (result) => {
    const details = result.jobDetails || [];
    const today = new Date().toISOString().slice(0, 10);
    const count = details.filter(d => (d.timestamp || '').slice(0, 10) === today).length;
    jobsTodayCount.textContent = `Jobs applied today: ${count}`;
  });

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