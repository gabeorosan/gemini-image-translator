# 📁 Project Structure

This document outlines the complete structure of the Gemini Image Translator Chrome extension repository.

## 🏗️ Repository Structure

```
gemini-image-translator/
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 CHANGELOG.md                 # Version history and changes
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 package.json                 # Project metadata and scripts
├── 📄 .gitignore                   # Git ignore rules
│
├── 🔧 Extension Core Files
│   ├── 📄 manifest.json            # Chrome extension configuration
│   ├── 📄 popup.html               # Extension popup interface
│   ├── 📄 popup.js                 # Popup functionality and settings
│   ├── 📄 content.js               # Screen capture and translation UI
│   ├── 📄 content.css              # Content script styles
│   └── 📄 background.js            # API calls and background processing
│
├── 🎨 Assets
│   └── icons/
│       ├── 🖼️ icon16.png           # 16x16 extension icon
│       ├── 🖼️ icon48.png           # 48x48 extension icon
│       └── 🖼️ icon128.png          # 128x128 extension icon
│
├── 📚 Documentation
│   └── docs/
│       ├── 📄 README.md            # Documentation index
│       ├── 📄 INSTALLATION.md      # Detailed installation guide
│       ├── 📄 NEW_FEATURES.md      # Comprehensive feature overview
│       ├── 📄 DYNAMIC_MODEL_LOADING.md  # AI model discovery docs
│       ├── 📄 SHORTCUT_AND_LOADING_IMPROVEMENTS.md
│       ├── 📄 POSITION_AND_DRAG_IMPROVEMENTS.md
│       ├── 📄 LOADING_BOX_IMPROVEMENTS.md
│       ├── 📄 FINAL_IMPROVEMENTS.md
│       ├── 📄 LATEST_CHANGES.md
│       └── 📄 FIXES.md
│
└── 🔧 GitHub Templates
    └── .github/
        ├── ISSUE_TEMPLATE/
        │   ├── 📄 bug_report.md     # Bug report template
        │   └── 📄 feature_request.md # Feature request template
        └── 📄 PULL_REQUEST_TEMPLATE.md # PR template
```

## 📋 File Descriptions

### Core Extension Files

| File | Purpose | Description |
|------|---------|-------------|
| `manifest.json` | Extension Config | Defines permissions, scripts, and metadata |
| `popup.html` | User Interface | Extension popup with settings and controls |
| `popup.js` | Popup Logic | Handles settings, API key management, model selection |
| `content.js` | Main Functionality | Screen capture, translation display, drag & drop |
| `content.css` | Styling | Styles for translation overlay and UI elements |
| `background.js` | API Integration | Gemini API calls, image processing, error handling |

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Main Documentation | Users & Contributors |
| `CONTRIBUTING.md` | Contribution Guide | Developers |
| `CHANGELOG.md` | Version History | Users & Maintainers |
| `LICENSE` | Legal Terms | All Users |
| `docs/` | Detailed Docs | Developers & Power Users |

### Project Management

| File | Purpose | Description |
|------|---------|-------------|
| `package.json` | Project Metadata | Version, keywords, scripts, dependencies |
| `.gitignore` | Git Configuration | Files to exclude from version control |
| `.github/` | GitHub Templates | Issue and PR templates for consistency |

## 🎯 Key Features by File

### `popup.js` - Settings & Configuration
- ✅ Dynamic model loading from Gemini API
- ✅ API key management and validation
- ✅ Language selection and preferences
- ✅ Keyboard shortcut customization
- ✅ Model refresh functionality

### `content.js` - User Interface & Interaction
- ✅ Screen area selection and capture
- ✅ Draggable translation boxes
- ✅ Position memory system
- ✅ Keyboard shortcut handling (Ctrl+Shift+Y)
- ✅ Escape key support for closing
- ✅ Loading indicators with smooth transitions

### `background.js` - AI Integration & Processing
- ✅ Gemini API communication
- ✅ Multiple model support (2.0 Flash, 1.5 Flash, 1.5 Pro, etc.)
- ✅ Image cropping and processing
- ✅ Error handling and retries
- ✅ Cross-tab messaging

## 🔧 Development Workflow

### Local Development
1. Clone repository
2. Load extension in Chrome (`chrome://extensions/`)
3. Enable Developer mode
4. Click "Load unpacked" and select project folder
5. Make changes and reload extension

### File Modification Guidelines
- **UI Changes**: Modify `popup.html`, `popup.js`, `content.css`
- **Feature Logic**: Update `content.js`, `background.js`
- **Extension Config**: Edit `manifest.json`
- **Documentation**: Update relevant files in `docs/`

### Testing Checklist
- [ ] Test in Chrome Developer mode
- [ ] Verify all keyboard shortcuts work
- [ ] Test translation accuracy with different models
- [ ] Check error handling scenarios
- [ ] Validate UI responsiveness

## 📦 Distribution

### Chrome Web Store Package
```bash
# Create distribution package (excludes development files)
npm run package
```

### Included in Package:
- All core extension files
- Icons and assets
- Main documentation (README, LICENSE)

### Excluded from Package:
- Development documentation (`docs/`)
- GitHub templates (`.github/`)
- Git files and history
- Development screenshots

## 🔄 Version Management

### Versioning Strategy
- **Major.Minor.Patch** (e.g., 1.2.0)
- **Major**: Breaking changes or major feature additions
- **Minor**: New features, significant improvements
- **Patch**: Bug fixes, minor improvements

### Release Process
1. Update version in `manifest.json` and `package.json`
2. Update `CHANGELOG.md` with new changes
3. Create GitHub release with tag
4. Package for Chrome Web Store submission

## 🤝 Contributing

### For New Contributors
1. Read `CONTRIBUTING.md`
2. Check existing issues and discussions
3. Fork repository and create feature branch
4. Follow code style guidelines
5. Test thoroughly before submitting PR

### For Maintainers
1. Review PRs against contribution guidelines
2. Ensure proper testing and documentation
3. Update version numbers for releases
4. Maintain changelog and documentation

---

This structure provides a clean, professional foundation for open source development while maintaining all the advanced features and functionality of the extension.