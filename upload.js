document.getElementById('uploadExtractor').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const hostname = document.getElementById('hostname').value.trim();
  
    if (file && hostname) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const scriptContent = e.target.result;
  
        // Save the script content and hostname to chrome.storage.local
        chrome.storage.local.set({ [hostname]: scriptContent }, () => {
          document.getElementById('statusMessage').textContent = 'Extractor uploaded successfully!';
        });
      };
      reader.readAsText(file);
    } else {
      document.getElementById('statusMessage').textContent = 'Please provide a hostname and select a file.';
    }
  });