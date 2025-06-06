let isCapturing = false;
let captureOverlay = null;
let startX, startY, endX, endY;
let apiKey, targetLanguage;

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startCapture') {
    apiKey = request.apiKey;
    targetLanguage = request.targetLanguage;
    startScreenCapture();
  }
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
  
  startX = e.clientX;
  startY = e.clientY;
  
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
  if (!isCapturing || !startX) return;
  
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
  // Use html2canvas to capture the selected area
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.onload = function() {
    // Remove the overlay temporarily for clean capture
    const overlay = document.getElementById('gemini-capture-overlay');
    if (overlay) overlay.style.display = 'none';
    
    html2canvas(document.body, {
      x: left,
      y: top,
      width: width,
      height: height,
      useCORS: true,
      allowTaint: true,
      scale: 1
    }).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      
      // Send to background script for processing
      chrome.runtime.sendMessage({
        action: 'translateImage',
        imageData: imageData,
        apiKey: apiKey,
        targetLanguage: targetLanguage
      }, function(response) {
        if (response.success) {
          showTranslationResult(response.translation, imageData);
        } else {
          showError('Translation failed: ' + response.error);
        }
      });
      
      // Remove the script
      script.remove();
    }).catch(error => {
      console.error('Capture failed:', error);
      showError('Failed to capture image: ' + error.message);
      script.remove();
    });
  };
  
  script.onerror = function() {
    // Fallback: use Chrome's built-in capture API
    chrome.runtime.sendMessage({
      action: 'captureVisibleTab',
      area: {left, top, width, height},
      apiKey: apiKey,
      targetLanguage: targetLanguage
    });
    script.remove();
  };
  
  document.head.appendChild(script);
}

function showTranslationResult(translation, imageData) {
  // Create a floating result window
  const resultWindow = document.createElement('div');
  resultWindow.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    padding: 20px;
    max-width: 500px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000001;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
  `;
  
  resultWindow.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #333;">Translation Result</h3>
      <button id="closeResult" style="background: #f44336; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
    </div>
    <div style="margin-bottom: 15px;">
      <img src="${imageData}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px;">
    </div>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; line-height: 1.5;">
      ${translation.replace(/\n/g, '<br>')}
    </div>
    <div style="margin-top: 15px; text-align: center;">
      <button id="copyTranslation" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Copy Text</button>
      <button id="newTranslation" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">New Translation</button>
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
}

function showError(message) {
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