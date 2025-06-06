document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const targetLanguageInput = document.getElementById('targetLanguage');
  const geminiModelSelect = document.getElementById('geminiModel');
  const captureBtn = document.getElementById('captureBtn');
  const customShortcutInput = document.getElementById('customShortcut');
  const changeShortcutBtn = document.getElementById('changeShortcut');
  const refreshModelsBtn = document.getElementById('refreshModels');

  const status = document.getElementById('status');

  // Load available models and saved settings
  loadAvailableModels().then(() => {
    chrome.storage.sync.get(['geminiApiKey', 'targetLanguage', 'geminiModel'], function(result) {
      if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
      }
      if (result.targetLanguage) {
        targetLanguageInput.value = result.targetLanguage;
      }
      if (result.geminiModel) {
        geminiModelSelect.value = result.geminiModel;
      } else {
        geminiModelSelect.value = 'gemini-2.0-flash'; // Default model
      }
    });
  });

  // Save API key when changed
  apiKeyInput.addEventListener('change', function() {
    chrome.storage.sync.set({geminiApiKey: apiKeyInput.value});
    // Refresh models when API key changes
    if (apiKeyInput.value.trim()) {
      loadAvailableModels();
    }
  });

  // Save target language when changed
  targetLanguageInput.addEventListener('change', function() {
    chrome.storage.sync.set({targetLanguage: targetLanguageInput.value});
  });

  // Save gemini model when changed
  geminiModelSelect.addEventListener('change', function() {
    chrome.storage.sync.set({geminiModel: geminiModelSelect.value});
  });

  // Load current shortcut
  chrome.commands.getAll(function(commands) {
    const captureCommand = commands.find(cmd => cmd.name === 'capture-translate');
    if (captureCommand && captureCommand.shortcut) {
      customShortcutInput.value = captureCommand.shortcut;
    } else {
      customShortcutInput.value = 'Not set';
    }
  });

  // Handle shortcut change
  changeShortcutBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'chrome://extensions/shortcuts'
    });
  });

  // Handle refresh models
  refreshModelsBtn.addEventListener('click', function() {
    refreshModelsBtn.textContent = '⟳';
    refreshModelsBtn.disabled = true;
    
    loadAvailableModels().then(() => {
      refreshModelsBtn.textContent = '↻';
      refreshModelsBtn.disabled = false;
      updateStatus('Models refreshed', 'success');
      setTimeout(() => updateStatus(''), 2000);
    }).catch(() => {
      refreshModelsBtn.textContent = '↻';
      refreshModelsBtn.disabled = false;
      updateStatus('Failed to refresh models', 'error');
      setTimeout(() => updateStatus(''), 3000);
    });
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

  async function loadAvailableModels() {
    try {
      // First, populate with default models in case API call fails
      populateDefaultModels();
      
      // Try to get API key to fetch models
      const result = await new Promise(resolve => {
        chrome.storage.sync.get(['geminiApiKey'], resolve);
      });
      
      if (!result.geminiApiKey) {
        console.log('No API key available, using default models');
        return;
      }
      
      // Fetch available models from Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${result.geminiApiKey}`);
      
      if (!response.ok) {
        console.log('Failed to fetch models from API, using defaults');
        return;
      }
      
      const data = await response.json();
      
      if (data.models && data.models.length > 0) {
        // Filter for models that support generateContent and vision
        const compatibleModels = data.models.filter(model => {
          return model.supportedGenerationMethods && 
                 model.supportedGenerationMethods.includes('generateContent') &&
                 model.name.includes('gemini');
        });
        
        if (compatibleModels.length > 0) {
          populateModelsFromAPI(compatibleModels);
        }
      }
    } catch (error) {
      console.log('Error fetching models:', error);
      // Default models are already populated
    }
  }
  
  function populateDefaultModels() {
    geminiModelSelect.innerHTML = '';
    
    const defaultModels = [
      { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash' },
      { name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
      { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
      { name: 'gemini-1.0-pro-vision', displayName: 'Gemini 1.0 Pro Vision' }
    ];
    
    defaultModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model.name;
      option.textContent = model.displayName;
      geminiModelSelect.appendChild(option);
    });
  }
  
  function populateModelsFromAPI(models) {
    geminiModelSelect.innerHTML = '';
    
    // Sort models by name, with 2.0 models first, then 1.5, then others
    const sortedModels = models.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Prioritize 2.0 models
      if (aName.includes('2.0') && !bName.includes('2.0')) return -1;
      if (!aName.includes('2.0') && bName.includes('2.0')) return 1;
      
      // Then 1.5 models
      if (aName.includes('1.5') && !bName.includes('1.5')) return -1;
      if (!aName.includes('1.5') && bName.includes('1.5')) return 1;
      
      // Then alphabetical
      return aName.localeCompare(bName);
    });
    
    sortedModels.forEach(model => {
      const option = document.createElement('option');
      // Extract model name from full path (e.g., "models/gemini-2.0-flash" -> "gemini-2.0-flash")
      const modelName = model.name.replace('models/', '');
      option.value = modelName;
      
      // Create display name
      const displayName = modelName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      option.textContent = displayName;
      geminiModelSelect.appendChild(option);
    });
  }
});