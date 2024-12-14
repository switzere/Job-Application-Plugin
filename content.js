function createFloatingElement() {
    const floatingDiv = document.createElement('div');
    floatingDiv.id = 'floatingPopup';
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '10%';
    floatingDiv.style.right = '10%';
    floatingDiv.style.width = '300px';
    floatingDiv.style.height = '400px';
    floatingDiv.style.backgroundColor = 'white';
    floatingDiv.style.border = '1px solid #ccc';
    floatingDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    floatingDiv.style.zIndex = '10000';
    floatingDiv.style.padding = '20px';
    floatingDiv.style.overflow = 'auto';
    floatingDiv.style.display = 'none'; // Initially hidden
  
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.addEventListener('click', () => {
      floatingDiv.style.display = 'none';
    });
  
    floatingDiv.appendChild(closeButton);
  
    document.body.appendChild(floatingDiv);
  
    return floatingDiv;
  }
  
  const floatingDiv = createFloatingElement();
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'togglePopup') {
      floatingDiv.style.display = floatingDiv.style.display === 'none' ? 'block' : 'none';
      if (floatingDiv.style.display === 'block') {
        floatingDiv.innerHTML = '<h1 style="font-size: 2em; text-align: center;">CONTENT</h1>';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', () => {
          floatingDiv.style.display = 'none';
        });
        floatingDiv.appendChild(closeButton);
      }
    }
  });