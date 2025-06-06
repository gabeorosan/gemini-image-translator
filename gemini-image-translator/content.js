let isCapturing = false;
let captureOverlay = null;
let startX, startY, endX, endY;
let apiKey, targetLanguage, geminiModel;

// Set a flag to indicate content script is loaded
window.geminiTranslatorLoaded = true;
console.log('Gemini Image Translator content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startCapture') {
    apiKey = request.apiKey;
    targetLanguage = request.targetLanguage;
    geminiModel = request.geminiModel;
    startScreenCapture();
    sendResponse({success: true});
  } else if (request.action === 'showTranslation') {
    showTranslationResult(request.translation, request.imageData);
    sendResponse({success: true});
  }
  return true; // Keep message channel open
});

function startScreenCapture() {
  if (isCapturing) return;
  
  isCapturing = true;
  createCaptureOverlay();
  
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
}

function createCaptureOverlay() {
  captureOverlay = document.createElement('div');
  captureOverlay.id = 'gemini-capture-overlay';
  captureOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
    cursor: crosshair;
    pointer-events: all;
  `;
  
  const instructions = document.createElement('div');
  instructions.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 1000000;
  `;
  instructions.textContent = 'Click and drag to select area to translate. Press ESC to cancel.';
  
  captureOverlay.appendChild(instructions);
  document.body.appendChild(captureOverlay);
}

function onMouseDown(e) {
  if (!isCapturing) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Use pageX/pageY to account for scroll position
  startX = e.pageX;
  startY = e.pageY;
  
  // Create selection rectangle
  const selectionRect = document.createElement('div');
  selectionRect.id = 'gemini-selection-rect';
  selectionRect.style.cssText = `
    position: fixed;
    border: 2px solid #4CAF50;
    background: rgba(76, 175, 80, 0.1);
    z-index: 1000000;
    pointer-events: none;
  `;
  
  captureOverlay.appendChild(selectionRect);
}

function onMouseMove(e) {
  if (!isCapturing || !startX) return;
  
  const selectionRect = document.getElementById('gemini-selection-rect');
  if (!selectionRect) return;
  
  // Use pageX/pageY for consistency
  endX = e.pageX;
  endY = e.pageY;
  
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  // Convert page coordinates to viewport coordinates for display
  const viewportLeft = left - window.pageXOffset;
  const viewportTop = top - window.pageYOffset;
  
  selectionRect.style.left = viewportLeft + 'px';
  selectionRect.style.top = viewportTop + 'px';
  selectionRect.style.width = width + 'px';
  selectionRect.style.height = height + 'px';
}

function onMouseUp(e) {
  if (!isCapturing || !startX) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Use pageX/pageY for consistency
  endX = e.pageX;
  endY = e.pageY;
  
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  if (width > 10 && height > 10) {
    // Convert page coordinates to viewport coordinates for capture
    const viewportLeft = left - window.pageXOffset;
    const viewportTop = top - window.pageYOffset;
    captureSelectedArea(viewportLeft, viewportTop, width, height);
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
  
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('keydown', onKeyDown);
  
  if (captureOverlay) {
    captureOverlay.remove();
    captureOverlay = null;
  }
  
  startX = startY = endX = endY = null;
}

function captureSelectedArea(left, top, width, height) {
  // Show loading indicator
  showLoadingIndicator(left, top, width, height);
  
  // Account for device pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;
  
  const captureArea = {
    left: Math.round(left * pixelRatio),
    top: Math.round(top * pixelRatio),
    width: Math.round(width * pixelRatio),
    height: Math.round(height * pixelRatio)
  };
  
  console.log('Capture area (viewport coords):', {left, top, width, height});
  console.log('Capture area (device pixels):', captureArea);
  console.log('Device pixel ratio:', pixelRatio);
  console.log('Window scroll:', {x: window.pageXOffset, y: window.pageYOffset});
  
  // Use Chrome's built-in capture API
  chrome.runtime.sendMessage({
    action: 'captureVisibleTab',
    area: captureArea,
    originalArea: {left, top, width, height}, // Keep original for debugging
    pixelRatio: pixelRatio,
    apiKey: apiKey,
    targetLanguage: targetLanguage,
    geminiModel: geminiModel
  }, function(response) {
    // Hide loading indicator
    hideLoadingIndicator();
    
    if (chrome.runtime.lastError) {
      showError('Capture failed: ' + chrome.runtime.lastError.message);
      return;
    }
    
    if (response && response.success) {
      // Success handled by background script
    } else {
      showError('Capture failed: ' + (response ? response.error : 'Unknown error'));
    }
  });
}

function showLoadingIndicator(left, top, width, height) {
  // Remove any existing loading indicator
  hideLoadingIndicator();
  
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'gemini-loading-indicator';
  loadingOverlay.style.cssText = `
    position: fixed;
    top: ${top}px;
    left: ${left}px;
    width: ${width}px;
    height: ${height}px;
    background: rgba(66, 133, 244, 0.2);
    border: 2px solid #4285f4;
    border-radius: 4px;
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
  `;
  
  loadingOverlay.innerHTML = `
    <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); text-align: center;">
      <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #4285f4; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px;"></div>
      <div style="color: #333; font-size: 14px; font-weight: 500;">Translating...</div>
    </div>
  `;
  
  // Add CSS animation for spinner
  if (!document.getElementById('gemini-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'gemini-spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(loadingOverlay);
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('gemini-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function showTranslationResult(translation, imageData) {
  // Hide loading indicator
  hideLoadingIndicator();
  
  // Calculate position to the side of the captured area
  let resultX = window.innerWidth - 350; // Default to right side
  let resultY = 50; // Default top position
  
  // If we have capture coordinates, position relative to them
  if (endX && endY) {
    const captureRight = Math.max(startX, endX) - window.pageXOffset;
    const captureTop = Math.min(startY, endY) - window.pageYOffset;
    
    // Try to position to the right of the capture area
    if (captureRight + 320 < window.innerWidth) {
      resultX = captureRight + 20;
      resultY = captureTop;
    } else {
      // If not enough space on right, try left
      const captureLeft = Math.min(startX, endX) - window.pageXOffset;
      if (captureLeft - 320 > 0) {
        resultX = captureLeft - 320;
        resultY = captureTop;
      } else {
        // If no space on sides, position below
        resultX = Math.min(startX, endX) - window.pageXOffset;
        resultY = Math.max(startY, endY) - window.pageYOffset + 20;
      }
    }
    
    // Ensure it stays within viewport
    resultX = Math.max(10, Math.min(resultX, window.innerWidth - 310));
    resultY = Math.max(10, Math.min(resultY, window.innerHeight - 200));
  }
  
  // Create a floating result window
  const resultWindow = document.createElement('div');
  resultWindow.style.cssText = `
    position: fixed;
    top: ${resultY}px;
    left: ${resultX}px;
    background: white;
    border: 2px solid #4285f4;
    border-radius: 8px;
    padding: 15px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000001;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
  `;
  
  resultWindow.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="margin: 0; color: #333; font-size: 16px;">Translation</h3>
      <button id="closeResult" style="background: #f44336; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 14px;">×</button>
    </div>
    <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #4285f4; line-height: 1.4; margin-bottom: 12px;">
      ${translation.replace(/\n/g, '<br>')}
    </div>
    <div style="text-align: center;">
      <button id="copyTranslation" style="background: #4285f4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">Copy</button>
      <button id="newTranslation" style="background: #34a853; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">New</button>
    </div>
  `;
  
  document.body.appendChild(resultWindow);
  
  // Add event listeners
  document.getElementById('closeResult').addEventListener('click', () => {
    resultWindow.remove();
  });
  
  document.getElementById('copyTranslation').addEventListener('click', () => {
    navigator.clipboard.writeText(translation).then(() => {
      const btn = document.getElementById('copyTranslation');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });
  
  document.getElementById('newTranslation').addEventListener('click', () => {
    resultWindow.remove();
    startScreenCapture();
  });
  
  // Auto-remove after 15 seconds
  setTimeout(() => {
    if (resultWindow.parentNode) {
      resultWindow.remove();
    }
  }, 15000);
}

function showError(message) {
  // Hide loading indicator if showing
  hideLoadingIndicator();
  
  const errorWindow = document.createElement('div');
  errorWindow.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 15px;
    border-radius: 5px;
    z-index: 1000001;
    font-family: Arial, sans-serif;
    max-width: 300px;
  `;
  
  errorWindow.textContent = message;
  document.body.appendChild(errorWindow);
  
  setTimeout(() => {
    errorWindow.remove();
  }, 5000);
}