# Gemini Image Translator Chrome Extension

A powerful Chrome extension that uses Google's Gemini AI to extract and translate text from images in real-time.

## Features

- 🖼️ **Screen Capture**: Select any area on your screen to translate text
- 📁 **Image Upload**: Upload image files directly for translation
- 🌐 **Multi-language Support**: Translate to 12+ popular languages
- ⚡ **Real-time Processing**: Fast translation using Gemini AI
- 📋 **Copy to Clipboard**: Easy copying of translated text
- 🎨 **Beautiful UI**: Modern, intuitive interface

## Supported Languages

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Chinese
- Arabic
- Hindi

## Installation

### Prerequisites

1. **Gemini API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Install the Extension

1. **Download or Clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in the top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

## Usage

### First Time Setup

1. Click the extension icon in your toolbar
2. Enter your Gemini API key in the popup
3. Select your preferred target language
4. Your settings will be saved automatically

### Translating Images

#### Method 1: Screen Capture
1. Click the **"📷 Capture & Translate"** button
2. Click and drag to select the area containing text
3. Release to capture and translate
4. View the translation result in a popup

#### Method 2: Upload Image
1. Click the **"📁 Upload Image"** button
2. Select an image file from your computer
3. Wait for processing and translation
4. View results in a new tab

### Features

- **Copy Translation**: Click the copy button to save text to clipboard
- **New Translation**: Start a new translation without closing the result
- **Multiple Languages**: Change target language anytime in the popup
- **Error Handling**: Clear error messages for troubleshooting

## API Key Setup

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it into the extension popup

### API Key Security

- Your API key is stored locally in Chrome's sync storage
- The key is only used to communicate with Google's Gemini API
- No data is sent to third-party servers

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension format
- **Content Scripts**: Handle screen capture and UI overlay
- **Background Script**: Manages API calls and image processing
- **Popup Interface**: User settings and controls

### Permissions

- `activeTab`: Access current tab for screen capture
- `storage`: Save user preferences and API key
- `scripting`: Inject content scripts for capture functionality

### API Integration

- Uses Gemini 1.5 Flash model for optimal speed and accuracy
- Supports PNG image format
- Handles base64 image encoding
- Includes error handling and retry logic

## Troubleshooting

### Common Issues

**"API Error" Messages**
- Verify your API key is correct
- Check your internet connection
- Ensure you have API quota remaining

**Capture Not Working**
- Try refreshing the page
- Check if the page allows content scripts
- Some secure pages may block extensions

**Translation Quality**
- Ensure text in image is clear and readable
- Try capturing a smaller, more focused area
- Check if the text language is supported

### Browser Compatibility

- **Chrome**: Fully supported (recommended)
- **Edge**: Supported with Chromium base
- **Other Browsers**: Not supported (uses Chrome extension APIs)

## Privacy Policy

- No user data is collected or stored on external servers
- Images are processed locally and sent only to Google's Gemini API
- API keys are stored securely in Chrome's local storage
- No tracking or analytics are implemented

## Development

### Project Structure

```
gemini-image-translator/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Screen capture and overlay
├── content.css            # Content script styles
├── background.js          # API calls and background tasks
├── result.html            # Translation result page
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### Building from Source

1. Clone the repository
2. No build process required - it's vanilla JavaScript
3. Load the extension folder directly in Chrome

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Verify your Gemini API key and quota

## Changelog

### Version 1.0.0
- Initial release
- Screen capture functionality
- Image upload support
- Multi-language translation
- Gemini AI integration
- Modern UI design