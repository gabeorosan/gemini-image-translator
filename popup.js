document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const targetLanguageInput = document.getElementById('targetLanguage');
  const geminiModelSelect = document.getElementById('geminiModel');
  const captureBtn = document.getElementById('captureBtn');
  const customShortcutInput = document.getElementById('customShortcut');
  const changeShortcutBtn = document.getElementById('changeShortcut');
  const refreshModelsBtn = document.getElementById('refreshModels');
  const status = document.getElementById('status');

  // ---------- Init ----------

  loadAvailableModels().then(() => {
    chrome.storage.sync.get(['geminiApiKey', 'targetLanguage', 'geminiModel'], (result) => {
      if (result.geminiApiKey) apiKeyInput.value = result.geminiApiKey;
      if (result.targetLanguage) targetLanguageInput.value = result.targetLanguage;
      geminiModelSelect.value = result.geminiModel || 'gemini-3.0-flash-preview';
    });
  });

  chrome.commands.getAll((commands) => {
    const cmd = commands.find(c => c.name === 'capture-translate');
    customShortcutInput.value = cmd?.shortcut || 'Not set';
  });

  // ---------- Settings Persistence ----------

  apiKeyInput.addEventListener('change', () => {
    chrome.storage.sync.set({ geminiApiKey: apiKeyInput.value });
    if (apiKeyInput.value.trim()) loadAvailableModels();
  });

  targetLanguageInput.addEventListener('change', () => {
    chrome.storage.sync.set({ targetLanguage: targetLanguageInput.value });
  });

  geminiModelSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ geminiModel: geminiModelSelect.value });
  });

  // ---------- Shortcut ----------

  changeShortcutBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });

  // ---------- Refresh Models ----------

  refreshModelsBtn.addEventListener('click', () => {
    refreshModelsBtn.textContent = '⟳';
    refreshModelsBtn.disabled = true;

    loadAvailableModels()
      .then(() => {
        updateStatus('Models refreshed', 'success');
        setTimeout(() => updateStatus('Ready'), 2000);
      })
      .catch(() => {
        updateStatus('Failed to refresh models', 'error');
        setTimeout(() => updateStatus('Ready'), 3000);
      })
      .finally(() => {
        refreshModelsBtn.textContent = '↻';
        refreshModelsBtn.disabled = false;
      });
  });

  // ---------- Capture ----------

  captureBtn.addEventListener('click', () => {
    if (!apiKeyInput.value.trim()) {
      updateStatus('Please enter your API key first', 'error');
      return;
    }

    updateStatus('Activating capture…', 'success');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        updateStatus('Error: ' + chrome.runtime.lastError.message, 'error');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startCapture',
        apiKey: apiKeyInput.value,
        targetLanguage: targetLanguageInput.value,
        geminiModel: geminiModelSelect.value,
      }, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('Failed — try refreshing the page', 'error');
        } else {
          window.close();
        }
      });
    });
  });

  // ---------- Helpers ----------

  function updateStatus(message, type = '') {
    status.textContent = message;
    status.className = type;
  }

  async function loadAvailableModels() {
    populateDefaultModels();

    const result = await new Promise(resolve => {
      chrome.storage.sync.get(['geminiApiKey'], resolve);
    });

    if (!result.geminiApiKey) return;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${result.geminiApiKey}`
      );
      if (!response.ok) return;

      const data = await response.json();
      const compatible = (data.models || []).filter(m =>
        m.supportedGenerationMethods?.includes('generateContent') &&
        m.name.includes('gemini')
      );

      if (compatible.length > 0) populateModelsFromAPI(compatible);
    } catch {
      // Default models already populated
    }
  }

  function populateDefaultModels() {
    geminiModelSelect.innerHTML = '';
    const defaults = [
      'gemini-3.0-flash-preview',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];
    for (const value of defaults) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      geminiModelSelect.appendChild(opt);
    }
  }

  function populateModelsFromAPI(models) {
    geminiModelSelect.innerHTML = '';

    models.sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      if (an.includes('2.0') !== bn.includes('2.0')) return an.includes('2.0') ? -1 : 1;
      if (an.includes('1.5') !== bn.includes('1.5')) return an.includes('1.5') ? -1 : 1;
      return an.localeCompare(bn);
    });

    for (const model of models) {
      const opt = document.createElement('option');
      const name = model.name.replace('models/', '');
      opt.value = name;
      opt.textContent = name;
      geminiModelSelect.appendChild(opt);
    }
  }
});