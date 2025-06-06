// Background script for Gemini Image Translator

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateImage') {
    handleImageTranslation(request, sendResponse);
    return true; // Keep the message channel open for async response
  } else if (request.action === 'captureVisibleTab') {
    handleTabCapture(request, sendResponse);
    return true;
  }
});

async function handleImageTranslation(request, sendResponse) {
  try {
    const { imageData, apiKey, targetLanguage } = request;
    
    // Convert data URL to base64
    const base64Image = imageData.split(',')[1];
    
    // Call Gemini API
    const translation = await callGeminiAPI(base64Image, apiKey, targetLanguage);
    
    sendResponse({ success: true, translation: translation });
  } catch (error) {
    console.error('Translation error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleTabCapture(request, sendResponse) {
  try {
    const { area, apiKey, targetLanguage } = request;
    
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      
      // Crop the image to the selected area
      const croppedImage = await cropImage(dataUrl, area);
      const base64Image = croppedImage.split(',')[1];
      
      // Call Gemini API
      const translation = await callGeminiAPI(base64Image, apiKey, targetLanguage);
      
      // Send result back to content script
      chrome.tabs.sendMessage(request.tabId, {
        action: 'showTranslation',
        translation: translation,
        imageData: croppedImage
      });
      
      sendResponse({ success: true });
    });
  } catch (error) {
    console.error('Capture error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function cropImage(dataUrl, area) {
  return new Promise((resolve) => {
    // Create a regular canvas element for compatibility
    const canvas = document.createElement('canvas');
    canvas.width = area.width;
    canvas.height = area.height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, area.left, area.top, area.width, area.height, 0, 0, area.width, area.height);
      const croppedDataUrl = canvas.toDataURL('image/png');
      resolve(croppedDataUrl);
    };
    img.src = dataUrl;
  });
}

async function callGeminiAPI(base64Image, apiKey, targetLanguage) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [{
      parts: [
        {
          text: `Please extract and translate any text you can see in this image to ${targetLanguage}. If there's no text in the image, please respond with "No text detected in the image." If the text is already in ${targetLanguage}, please respond with the original text. Please provide only the translation without any additional explanation or formatting.`
        },
        {
          inline_data: {
            mime_type: "image/png",
            data: base64Image
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

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const translatedText = data.candidates[0].content.parts[0].text;
    return translatedText.trim();
    
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error(`Failed to translate image: ${error.message}`);
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gemini Image Translator installed');
});