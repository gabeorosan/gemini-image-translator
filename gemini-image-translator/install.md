# Quick Installation Guide

## Step 1: Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with "AIza...")

## Step 2: Install Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `gemini-image-translator` folder
5. Pin the extension to your toolbar

## Step 3: Configure
1. Click the extension icon
2. Paste your API key
3. Select target language
4. Choose Gemini model (Flash is faster, Pro is more accurate)

## Step 4: Test
1. Open `test.html` in Chrome
2. Click "📷 Capture & Translate"
3. Select any text on the page
4. View the translation

## Troubleshooting

### Screen Capture Not Working
- Refresh the page after installing the extension
- Check browser console for errors (F12)
- Make sure you're not on a restricted page (chrome://, etc.)

### Empty Translation
- Verify your API key is correct
- Check you have API quota remaining
- Try a different Gemini model
- Check browser console for API errors

### Extension Not Loading
- Make sure manifest.json is in the root folder
- Check Chrome version (needs 88+)
- Reload the extension in chrome://extensions/

## Test URLs
- `test.html` - Simple test page
- `demo.html` - Full demo with multiple languages

## Support
Check the browser console (F12) for detailed error messages.