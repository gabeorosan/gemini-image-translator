# Installation Guide - Gemini Image Translator

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (you'll need this later)

### 2. Install the Extension

#### Option A: Load Unpacked (Recommended for Development)

1. **Download** this extension folder to your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in the top right corner)
4. **Click "Load unpacked"** button
5. **Select** the `gemini-image-translator` folder
6. **Pin the extension** to your toolbar (click the puzzle piece icon, then pin)

#### Option B: Pack and Install

1. In `chrome://extensions/`, click "Pack extension"
2. Select the extension folder
3. Click "Pack Extension" to create a `.crx` file
4. Drag the `.crx` file to Chrome to install

### 3. Configure the Extension

1. **Click the extension icon** in your Chrome toolbar
2. **Enter your Gemini API key** in the popup
3. **Select your preferred target language**
4. **Click "Save"** (settings are automatically saved)

### 4. Test the Extension

1. **Visit the demo page**: Open `demo.html` in your browser
2. **Try screen capture**: Click "📷 Capture & Translate" and select text
3. **Try image upload**: Click "📁 Upload Image" and select an image file

## Troubleshooting Installation

### Extension Not Loading

- **Check folder structure**: Ensure `manifest.json` is in the root of the selected folder
- **Check Chrome version**: Requires Chrome 88+ for Manifest V3 support
- **Disable other extensions**: Temporarily disable other extensions to check for conflicts

### API Key Issues

- **Verify key format**: Should be a long string starting with "AIza"
- **Check API quotas**: Ensure you haven't exceeded free tier limits
- **Test key**: Try the key in Google AI Studio first

### Permission Errors

- **Refresh pages**: Reload pages after installing the extension
- **Check site restrictions**: Some secure sites may block extensions
- **Clear browser cache**: Clear Chrome cache and restart

## File Structure

```
gemini-image-translator/
├── manifest.json          # Extension configuration (required)
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Screen capture and overlay
├── content.css            # Content script styles
├── background.js          # API calls and background tasks
├── result.html            # Translation result page
├── demo.html              # Test page with sample text
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # Main documentation
├── INSTALLATION.md        # This file
└── package.json           # Project metadata
```

## System Requirements

### Browser Support
- **Chrome**: Version 88+ (recommended)
- **Edge**: Chromium-based versions
- **Other browsers**: Not supported

### Operating System
- **Windows**: 10+
- **macOS**: 10.14+
- **Linux**: Most distributions
- **Chrome OS**: Supported

### Internet Connection
- Required for Gemini API calls
- Minimum: Stable broadband connection
- Data usage: ~1-5KB per translation

## Security Notes

### Data Privacy
- **Local storage**: API keys stored locally in Chrome
- **No tracking**: Extension doesn't collect user data
- **Secure transmission**: All API calls use HTTPS

### Permissions Explained
- **activeTab**: Access current tab for screen capture
- **storage**: Save user preferences locally
- **scripting**: Inject capture functionality
- **host_permissions**: Connect to Gemini API

## Next Steps

After installation:

1. **Read the README**: Check `README.md` for detailed usage instructions
2. **Try the demo**: Use `demo.html` to test all features
3. **Customize settings**: Adjust language preferences in the popup
4. **Report issues**: Use GitHub issues for bug reports

## Getting Help

### Common Issues
- Check the troubleshooting section in `README.md`
- Verify your API key is valid and has quota
- Ensure you're using a supported Chrome version

### Support Channels
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check `README.md` for detailed information
- **API Documentation**: [Google AI Studio](https://ai.google.dev/)

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Gemini Image Translator"
3. Click "Remove"
4. Confirm removal

Your API key and settings will be automatically deleted.