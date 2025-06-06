# 🌐 Gemini Image Translator

A powerful Chrome extension that uses Google's Gemini AI to instantly translate text from any image or screen content. Simply select an area, and get real-time translations in a clean, draggable interface.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285f4?style=flat-square&logo=google-chrome)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange?style=flat-square)

## ✨ Features

### 🎯 **Smart Screen Capture**
- Select any area of your screen to capture text
- Works on websites, PDFs, images, videos, and applications
- Precise area selection with visual feedback

### 🤖 **AI-Powered Translation**
- Uses Google's latest Gemini AI models for accurate text recognition
- Supports 100+ languages with high-quality translations
- Automatic text detection and extraction from images

### 🎨 **Clean User Interface**
- Floating translation box with drag-and-drop positioning
- Position memory - remembers where you prefer translations
- Simplified design showing only translation text and close button
- Loading indicators with smooth transitions

### ⚡ **Quick Access**
- Customizable keyboard shortcuts (default: `Ctrl+Shift+Y`)
- One-click capture from extension popup
- Escape key to quickly close translations

### 🔧 **Advanced Options**
- Dynamic model selection - always shows latest Gemini models
- Multiple AI models: Flash (fast), Pro (accurate), experimental versions
- Automatic model discovery from Gemini API
- Refresh button to get newest models

## 🚀 Quick Start

### Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/gemini-image-translator.git
   cd gemini-image-translator
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked" and select the extension folder

3. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free Gemini API key
   - Enter the key in the extension popup

### Basic Usage

1. **🔑 Setup**: Click extension icon → Enter API key → Choose language
2. **📸 Capture**: Press `Ctrl+Shift+Y` or click "Start Capture"
3. **🖱️ Select**: Drag to select text area on screen
4. **🌍 Translate**: View instant translation in floating box
5. **📌 Position**: Drag translation box to preferred location (remembered for next time)

## 🎮 How to Use

### Method 1: Keyboard Shortcut (Recommended)
- Press `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (Mac)
- Drag to select the area containing text
- Translation appears instantly

### Method 2: Extension Popup
- Click the extension icon in Chrome toolbar
- Click "Start Capture" button
- Select area and get translation

### Customizing Shortcuts
- Go to `chrome://extensions/shortcuts`
- Find "Gemini Image Translator"
- Set your preferred key combination

## 🤖 Supported AI Models

The extension automatically discovers and displays the latest Gemini models:

| Model | Speed | Accuracy | Best For |
|-------|-------|----------|----------|
| **Gemini 2.0 Flash** ⭐ | ⚡⚡⚡ | 🎯🎯🎯 | General use (Default) |
| **Gemini 1.5 Flash** | ⚡⚡⚡ | 🎯🎯 | Quick translations |
| **Gemini 1.5 Pro** | ⚡⚡ | 🎯🎯🎯🎯 | Complex/handwritten text |
| **Gemini 1.0 Pro Vision** | ⚡ | 🎯🎯 | Legacy support |

*Models are automatically fetched from Google's API - always up to date!*

## 🌍 Supported Languages

Translate to any language, including:
- **European**: English, Spanish, French, German, Italian, Portuguese, Russian, Polish, Dutch, Swedish, Norwegian, Danish, Finnish, Greek, Turkish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Slovak, Slovenian, Estonian, Latvian, Lithuanian
- **Asian**: Chinese (Simplified/Traditional), Japanese, Korean, Hindi, Arabic, Thai, Vietnamese, Indonesian, Malay, Filipino, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Persian, Hebrew
- **African**: Swahili, Yoruba, Igbo, Hausa, Amharic, Somali, Zulu, Afrikaans
- **And many more...**

## 🛠️ Technical Features

### 🎯 **Smart Positioning**
- **Position Memory**: Remembers where you drag the translation box
- **Viewport Awareness**: Keeps translations within screen bounds
- **Consistent Placement**: Loading and result appear in same location

### 🔄 **Dynamic Model Loading**
- **Real-time Discovery**: Fetches latest models from Gemini API
- **Smart Filtering**: Only shows vision-capable models
- **Automatic Updates**: No extension updates needed for new models
- **Fallback Support**: Works offline with cached models

### 🎨 **User Experience**
- **Draggable Interface**: Move translation box anywhere on screen
- **Escape Key Support**: Quick close with keyboard
- **Loading Indicators**: Visual feedback during processing
- **Error Handling**: Graceful fallbacks and clear error messages

## 📋 Requirements

- **Browser**: Chrome 88+ (Manifest V3 support)
- **API**: Free Gemini API key from Google AI Studio
- **Connection**: Internet access for API calls
- **Permissions**: Screen capture and storage access

## 🔒 Privacy & Security

- **🛡️ No Data Storage**: Images processed in real-time, not stored
- **🔐 Direct API Calls**: Your browser communicates directly with Google
- **🚫 No Third Parties**: No data shared with external services
- **🔑 Local API Keys**: Keys stored locally in Chrome's secure storage
- **📝 Open Source**: Full code transparency

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/gemini-image-translator.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Test thoroughly in Chrome
   - Update documentation if needed

4. **Submit Pull Request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Ensure all tests pass

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/gemini-image-translator.git
cd gemini-image-translator

# Load in Chrome for testing
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

## 🐛 Troubleshooting

### Common Issues

**❌ Extension not working?**
- ✅ Verify valid Gemini API key in popup
- ✅ Check website allows screen capture (some sites block it)
- ✅ Try refreshing page and reloading extension

**❌ Poor translation quality?**
- ✅ Switch to Gemini Pro model for better accuracy
- ✅ Ensure selected area has clear, readable text
- ✅ Check target language spelling in settings

**❌ Keyboard shortcut not responding?**
- ✅ Visit `chrome://extensions/shortcuts` to verify/change shortcut
- ✅ Check for conflicts with other extensions
- ✅ Try different key combination

**❌ Translation box appears in wrong location?**
- ✅ Drag box to preferred position (location will be remembered)
- ✅ Clear browser data if position memory seems corrupted

### Getting Help

- 📝 [Open an Issue](https://github.com/yourusername/gemini-image-translator/issues)
- 💬 [Discussions](https://github.com/yourusername/gemini-image-translator/discussions)
- 📧 Email: support@yourproject.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing powerful vision and language models
- **Chrome Extensions Team** - For the robust extension platform
- **Open Source Community** - For inspiration and contributions

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Made with ❤️ by the open source community**

*Translate the world, one image at a time* 🌍✨