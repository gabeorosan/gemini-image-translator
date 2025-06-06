# Changelog

All notable changes to the Gemini Image Translator extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dynamic model loading from Gemini API
- Model refresh functionality
- Escape key support for closing translations
- Draggable loading indicator
- Position memory system for translation box
- Clean replacement logic for multiple translations

### Changed
- Default model changed to `gemini-2.0-flash`
- Simplified translation box UI (removed extra buttons)
- Improved position memory accuracy
- Enhanced error handling and fallbacks

### Fixed
- Translation box position memory now works correctly
- Loading indicator appears in same position as translation result
- Multiple translation boxes no longer overlap

## [1.2.0] - 2024-12-06

### Added
- **Customizable Keyboard Shortcuts**: Users can now customize the capture shortcut
- **Draggable Translation Box**: Translation results can be dragged to any position
- **Position Memory**: Extension remembers where users prefer translation boxes
- **Escape Key Support**: Press Escape to quickly close translation boxes
- **Loading Indicator Improvements**: Better visual feedback during translation

### Changed
- **Default Shortcut**: Changed from `Ctrl+Shift+T` to `Ctrl+Shift+Y` to avoid conflicts
- **Simplified UI**: Removed unnecessary buttons, showing only translation and close button
- **Improved Positioning**: Loading and translation boxes appear in consistent locations

### Fixed
- **Shortcut Conflicts**: Resolved conflicts with browser default shortcuts
- **Position Accuracy**: Translation boxes now appear exactly where expected
- **Multiple Translations**: Clean handling when starting new translation with existing one open

## [1.1.0] - 2024-12-05

### Added
- **Multiple Gemini Models**: Support for Gemini 2.0 Flash, 1.5 Flash, 1.5 Pro, and 1.0 Pro Vision
- **Model Selection**: Users can choose their preferred AI model in popup
- **Enhanced Error Handling**: Better error messages and recovery
- **Improved UI**: Cleaner popup design with better organization

### Changed
- **Default Model**: Updated to use Gemini 2.0 Flash Experimental for better performance
- **API Integration**: Improved API call handling and response processing
- **User Experience**: Streamlined workflow for faster translations

### Fixed
- **API Errors**: Better handling of API rate limits and errors
- **Image Processing**: Improved image capture and processing reliability
- **Cross-site Compatibility**: Better support for various website types

## [1.0.0] - 2024-12-01

### Added
- **Initial Release**: Core functionality for image translation
- **Screen Capture**: Select any area of screen to capture text
- **AI Translation**: Integration with Google Gemini AI for text recognition and translation
- **Multi-language Support**: Translate to any language supported by Gemini
- **Keyboard Shortcuts**: Quick access with `Ctrl+Shift+T` shortcut
- **Floating Results**: Translation results in draggable floating window
- **API Key Management**: Secure storage of Gemini API keys
- **Chrome Extension**: Full Manifest V3 compatibility

### Features
- Real-time text extraction from images
- Support for 100+ languages
- Clean, modern user interface
- Secure API key storage
- Cross-platform compatibility (Windows, Mac, Linux)
- No data collection or tracking

### Technical
- **Manifest V3**: Uses latest Chrome extension format
- **Content Scripts**: Handle screen capture and UI overlay
- **Background Scripts**: Manage API calls and image processing
- **Popup Interface**: User settings and controls
- **Permissions**: Minimal required permissions for functionality

---

## Version History Summary

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| 1.2.0 | 2024-12-06 | Customizable shortcuts, draggable UI, position memory |
| 1.1.0 | 2024-12-05 | Multiple AI models, enhanced error handling |
| 1.0.0 | 2024-12-01 | Initial release with core translation functionality |

## Migration Guide

### From 1.1.x to 1.2.x
- **Shortcut Change**: Default shortcut changed from `Ctrl+Shift+T` to `Ctrl+Shift+Y`
- **UI Changes**: Translation box now shows only translation text and close button
- **New Features**: Translation box position is now remembered between uses

### From 1.0.x to 1.1.x
- **Model Selection**: New model dropdown in popup - existing users will default to Gemini 2.0 Flash
- **API Changes**: Improved error handling - no action required from users

## Upcoming Features

### Planned for v1.3.0
- [ ] Batch translation for multiple images
- [ ] Translation history and favorites
- [ ] Custom translation prompts
- [ ] OCR confidence indicators
- [ ] Better accessibility support

### Planned for v1.4.0
- [ ] Offline translation support
- [ ] Mobile browser compatibility
- [ ] Advanced image preprocessing
- [ ] Plugin system for custom models

## Support

For issues related to specific versions:
- **Current Issues**: [GitHub Issues](https://github.com/yourusername/gemini-image-translator/issues)
- **Version-specific Problems**: Include version number in issue reports
- **Migration Help**: Check migration guide above or create a discussion

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Reporting bugs
- Suggesting features
- Submitting code changes
- Development setup

---

*This changelog is automatically updated with each release. For the most current information, check the [GitHub releases page](https://github.com/yourusername/gemini-image-translator/releases).*