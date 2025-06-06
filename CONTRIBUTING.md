# Contributing to Gemini Image Translator

Thank you for your interest in contributing to Gemini Image Translator! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information**:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the use case** and why it would be valuable
3. **Provide mockups or examples** if possible
4. **Consider implementation complexity** and user impact

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/gemini-image-translator.git
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/gemini-image-translator.git
   cd gemini-image-translator
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Setup

1. **Load extension in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

2. **Test your changes**:
   - Make code changes
   - Reload extension in Chrome
   - Test functionality thoroughly

#### Code Style Guidelines

**JavaScript**:
- Use modern ES6+ syntax
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors gracefully

**HTML/CSS**:
- Use semantic HTML elements
- Follow consistent naming conventions
- Ensure responsive design
- Test across different screen sizes

**Chrome Extension Best Practices**:
- Follow Manifest V3 guidelines
- Minimize permissions requested
- Handle API errors gracefully
- Optimize for performance

#### Testing

Before submitting a pull request:

1. **Manual Testing**:
   - Test all major features
   - Try different websites and content types
   - Test keyboard shortcuts
   - Verify error handling

2. **Cross-browser Testing**:
   - Test in different Chrome versions
   - Verify on different operating systems

3. **Edge Cases**:
   - Test with invalid API keys
   - Test with no internet connection
   - Test with very large/small images
   - Test with different languages

#### Submitting Changes

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

2. **Use conventional commit messages**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request**:
   - Use the pull request template
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference related issues

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional format

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested manually in Chrome
- [ ] Tested keyboard shortcuts
- [ ] Tested error scenarios
- [ ] Tested on different websites

## Screenshots
Include screenshots for UI changes.

## Related Issues
Fixes #(issue number)
```

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Chrome Version: 
- Extension Version:
- Operating System:
- Website URL (if applicable):

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature.

## Use Case
Why would this feature be useful?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered.

## Additional Context
Mockups, examples, or other relevant information.
```

## 🏗️ Development Guidelines

### Project Structure

```
gemini-image-translator/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Screen capture and overlay
├── content.css            # Content script styles
├── background.js          # API calls and background tasks
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # Project documentation
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # This file
└── docs/                  # Additional documentation
```

### Key Components

**Manifest (manifest.json)**:
- Extension configuration and permissions
- Background script and content script declarations
- Icon and popup definitions

**Popup (popup.html/js)**:
- User interface for settings
- API key management
- Language selection
- Model selection with dynamic loading

**Content Script (content.js/css)**:
- Screen capture functionality
- Translation result display
- Drag and drop positioning
- Keyboard shortcut handling

**Background Script (background.js)**:
- Gemini API communication
- Image processing and cropping
- Error handling and retries

### API Integration

**Gemini API**:
- Uses Google's Generative AI API
- Supports multiple model types
- Handles vision and text generation
- Includes proper error handling

**Model Management**:
- Dynamic model discovery
- Fallback to default models
- Smart filtering for compatible models
- User-friendly model names

## 🔒 Security Considerations

### API Key Handling
- Store API keys securely in Chrome storage
- Never log or expose API keys
- Validate API keys before use
- Handle API errors gracefully

### Content Security
- Sanitize user inputs
- Validate image data
- Handle malicious content safely
- Respect website permissions

### Privacy
- No data collection or tracking
- Images processed in real-time only
- Direct API communication with Google
- Clear privacy documentation

## 📚 Resources

### Chrome Extension Development
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

### Gemini API
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [API Reference](https://ai.google.dev/api)

### JavaScript/Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [Modern JavaScript Guide](https://javascript.info/)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## 🎯 Roadmap

### Planned Features
- [ ] Batch translation for multiple images
- [ ] Translation history and favorites
- [ ] Custom translation prompts
- [ ] OCR confidence indicators
- [ ] Offline translation support
- [ ] Mobile browser support

### Technical Improvements
- [ ] Performance optimizations
- [ ] Better error handling
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Automated testing
- [ ] CI/CD pipeline

## 🙋‍♀️ Getting Help

### Community Support
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community chat
- **Documentation**: Check README and docs folder

### Maintainer Contact
- Create an issue for technical questions
- Use discussions for general questions
- Email for security-related issues

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to Gemini Image Translator! 🌟