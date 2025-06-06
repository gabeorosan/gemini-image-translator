document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const targetLanguageInput = document.getElementById('targetLanguage');
  const geminiModelSelect = document.getElementById('geminiModel');
  const captureBtn = document.getElementById('captureBtn');

  const status = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['geminiApiKey', 'targetLanguage', 'geminiModel'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
    if (result.targetLanguage) {
      targetLanguageInput.value = result.targetLanguage;
    }
    if (result.geminiModel) {
      geminiModelSelect.value = result.geminiModel;
    }
  });

  // Save API key when changed
  apiKeyInput.addEventListener('change', function() {
    chrome.storage.sync.set({geminiApiKey: apiKeyInput.value});
  });

  // Save target language when changed
  targetLanguageInput.addEventListener('change', function() {
    chrome.storage.sync.set({targetLanguage: targetLanguageInput.value});
  });

  // Save gemini model when changed
  geminiModelSelect.addEventListener('change', function() {
    chrome.storage.sync.set({geminiModel: geminiModelSelect.value});
  });

  // Capture button click
  captureBtn.addEventListener('click', function() {
    if (!apiKeyInput.value.trim()) {
      updateStatus('Please enter your Gemini API key first', 'error');
      return;
    }

    updateStatus('Activating capture mode...', 'success');
    
    // Close popup and activate capture mode
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        updateStatus('Error: ' + chrome.runtime.lastError.message, 'error');
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startCapture',
        apiKey: apiKeyInput.value,
        targetLanguage: targetLanguageInput.value,
        geminiModel: geminiModelSelect.value
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Message sending failed:', chrome.runtime.lastError);
          updateStatus('Failed to activate capture mode. Try refreshing the page.', 'error');
        } else {
          window.close();
        }
      });
    });
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