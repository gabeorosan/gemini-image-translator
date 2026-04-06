// Background script for Gemini Image Translator

// Store failed capture data for retry (cleared after successful retry or new capture)
let lastFailedCapture = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateImage') {
    handleImageTranslation(request, sendResponse);
    return true;
  } else if (request.action === 'captureVisibleTab') {
    handleTabCapture(request, sendResponse);
    return true;
  } else if (request.action === 'retryTranslation') {
    handleRetryTranslation(request, sendResponse);
    return true;
  } else if (request.action === 'test') {
    sendResponse({ success: true, message: 'Extension is working!' });
    return true;
  }
});

async function handleImageTranslation(request, sendResponse) {
  try {
    const { imageData, apiKey, targetLanguage, geminiModel } = request;

    if (!imageData || !apiKey || !targetLanguage) {
      throw new Error('Missing required parameters');
    }

    const base64Image = imageData.split(',')[1];
    if (!base64Image) {
      throw new Error('Invalid image data');
    }

    const translation = await callGeminiAPI(
      base64Image, apiKey, targetLanguage, geminiModel || 'gemini-3.0-flash-preview'
    );
    sendResponse({ success: true, translation });
  } catch (error) {
    console.error('Translation error:', error.message);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleTabCapture(request, sendResponse) {
  let croppedImage = null;
  let tab = null;

  try {
    const { area, apiKey, targetLanguage, geminiModel } = request;

    // Get the current active tab
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = activeTab;
    if (!tab) {
      sendResponse({ success: false, error: 'No active tab found' });
      return;
    }

    // Capture the visible tab
    let dataUrl;
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    } catch (captureError) {
      sendResponse({ success: false, error: captureError.message });
      return;
    }

    // Crop the image to the selected area
    croppedImage = await cropImage(dataUrl, area);
    const base64Image = croppedImage.split(',')[1];

    // Call Gemini API
    const translation = await callGeminiAPI(
      base64Image, apiKey, targetLanguage, geminiModel || 'gemini-3.0-flash-preview'
    );

    lastFailedCapture = null; // Clear on success

    // Send result back to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'showTranslation',
      translation,
      imageData: croppedImage,
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error('Capture error:', error.message);
    if (croppedImage && typeof croppedImage === 'string' && croppedImage.startsWith('data:')) {
      lastFailedCapture = { croppedImage, tabId: tab?.id, targetLanguage: request?.targetLanguage || 'English' };
    }
    sendResponse({ success: false, error: error.message });
  }
}

async function handleRetryTranslation(request, sendResponse) {
  try {
    if (!lastFailedCapture) {
      sendResponse({ success: false, error: 'No previous capture to retry. Please capture again.' });
      return;
    }

    const { apiKey, geminiModel } = request;
    if (!apiKey?.trim()) {
      sendResponse({ success: false, error: 'Please enter an API key' });
      return;
    }

    const { croppedImage, tabId, targetLanguage } = lastFailedCapture;
    const base64Image = croppedImage.split(',')[1];
    const translation = await callGeminiAPI(
      base64Image, apiKey, targetLanguage, geminiModel || 'gemini-3.0-flash-preview'
    );

    lastFailedCapture = null;

    chrome.tabs.sendMessage(tabId, {
      action: 'showTranslation',
      translation,
      imageData: croppedImage,
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error('Retry error:', error.message);
    sendResponse({ success: false, error: error.message });
  }
}

async function cropImage(dataUrl, area) {
  const canvas = new OffscreenCanvas(area.width, area.height);
  const ctx = canvas.getContext('2d');

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);

  ctx.drawImage(
    imageBitmap,
    area.left, area.top, area.width, area.height,
    0, 0, area.width, area.height
  );

  const outputBlob = await canvas.convertToBlob({ type: 'image/png' });

  // Convert blob to base64 data URL without FileReader (unavailable in service workers)
  const arrayBuffer = await outputBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:image/png;base64,${base64}`;
}

async function callGeminiAPI(base64Image, apiKey, targetLanguage, geminiModel = 'gemini-3.0-flash-preview') {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [
        {
          text: `Extract and translate any text in this image to ${targetLanguage}.

Output format rules (follow strictly):
- Output plain text only. No markdown, no bullet points, no asterisks.
- For Chinese characters: put pinyin on the line directly above the corresponding characters/words.
- Do NOT add spaces between characters (e.g. write "你好" not "你 好", write "hello" not "h e l l o").
- Use single newlines between lines. Use double newlines only between paragraphs.
- No extra blank lines. No trailing spaces. No explanatory text.

If there's no text: respond with "No text detected in the image."
If the text is already in ${targetLanguage}: respond with the original text (and pinyin for Chinese).`
        },
        {
          inline_data: {
            mime_type: 'image/png',
            data: base64Image,
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    }
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error?.message || response.statusText;
    } catch {
      errorMessage = errorText || response.statusText;
    }
    throw new Error(`API Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content) {
    throw new Error('Invalid response from Gemini API - no content generated');
  }

  return cleanTranslationOutput(data.candidates[0].content.parts[0].text);
}

function cleanTranslationOutput(text) {
  if (!text || typeof text !== 'string') return '';
  let out = text.trim();

  // Remove spaces between CJK characters (Chinese, Japanese, Korean)
  out = out.replace(/([\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af])\s+([\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af])/g, '$1$2');

  // Collapse 3+ newlines to 2
  out = out.replace(/\n{3,}/g, '\n\n');

  // Trim each line, collapse multiple spaces to single
  out = out.split('\n').map(line => line.trim().replace(/\s+/g, ' ')).join('\n');

  return out.trim();
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'capture-translate') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const result = await chrome.storage.sync.get(['geminiApiKey', 'targetLanguage', 'geminiModel']);
  if (!result.geminiApiKey) {
    chrome.action.openPopup();
    return;
  }

  chrome.tabs.sendMessage(tab.id, {
    action: 'startCapture',
    apiKey: result.geminiApiKey,
    targetLanguage: result.targetLanguage || 'English',
    geminiModel: result.geminiModel || 'gemini-3.0-flash-preview',
  });
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gemini Image Translator installed');
});