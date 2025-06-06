// Background script for Gemini Image Translator

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateImage') {
    handleImageTranslation(request, sendResponse);
    return true; // Keep the message channel open for async response
  } else if (request.action === 'captureVisibleTab') {
    handleTabCapture(request, sendResponse);
    return true;
  } else if (request.action === 'test') {
    sendResponse({success: true, message: 'Extension is working!'});
    return true;
  }
});

async function handleImageTranslation(request, sendResponse) {
  try {
    const { imageData, apiKey, targetLanguage, geminiModel } = request;
    
    if (!imageData || !apiKey || !targetLanguage) {
      throw new Error('Missing required parameters');
    }
    
    // Convert data URL to base64
    const base64Image = imageData.split(',')[1];
    
    if (!base64Image) {
      throw new Error('Invalid image data');
    }
    
    // Call Gemini API
    const translation = await callGeminiAPI(base64Image, apiKey, targetLanguage, geminiModel || 'gemini-1.5-flash');
    
    sendResponse({ success: true, translation: translation });
  } catch (error) {
    console.error('Translation error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleTabCapture(request, sendResponse) {
  try {
    const { area, originalArea, pixelRatio, apiKey, targetLanguage, geminiModel } = request;
    
    console.log('Background: Received capture request');
    console.log('Area:', area);
    console.log('Original area:', originalArea);
    console.log('Pixel ratio:', pixelRatio);
    
    // Get the current active tab
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      if (!tabs[0]) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }
      
      const tabId = tabs[0].id;
      
      // Capture the visible tab
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (dataUrl) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        
        try {
          console.log('Background: Captured tab, now cropping');
          
          // Crop the image to the selected area
          const croppedImage = await cropImage(dataUrl, area);
          const base64Image = croppedImage.split(',')[1];
          
          console.log('Background: Image cropped successfully');
          
          // Call Gemini API
          const translation = await callGeminiAPI(base64Image, apiKey, targetLanguage, geminiModel || 'gemini-1.5-flash');
          
          // Send result back to content script
          chrome.tabs.sendMessage(tabId, {
            action: 'showTranslation',
            translation: translation,
            imageData: croppedImage
          });
          
          sendResponse({ success: true });
        } catch (error) {
          console.error('Processing error:', error);
          sendResponse({ success: false, error: error.message });
        }
      });
    });
  } catch (error) {
    console.error('Capture error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function cropImage(dataUrl, area) {
  return new Promise((resolve, reject) => {
    try {
      // Create an offscreen canvas for service worker compatibility
      const canvas = new OffscreenCanvas(area.width, area.height);
      const ctx = canvas.getContext('2d');
      
      // Create image bitmap from data URL
      fetch(dataUrl)
        .then(response => response.blob())
        .then(blob => createImageBitmap(blob))
        .then(imageBitmap => {
          // Draw the cropped portion
          ctx.drawImage(
            imageBitmap, 
            area.left, area.top, area.width, area.height,
            0, 0, area.width, area.height
          );
          
          // Convert to blob and then to data URL
          canvas.convertToBlob({ type: 'image/png' })
            .then(blob => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
            .catch(reject);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

async function callGeminiAPI(base64Image, apiKey, targetLanguage, geminiModel = 'gemini-1.5-flash') {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
  
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
    console.log('Making API call to:', API_URL);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
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
    console.log('API Response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API - no content generated');
    }

    const translatedText = data.candidates[0].content.parts[0].text;
    console.log('Translated text:', translatedText);
    
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