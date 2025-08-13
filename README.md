# Chrome Built-in AI APIs Example

A comprehensive Chrome extension demonstrating Chrome's production-ready built-in AI APIs. This project showcases real-world implementation of **Language Detection**, **Translator**, and **Summarizer** APIs in a functional browser extension.

![Chrome AI APIs](https://img.shields.io/badge/Chrome%20AI-138%2B-blue.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)

## 🎯 Purpose

This extension serves as a complete example for developers wanting to learn and implement Chrome's built-in AI capabilities. It demonstrates:

- ✅ **Language Detection API** - Automatic language detection of selected text
- ✅ **Translator API** - Real-time translation with streaming updates  
- ✅ **Summarizer API** - Content summarization in popup interface
- ✅ Production-ready error handling and availability checking
- ✅ User experience best practices for AI-powered features

## 🚀 Features

### Context Menu Translation
- Right-click any selected text → "Tabx" → automatic language detection → translation
- Real-time streaming translation updates
- Works on any webpage

### Keyboard Shortcuts
- **Ctrl+K** (Windows/Linux) or **Cmd+K** (Mac) for quick translation
- Translate selected text without opening context menu

### Popup Summarization  
- Click extension icon to open popup
- Summarize current page content
- Streaming summary updates with progress indication

## 📋 Requirements

### Browser & Platform
- **Chrome 138+** (stable - these are production APIs!)
- **Desktop only**: Windows 10/11, macOS 13+, Linux
- **No experimental flags required** - these APIs are in production

### Hardware Requirements
- **GPU**: 4+ GB VRAM
- **Storage**: 22 GB free space (for AI models)
- **Network**: Unmetered connection (models download on first use)

### Context Requirements
- Works in top-level windows and same-origin iframes
- Requires user activation for some operations
- HTTPS recommended for production deployment

## 🛠️ Installation

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd tabx
pnpm install
# or npm install
```

2. **Start development server:**
```bash
pnpm dev
# or npm run dev
```

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked" and select `build/chrome-mv3-dev/`

### Production Build

```bash
pnpm build
# Load the extension from build/chrome-mv3-prod/
```

## 💡 How It Works

### Language Detection Flow
```javascript
// Check availability
const availability = await LanguageDetector.availability();

// Create detector with progress monitoring
const detector = await LanguageDetector.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});

// Detect language with confidence scores
const results = await detector.detect(selectedText);
const mostLikelyLanguage = results[0].detectedLanguage;
```

### Translation with Streaming
```javascript
// Create translator for language pair
const translator = await Translator.create({
  sourceLanguage: mostLikelyLanguage,
  targetLanguage: 'ru'
});

// Stream translation updates
const stream = translator.translateStreaming(selectedText);
```

### Summarization
```javascript
// Configure summarizer
const summarizer = await Summarizer.create({
  type: 'key-points',
  length: 'medium'
});

// Generate streaming summary
const stream = summarizer.summarizeStreaming(pageContent);
```

## 🏗️ Architecture

### Key Files

- **`background.ts`**: Extension initialization, context menu, Chrome API setup, summarizer logic
- **`contents/LiveTranslationView.ts`**: Language detection + translation workflow, popover UI
- **`popup.tsx`**: Summarizer interface with streaming updates and user controls
- **`contents/ContentSender.ts`**: Communication between content script and background

### Extension Permissions
```json
{
  "permissions": [
    "contextMenus",
    "tabs", 
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": ["https://*/*"]
}
```

## 🔧 Development

### Available Commands

```bash
# Start development with hot reload
pnpm dev

# Build for production  
pnpm build

# Package for distribution
pnpm package
```

### Testing the APIs

1. **Language Detection**: Select text in different languages and use context menu
2. **Translation**: Test with various language pairs and text lengths  
3. **Summarization**: Try on different websites and content types

### API Availability States

Each API reports one of these states:
- `"readily-available"` - Ready to use immediately
- `"downloadable"` - Available after model download  
- `"no"` - Not supported (insufficient hardware/platform)

## 📚 Learning Resources

### Official Chrome Documentation
- [Translator API](https://developer.chrome.com/docs/ai/translator-api)
- [Language Detection API](https://developer.chrome.com/docs/ai/language-detection)  
- [Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)

### Standards & Compatibility
- APIs are being standardized by the [W3C WebML Working Group](https://www.w3.org/groups/wg/webmachinelearning/)
- Working toward cross-browser compatibility with Mozilla and WebKit

## 🚧 Limitations

- **Desktop only** - Not available on mobile or ChromeOS
- **Hardware dependent** - Requires sufficient GPU and storage
- **Model downloads** - First use requires downloading AI models
- **Sequential processing** - Some operations must be done sequentially
- **User activation** - Some APIs require user interaction to function

## 🤝 Contributing

This project serves as an educational example. Feel free to:
- Report issues with API usage patterns
- Suggest improvements to user experience
- Add support for additional language pairs
- Enhance error handling and edge cases

## 📄 License

This project is built with [Plasmo](https://docs.plasmo.com/) and demonstrates Chrome's built-in AI APIs for educational purposes.

---

**Note**: Chrome's built-in AI APIs are production-ready as of Chrome 138. This extension demonstrates real-world usage patterns and best practices for implementing these APIs in Chrome extensions.