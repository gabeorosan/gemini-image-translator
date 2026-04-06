// Content script for Gemini Image Translator

let isCapturing = false;
let captureOverlay = null;
let startX, startY, endX, endY;
let apiKey, targetLanguage, geminiModel;
let translationPosition = null;

// Track active drag handlers for cleanup
const activeDragCleanups = [];

console.log('Gemini Image Translator content script loaded');

// Listen for messages from popup / background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startCapture') {
    apiKey = request.apiKey;
    targetLanguage = request.targetLanguage;
    geminiModel = request.geminiModel;
    startScreenCapture();
    sendResponse({ success: true });
  } else if (request.action === 'showTranslation') {
    showTranslationResult(request.translation, request.imageData);
    sendResponse({ success: true });
  }
  return true;
});

// ---------- Screen Capture ----------

function startScreenCapture() {
  if (isCapturing) return;

  // Clean up any orphaned overlay
  const staleOverlay = document.getElementById('gemini-capture-overlay');
  if (staleOverlay) staleOverlay.remove();

  isCapturing = true;
  createCaptureOverlay();

  document.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseup', onMouseUp, true);
  document.addEventListener('keydown', onKeyDown, true);
}

function createCaptureOverlay() {
  captureOverlay = document.createElement('div');
  captureOverlay.id = 'gemini-capture-overlay';
  // All styling is in content.css

  const instructions = document.createElement('div');
  instructions.id = 'gemini-capture-instructions';
  instructions.textContent = 'Click and drag to select area to translate. Press ESC to cancel.';

  captureOverlay.appendChild(instructions);
  document.body.appendChild(captureOverlay);
}

function onMouseDown(e) {
  if (!isCapturing) return;
  e.preventDefault();
  e.stopPropagation();

  // Use clientX/clientY — overlay is position:fixed (viewport-relative)
  startX = e.clientX;
  startY = e.clientY;

  const selectionRect = document.createElement('div');
  selectionRect.id = 'gemini-selection-rect';
  captureOverlay.appendChild(selectionRect);
}

function onMouseMove(e) {
  if (!isCapturing || startX == null) return;

  const selectionRect = document.getElementById('gemini-selection-rect');
  if (!selectionRect) return;

  endX = e.clientX;
  endY = e.clientY;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  selectionRect.style.left = left + 'px';
  selectionRect.style.top = top + 'px';
  selectionRect.style.width = width + 'px';
  selectionRect.style.height = height + 'px';
}

function onMouseUp(e) {
  if (!isCapturing || startX == null) return;
  e.preventDefault();
  e.stopPropagation();

  endX = e.clientX;
  endY = e.clientY;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  if (width > 10 && height > 10) {
    captureSelectedArea(left, top, width, height);
  }

  endCapture();
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    endCapture();
  }
}

function endCapture() {
  isCapturing = false;

  document.removeEventListener('mousedown', onMouseDown, true);
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('mouseup', onMouseUp, true);
  document.removeEventListener('keydown', onKeyDown, true);

  if (captureOverlay) {
    captureOverlay.remove();
    captureOverlay = null;
  }

  startX = startY = endX = endY = null;
}

// ---------- Capture & Send ----------

function captureSelectedArea(left, top, width, height) {
  showLoadingIndicator();

  const pixelRatio = window.devicePixelRatio || 1;

  const captureArea = {
    left: Math.round(left * pixelRatio),
    top: Math.round(top * pixelRatio),
    width: Math.round(width * pixelRatio),
    height: Math.round(height * pixelRatio),
  };

  chrome.runtime.sendMessage({
    action: 'captureVisibleTab',
    area: captureArea,
    pixelRatio,
    apiKey,
    targetLanguage,
    geminiModel,
  }, (response) => {
    hideLoadingIndicator();

    if (chrome.runtime.lastError) {
      showError('Capture failed: ' + chrome.runtime.lastError.message);
      return;
    }

    if (!response?.success) {
      showRetryModal(response?.error || 'Unknown error');
      return;
    }
  });
}

// ---------- Translation Position Memory ----------

function calculateTranslationPosition() {
  const saved = localStorage.getItem('gemini-translation-position');
  if (saved) {
    try {
      const pos = JSON.parse(saved);
      return {
        x: Math.max(10, Math.min(pos.x, window.innerWidth - 340)),
        y: Math.max(10, Math.min(pos.y, window.innerHeight - 200)),
      };
    } catch { /* fall through to default */ }
  }

  return {
    x: window.innerWidth - 370,
    y: 50,
  };
}

function saveTranslationPosition(element) {
  const rect = element.getBoundingClientRect();
  localStorage.setItem('gemini-translation-position', JSON.stringify({
    x: rect.left,
    y: rect.top,
  }));
}

// ---------- Loading Indicator ----------

function showLoadingIndicator() {
  hideLoadingIndicator();

  const existing = document.getElementById('gemini-translation-result');
  if (existing) existing.remove();

  const position = calculateTranslationPosition();
  translationPosition = position;

  const loader = document.createElement('div');
  loader.id = 'gemini-loading-indicator';
  loader.style.top = position.y + 'px';
  loader.style.left = position.x + 'px';

  loader.innerHTML = `
    <div style="text-align:center;">
      <div class="gemini-spinner"></div>
      <div class="gemini-loading-title">Translating…</div>
      <div class="gemini-loading-subtitle">Processing your selection</div>
    </div>
  `;

  document.body.appendChild(loader);
  makeDraggable(loader);
}

function hideLoadingIndicator() {
  const el = document.getElementById('gemini-loading-indicator');
  if (el) {
    cleanupDragHandlers(el);
    el.remove();
  }
}

// ---------- Translation Result ----------

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showTranslationResult(translation, _imageData) {
  hideLoadingIndicator();

  const position = translationPosition || calculateTranslationPosition();

  // Remove any previous result
  const prev = document.getElementById('gemini-translation-result');
  if (prev) {
    cleanupDragHandlers(prev);
    prev.remove();
  }

  const resultWindow = document.createElement('div');
  resultWindow.id = 'gemini-translation-result';
  resultWindow.style.top = position.y + 'px';
  resultWindow.style.left = position.x + 'px';

  const safeTrans = escapeHTML(translation);

  resultWindow.innerHTML = `
    <div class="gemini-result-header">
      <span>Translation</span>
      <div class="gemini-result-actions">
        <button class="gemini-copy-btn" title="Copy to clipboard">📋</button>
        <button class="gemini-close-btn" title="Close (Esc)">✕</button>
      </div>
    </div>
    <div class="gemini-result-body">${safeTrans.replace(/\n/g, '<br>')}</div>
  `;

  document.body.appendChild(resultWindow);

  // Close button
  const closeBtn = resultWindow.querySelector('.gemini-close-btn');
  const closeResult = () => {
    cleanupDragHandlers(resultWindow);
    resultWindow.remove();
    document.removeEventListener('keydown', escapeHandler);
  };

  closeBtn.addEventListener('click', closeResult);

  // Copy button
  const copyBtn = resultWindow.querySelector('.gemini-copy-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(translation).then(() => {
      copyBtn.textContent = '✓';
      setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
    });
  });

  // Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') closeResult();
  };
  document.addEventListener('keydown', escapeHandler);

  makeDraggable(resultWindow);
}

// ---------- Drag ----------

function makeDraggable(element) {
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  const onDown = (e) => {
    if (e.target.closest('button')) return;
    isDragging = true;
    const rect = element.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    element.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const onMove = (e) => {
    if (!isDragging) return;
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
  };

  const onUp = () => {
    if (!isDragging) return;
    isDragging = false;
    element.style.cursor = 'move';
    saveTranslationPosition(element);
    const rect = element.getBoundingClientRect();
    translationPosition = { x: rect.left, y: rect.top };
  };

  element.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);

  // Store cleanup function on the element so we can remove listeners later
  element._geminiDragCleanup = () => {
    element.removeEventListener('mousedown', onDown);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  activeDragCleanups.push(element._geminiDragCleanup);
}

function cleanupDragHandlers(element) {
  if (element._geminiDragCleanup) {
    element._geminiDragCleanup();
    const idx = activeDragCleanups.indexOf(element._geminiDragCleanup);
    if (idx !== -1) activeDragCleanups.splice(idx, 1);
    delete element._geminiDragCleanup;
  }
}

// ---------- Error ----------

function showError(message) {
  hideLoadingIndicator();

  const errorEl = document.createElement('div');
  errorEl.className = 'gemini-error-notification';
  errorEl.textContent = message;
  document.body.appendChild(errorEl);

  setTimeout(() => errorEl.remove(), 5000);
}

// ---------- Retry Modal ----------

const RETRY_MODELS = [
  'gemini-3.0-flash-preview',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

function showRetryModal(errorMessage, prefilledApiKey = null, prefilledModel = null) {
  hideLoadingIndicator();

  const existing = document.getElementById('gemini-retry-modal');
  if (existing) existing.remove();

  const position = calculateTranslationPosition();
  const modal = document.createElement('div');
  modal.id = 'gemini-retry-modal';
  modal.className = 'gemini-retry-modal';
  modal.style.top = position.y + 'px';
  modal.style.left = position.x + 'px';

  const currentApiKey = prefilledApiKey ?? apiKey ?? '';
  const currentModel = prefilledModel ?? geminiModel ?? RETRY_MODELS[0];
  const modelOptions = RETRY_MODELS.map(m => `<option value="${escapeHTML(m)}" ${m === currentModel ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');

  modal.innerHTML = `
    <div class="gemini-retry-header">
      <span>Try again with…</span>
      <button class="gemini-retry-close" title="Close">✕</button>
    </div>
    <div class="gemini-retry-body">
      <div class="gemini-retry-error">${escapeHTML(errorMessage)}</div>
      <label class="gemini-retry-label">API Key</label>
      <input type="password" class="gemini-retry-input" id="gemini-retry-apikey" placeholder="Enter API key" value="${escapeHTML(currentApiKey)}">
      <label class="gemini-retry-label">Model</label>
      <select class="gemini-retry-select" id="gemini-retry-model">${modelOptions}</select>
      <div class="gemini-retry-actions">
        <button class="gemini-retry-btn gemini-retry-cancel">Cancel</button>
        <button class="gemini-retry-btn gemini-retry-submit">Try Again</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  makeDraggable(modal);

  const closeModal = () => {
    cleanupDragHandlers(modal);
    modal.remove();
  };

  modal.querySelector('.gemini-retry-close').addEventListener('click', closeModal);
  modal.querySelector('.gemini-retry-cancel').addEventListener('click', closeModal);

  modal.querySelector('.gemini-retry-submit').addEventListener('click', () => {
    const newApiKey = modal.querySelector('#gemini-retry-apikey').value.trim();
    const newModel = modal.querySelector('#gemini-retry-model').value;

    if (!newApiKey) {
      modal.querySelector('.gemini-retry-error').textContent = 'Please enter an API key';
      return;
    }

    modal.querySelector('.gemini-retry-submit').disabled = true;
    modal.querySelector('.gemini-retry-submit').textContent = 'Retrying…';
    showLoadingIndicator();

    chrome.runtime.sendMessage({
      action: 'retryTranslation',
      apiKey: newApiKey,
      geminiModel: newModel,
    }, (response) => {
      hideLoadingIndicator();
      closeModal();

      if (chrome.runtime.lastError) {
        showRetryModal('Retry failed: ' + chrome.runtime.lastError.message, newApiKey, newModel);
      } else if (!response?.success) {
        showRetryModal(response?.error || 'Retry failed', newApiKey, newModel);
      }
    });
  });

  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}