# Short Video Automation

Automate the creation of short videos with text-to-speech, audio merging, image overlay, and background audio.
- It takes average 40 second to create a 35 second short video.


# Example videos
Here are some example videos created using Short Video Automation:

1. A fact video about earth.



https://github.com/ChetanXpro/short-video-automation/assets/107798155/1220d3d7-46ac-4c6f-90ad-9f9529a1bca6




## Overview

Short Video Automation is a tool that simplifies the process of creating short videos. It combines various multimedia elements to produce engaging videos quickly. The key features of this tool include:

1. **AI-Generated Scripts**: Generate scripts with the help of artificial intelligence (AI). These scripts will form the basis of your short videos.

2. **Text-to-Speech**: Convert the generated scripts into audio using text-to-speech technology.

3. **Audio Merging**: Combine the generated audio with a sample video using FFmpeg to create the audio track for your short video.

4. **Image Overlay**: For specific keywords in the script, automatically download images and overlay them on the video.

5. **Background Audio**: Add a background audio track to enhance the video's appeal.

## Usage

### Prerequisites

- Node.js and npm installed
- FFmpeg installed

### Installation

Clone the repository:

```bash
https://github.com/ChetanXpro/short-video-automation.git
cd short-video-automation
```

Install dependencies:

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory with the following environment variables:

```bash
# Inworld API Key for Text-to-Speech (Required)
# Get your API key from: https://studio.inworld.ai
INWORLD_API_KEY=your_inworld_api_key_here

# Groq API Key for Script Generation (Required)
# Get your API key from: https://console.groq.com
# Uses Kimi K2 Instruct model (moonshotai/kimi-k2-instruct-0905)
GROQ_API_KEY=your_groq_api_key_here
```

**Note**: The tool uses:
- **Inworld TTS API** for audio generation:
  - High-quality text-to-speech
  - Word-level timestamp alignment for accurate subtitles
  - Multiple voice options

- **Groq API with Kimi K2 Instruct** for script generation:
  - Ultra-fast script generation and summarization
  - Powered by Moonshot AI's Kimi K2 model
  - Cost-effective alternative to OpenAI

Download and paste a base video which you want to use in project root dir
You can test with this video: https://drive.google.com/file/d/1ZNN3GX2iR74FxrTM_6adDEnl6BA8gKcc/view?usp=sharing

Then find any interesting quora question and answer and paste its link in tool

Run the tool:
```bash
npm run start
```
