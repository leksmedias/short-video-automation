# Short Video Automation - Web UI

A modern, feature-rich web interface for automating short video creation with AI-powered text-to-speech, word-by-word subtitles, and intelligent video processing.

## Features

### 🎥 Video Upload
- Drag-and-drop or click to upload base videos
- Support for MP4, MOV, and AVI formats
- Video preview with file information
- Max file size: 100MB

### 🎤 Inworld TTS Integration
- High-quality text-to-speech with multiple voices
- Word-level timestamp alignment for perfect subtitle sync
- Voice selection for questions and answers
- Support for different languages

### 📝 Word-by-Word Subtitles
- Automatically generated from TTS timestamps
- Perfect synchronization with audio
- Customizable subtitle styling
- Real-time processing display

### ⚙️ Settings Management
- Easy API key configuration
- Secure credential storage
- Support for multiple TTS providers (Inworld, ElevenLabs)
- OpenAI integration for script generation

### 📊 Real-Time Processing
- Live status updates during video creation
- Step-by-step progress tracking
- Estimated completion time
- Download processed videos

## Getting Started

### Installation

1. Navigate to the web-ui directory:
```bash
cd web-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## Usage

1. **Configure API Keys**: Click Settings and add your Inworld API key
2. **Upload Base Video**: Drag and drop or click to upload
3. **Enter Quora Details**: Paste link and engagement metrics
4. **Select Voices**: Choose TTS voices for question and answer
5. **Generate Video**: Click to start processing
6. **Download**: Get your finished video

See the full README for detailed documentation.
