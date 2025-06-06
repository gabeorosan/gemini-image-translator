document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const targetLanguageSelect = document.getElementById('targetLanguage');
  const captureBtn = document.getElementById('captureBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const status = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['geminiApiKey', 'targetLanguage'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
    if (result.targetLanguage) {
      targetLanguageSelect.value = result.targetLanguage;
    }
  });

  // Save API key when changed
  apiKeyInput.addEventListener('change', function() {
    chrome.storage.sync.set({geminiApiKey: apiKeyInput.value});
  });

  // Save target language when changed
  targetLanguageSelect.addEventListener('change', function() {
    chrome.storage.sync.set({targetLanguage: targetLanguageSelect.value});
  });

  // Capture button click
  captureBtn.addEventListener('click', function() {
    if (!apiKeyInput.value.trim()) {
      updateStatus('Please enter your Gemini API key first', 'error');
      return;
    }

    updateStatus('Click and drag to select area to translate...', 'success');
    
    // Close popup and activate capture mode
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startCapture',
        apiKey: apiKeyInput.value,
        targetLanguage: targetLanguageSelect.value
      });
      window.close();
    });
  });

  // Upload button click
  uploadBtn.addEventListener('click', function() {
    if (!apiKeyInput.value.trim()) {
      updateStatus('Please enter your Gemini API key first', 'error');
      return;
    }
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      updateStatus('Processing image...', 'success');
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Send to background script for processing
        chrome.runtime.sendMessage({
          action: 'translateImage',
          imageData: imageData,
          apiKey: apiKeyInput.value,
          targetLanguage: targetLanguageSelect.value
        }, function(response) {
          if (response.success) {
            showTranslationResult(response.translation);
          } else {
            updateStatus('Error: ' + response.error, 'error');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  });

  function updateStatus(message, type = '') {
    status.textContent = message;
    status.className = 'status ' + type;
  }

  function showTranslationResult(translation) {
    // Create a new window/tab to show the translation result
    chrome.tabs.create({
      url: chrome.runtime.getURL('result.html') + '?translation=' + encodeURIComponent(translation)
    });
    window.close();
  }
});