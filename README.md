# 🌐 Gemini Image Translator

A Chrome extension that uses Google's Gemini AI to instantly translate text from any image or screen content. Simply select an area and get real-time translations in a clean, draggable interface.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285f4?style=flat-square&logo=google-chrome)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange?style=flat-square)

## ✨ Features

- **🎯 Smart Screen Capture** - Select any area to capture and translate text
- **🤖 AI-Powered Translation** - Uses Google's latest Gemini AI models
- **🎨 Draggable Interface** - Move translation box anywhere, position is remembered
- **⚡ Quick Access** - Customizable keyboard shortcuts (default: `Ctrl+Shift+L`)
- **🌍 100+ Languages** - Translate to any language
- **🔄 Dynamic Models** - Always shows latest available Gemini models

## 🚀 Quick Start

### Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/gemini-image-translator.git
   cd gemini-image-translator
   ```

2. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

3. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free Gemini API key
   - Enter the key in the extension popup

### Usage

1. **Setup**: Click extension icon → Enter API key → Choose language
2. **Capture**: Press `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac)
3. **Select**: Drag to select text area on screen
4. **Translate**: View instant translation in floating box
5. **Position**: Drag translation box to preferred location (remembered)

## 🎮 How to Use

### Keyboard Shortcut (Recommended)
- Press `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac)
- Drag to select the area containing text
- Translation appears instantly

### Extension Popup
- Click the extension icon in Chrome toolbar
- Click "Start Capture" button
- Select area and get translation

### Customizing Shortcuts
- Go to `chrome://extensions/shortcuts`
- Find "Gemini Image Translator"
- Set your preferred key combination

## 🛠️ Key Features

- **Position Memory**: Remembers where you drag the translation box
- **Dynamic Model Loading**: Automatically fetches latest Gemini models
- **Escape Key Support**: Quick close with keyboard
- **Loading Indicators**: Visual feedback during processing
- **Error Handling**: Graceful fallbacks and clear error messages

## 📋 Requirements

- Chrome 88+ (Manifest V3 support)
- Free Gemini API key from Google AI Studio
- Internet connection for API calls

## 🔒 Privacy & Security

- **No Data Storage**: Images processed in real-time only
- **Direct API Calls**: Your browser communicates directly with Google
- **Local Storage**: API keys stored securely in Chrome
- **Open Source**: Full code transparency

## 🐛 Troubleshooting

**Extension not working?**
- Verify valid Gemini API key in popup
- Check website allows screen capture
- Try refreshing page and reloading extension

**Poor translation quality?**
- Switch to Gemini Pro model for better accuracy
- Ensure selected area has clear, readable text

**Keyboard shortcut not responding?**
- Visit `chrome://extensions/shortcuts` to verify/change shortcut
- Check for conflicts with other extensions

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing powerful vision and language models
- **Chrome Extensions Team** - For the robust extension platform
- **Open Source Community** - For inspiration and contributions

---

**Made with ❤️ by the open source community**

*Translate the world, one image at a time* 🌍✨