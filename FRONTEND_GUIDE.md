# 🎬 Short Video Automation - Complete Frontend Guide

## 🚀 Quick Start

### Running the Application

1. **Start the Backend** (in root directory):
```bash
npm run dev
```

2. **Start the Frontend** (in web-ui directory):
```bash
cd web-ui
npm install
npm run dev
```

3. **Open Browser**:
```
http://localhost:3000
```

---

## 📸 Features Overview

### 🎥 Video Upload
- **Drag & Drop**: Simply drag your base video into the upload area
- **Click to Browse**: Or click to select from your files
- **Video Preview**: See your video before processing
- **File Info**: View file name and size
- **Supported Formats**: MP4, MOV, AVI (max 100MB)

### 📝 Quora Integration
Enter your Quora question/answer details:
- **Quora Link** (Required): Paste the full Quora URL
- **Upvotes**: Number of upvotes (displayed on video)
- **Comments**: Number of comments
- **Shares**: Number of shares

Example: `https://qr.ae/pKeRZp`

### 🎤 Voice Customization

**Available Voices** (Inworld TTS):
1. **Freya** - Female, warm voice (default for questions)
2. **Dennis** - Male, deep voice (default for answers)
3. **Marcus** - Male, professional
4. **Lily** - Female, youthful
5. **Oliver** - Male, friendly
6. **Emma** - Female, clear

**How to Use**:
- Select different voices for question vs answer
- Creates engaging conversation effect
- All voices provide word-level timing

### ⚙️ Settings Configuration

Click **"Settings"** button in header to configure:

#### Required:
- **Inworld API Key**: Get from [studio.inworld.ai](https://studio.inworld.ai)

#### Optional:
- **ElevenLabs API Key**: Alternative TTS provider
- **OpenAI API Key**: For AI script generation

**Security Features**:
- Password fields with show/hide toggle
- Credentials saved to `.env` file
- Never exposed in frontend code

### 📊 Real-Time Processing

Watch your video being created with live updates:

1. ⏳ **Uploading files** - Sending your video to server
2. 🎤 **Generating audio with Inworld TTS** - Creating speech
3. 📝 **Creating word-by-word subtitles** - Syncing text
4. 🎬 **Merging video and audio** - Combining media
5. ✨ **Applying effects and overlays** - Final touches

**Visual Indicators**:
- Step-by-step progress with icons
- Overall progress bar
- Estimated completion percentage
- Status messages for each phase

---

## 🎯 How to Create Your First Video

### Step 1: Setup (One-time)
1. Open the app at `http://localhost:3000`
2. Click **"Settings"** in the header
3. Paste your **Inworld API Key**
4. Click **"Save Settings"**

### Step 2: Upload Video
1. Find or create a base video (gameplay, stock footage, etc.)
2. Drag and drop into the upload area
3. Wait for preview to load

### Step 3: Enter Details
1. Paste Quora link (e.g., `https://qr.ae/pKeRZp`)
2. Add engagement numbers (optional):
   - Upvotes: `839`
   - Comments: `7`
   - Shares: `3`

### Step 4: Customize Voices
1. **Question Voice**: Choose voice for reading the question
2. **Answer Voice**: Choose voice for reading the answer
3. **Language**: Select language/accent

### Step 5: Generate
1. Click **"Generate Video"** button
2. Watch real-time progress
3. Wait for completion (typically 1-3 minutes)
4. Download your finished video!

---

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: React Icons

### Backend Integration
- **API Routes**: `/api/process-video`, `/api/settings`
- **File Upload**: FormData with multipart
- **Processing**: Async with status updates

### File Structure
```
web-ui/
├── app/
│   ├── dashboard/              # Main dashboard
│   │   └── page.js
│   ├── components/
│   │   ├── VideoUploader.js    # Drag-drop upload
│   │   ├── SettingsModal.js    # API key config
│   │   └── ProcessingStatus.js # Progress tracking
│   ├── api/
│   │   ├── process-video/      # Video processing
│   │   └── settings/           # Settings management
│   └── page.js                 # Home (redirects to dashboard)
└── README.md
```

---

## 🎨 UI Components

### VideoUploader
**Features**:
- Drag-and-drop zone
- File validation
- Video preview
- Remove/replace functionality
- Responsive design

**Usage**:
```jsx
<VideoUploader 
  onVideoSelect={setBaseVideo} 
  selectedVideo={baseVideo} 
/>
```

### SettingsModal
**Features**:
- API key input fields
- Show/hide password toggle
- Load existing settings
- Save to .env file
- Success/error notifications

**Usage**:
```jsx
<SettingsModal 
  isOpen={showSettings} 
  onClose={() => setShowSettings(false)} 
/>
```

### ProcessingStatus
**Features**:
- 5-step progress tracker
- Visual progress bar
- Live status updates
- Completion detection
- Animated transitions

**Usage**:
```jsx
<ProcessingStatus 
  isProcessing={isProcessing} 
  status={processingStatus} 
/>
```

---

## 🐛 Troubleshooting

### Video Upload Issues

**Problem**: Upload not working
**Solutions**:
- Check file size (must be < 100MB)
- Verify format (MP4, MOV, or AVI only)
- Clear browser cache
- Try different browser

**Problem**: Preview not showing
**Solutions**:
- Ensure video codec is supported
- Check browser console for errors
- Try re-uploading the file

### Processing Issues

**Problem**: Processing stuck or failed
**Solutions**:
- Verify Inworld API key in Settings
- Check backend is running (`npm run dev` in root)
- Ensure `.env` file exists in root
- Check console for error messages

**Problem**: "Failed to process video" error
**Solutions**:
- Verify all required fields are filled
- Check API key is valid
- Ensure Quora link is accessible
- Try with a smaller video file

### Settings Issues

**Problem**: Can't save settings
**Solutions**:
- Ensure backend is running
- Check file permissions for .env
- Verify API endpoint is accessible
- Look for errors in browser console

### Subtitle Issues

**Problem**: Subtitles not syncing
**Solutions**:
- Ensure using Inworld TTS (not ElevenLabs)
- Check word alignment data was generated
- Verify VTT file was created
- Review backend logs for errors

---

## 🚀 Performance Tips

1. **Video Size**: Keep base videos under 50MB for faster processing
2. **Format**: Use MP4 with H.264 codec for best compatibility
3. **Network**: Ensure stable internet for API calls
4. **Browser**: Use Chrome or Edge for best performance

---

## 📱 Responsive Design

The interface works on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

---

## 🎓 Best Practices

### Video Selection
- Choose high-quality base videos (1080p recommended)
- Ensure video loops well (seamless transitions)
- Test with different lengths (15-60 seconds ideal)

### Voice Selection
- Use contrasting voices for Q&A (e.g., Freya + Dennis)
- Match voice to content tone
- Test different combinations

### Content Quality
- Choose engaging Quora questions
- Verify links are accessible
- Add accurate engagement metrics

---

## 🔐 Security Notes

- API keys are stored in `.env` file (not in git)
- Never share your API keys
- Use environment variables for production
- Implement rate limiting for production use

---

## 📞 Support

**Common Questions**:
- Check this guide first
- Review troubleshooting section
- Check backend logs
- Test with sample data

**Resources**:
- [Inworld AI Docs](https://docs.inworld.ai)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎉 Example Workflow

```
1. Start both servers (backend + frontend)
   ↓
2. Open http://localhost:3000
   ↓
3. Configure API key in Settings
   ↓
4. Upload base video (drag & drop)
   ↓
5. Paste Quora link: https://qr.ae/pKeRZp
   ↓
6. Add metrics: 839 upvotes, 7 comments, 3 shares
   ↓
7. Select voices: Freya (Q) + Dennis (A)
   ↓
8. Click "Generate Video"
   ↓
9. Watch progress (1-3 minutes)
   ↓
10. Download finished video!
```

---

Enjoy creating amazing short videos automatically! 🎬✨
