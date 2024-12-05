document.getElementById('uploadExtractor').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const scriptContent = e.target.result;
      const scriptBlob = new Blob([scriptContent], { type: 'application/javascript' });
      const scriptURL = URL.createObjectURL(scriptBlob);

      // Dynamically import the uploaded script
      import(scriptURL).then((module) => {
        const extractionFunction = module[Object.keys(module)[0]];
        // Store the extraction function for later use
        window.customExtractor = extractionFunction;
        document.getElementById('statusMessage').textContent = 'Extractor uploaded successfully!';
      }).catch((error) => {
        console.error('Failed to load script:', error);
        document.getElementById('statusMessage').textContent = 'Failed to upload extractor.';
      });
    };
    reader.readAsText(file);
  }
});