#!/bin/bash

# =============================================================================
# Short Video Automation - One-Click Installation Script
# =============================================================================
# This script will install and configure everything you need
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      SHORT VIDEO AUTOMATION - ONE-CLICK INSTALLER            ║
║                                                               ║
║      • Groq API (Kimi K2) - Script Generation                ║
║      • Inworld TTS - Voice & Word-by-Word Subtitles          ║
║      • FFmpeg - Smart Video Looping                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# =============================================================================
# Step 1: Check Prerequisites
# =============================================================================
echo -e "\n${CYAN}[1/7] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from: https://nodejs.org/${NC}"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js found: ${NODE_VERSION}${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed!${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm found: ${NPM_VERSION}${NC}"
fi

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠ FFmpeg is not installed!${NC}"
    echo -e "${YELLOW}Installing FFmpeg...${NC}"

    # Try to install FFmpeg based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y ffmpeg
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    else
        echo -e "${RED}Please install FFmpeg manually from: https://ffmpeg.org/${NC}"
        exit 1
    fi
else
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo -e "${GREEN}✓ FFmpeg found: ${FFMPEG_VERSION}${NC}"
fi

# =============================================================================
# Step 2: Install Backend Dependencies
# =============================================================================
echo -e "\n${CYAN}[2/7] Installing backend dependencies...${NC}"

npm install --legacy-peer-deps || {
    echo -e "${YELLOW}Retrying with different flags...${NC}"
    npm install --force
}

echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# =============================================================================
# Step 3: Install Frontend Dependencies
# =============================================================================
echo -e "\n${CYAN}[3/7] Installing frontend dependencies...${NC}"

cd web-ui
npm install || npm install --legacy-peer-deps
cd ..

echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# =============================================================================
# Step 4: Create .env File
# =============================================================================
echo -e "\n${CYAN}[4/7] Setting up environment configuration...${NC}"

if [ -f .env ]; then
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Skipping .env creation${NC}"
        ENV_EXISTS=true
    fi
fi

if [ "$ENV_EXISTS" != true ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file from template${NC}"
fi

# =============================================================================
# Step 5: Configure API Keys
# =============================================================================
echo -e "\n${CYAN}[5/7] Configuring API keys...${NC}"

echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}You need two API keys to use this tool:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${CYAN}1. Inworld API Key (Text-to-Speech)${NC}"
echo -e "   ${BLUE}→ Get it from: https://studio.inworld.ai${NC}"
echo -e "   ${BLUE}→ Sign up (free tier available)${NC}"
echo -e "   ${BLUE}→ Go to Settings → API Keys → Create New Key${NC}"

echo -e "\n${CYAN}2. Groq API Key (Script Generation - Kimi K2)${NC}"
echo -e "   ${BLUE}→ Get it from: https://console.groq.com${NC}"
echo -e "   ${BLUE}→ Sign up (free tier available)${NC}"
echo -e "   ${BLUE}→ Go to API Keys → Create API Key${NC}"

echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

read -p "$(echo -e ${YELLOW}Do you want to enter API keys now? \(y/N\):${NC} )" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "$(echo -e ${CYAN}Enter your Inworld API Key:${NC} )" INWORLD_KEY
    read -p "$(echo -e ${CYAN}Enter your Groq API Key:${NC} )" GROQ_KEY

    # Update .env file
    sed -i.bak "s/INWORLD_API_KEY=.*/INWORLD_API_KEY=${INWORLD_KEY}/" .env
    sed -i.bak "s/GROQ_API_KEY=.*/GROQ_API_KEY=${GROQ_KEY}/" .env
    rm -f .env.bak

    echo -e "${GREEN}✓ API keys saved to .env${NC}"
else
    echo -e "${YELLOW}⚠ You can add API keys later by editing the .env file${NC}"
fi

# =============================================================================
# Step 6: Create Helper Scripts
# =============================================================================
echo -e "\n${CYAN}[6/7] Creating helper scripts...${NC}"

# Create start-backend.sh
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting backend server..."
npm run dev
EOF
chmod +x start-backend.sh

# Create start-frontend.sh
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting frontend server..."
cd web-ui
npm run dev
EOF
chmod +x start-frontend.sh

# Create start-all.sh
cat > start-all.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
cat << "BANNER"
╔═══════════════════════════════════════════════════════════════╗
║      Starting Short Video Automation                         ║
╚═══════════════════════════════════════════════════════════════╝
BANNER
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${CYAN}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}[1/2] Starting backend...${NC}"
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${GREEN}[2/2] Starting frontend...${NC}"
cd web-ui
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for servers to start
sleep 5

echo -e "\n${GREEN}✓ Both servers are running!${NC}"
echo -e "\n${CYAN}Access the application at:${NC}"
echo -e "  → Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  → Backend:  ${GREEN}http://localhost:3001${NC} (if applicable)"
echo -e "\n${CYAN}Logs:${NC}"
echo -e "  → Backend:  tail -f backend.log"
echo -e "  → Frontend: tail -f frontend.log"
echo -e "\n${CYAN}Press Ctrl+C to stop all servers${NC}\n"

# Wait for user interrupt
wait
EOF
chmod +x start-all.sh

echo -e "${GREEN}✓ Created helper scripts${NC}"

# =============================================================================
# Step 7: Installation Complete
# =============================================================================
echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🎉 INSTALLATION COMPLETE! 🎉                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}📚 Quick Start Guide:${NC}\n"

echo -e "${YELLOW}1. Configure API Keys (if you skipped):${NC}"
echo -e "   ${BLUE}→ Edit .env file and add your keys${NC}"
echo -e "   ${BLUE}→ Or use the web UI Settings page${NC}\n"

echo -e "${YELLOW}2. Start the application:${NC}"
echo -e "   ${GREEN}./start-all.sh${NC}        # Start both backend & frontend"
echo -e "   ${GREEN}./start-backend.sh${NC}    # Start backend only"
echo -e "   ${GREEN}./start-frontend.sh${NC}   # Start frontend only\n"

echo -e "${YELLOW}3. Access the application:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}\n"

echo -e "${YELLOW}4. Create your first video:${NC}"
echo -e "   ${BLUE}→ Click 'Settings' and enter API keys${NC}"
echo -e "   ${BLUE}→ Upload a base video${NC}"
echo -e "   ${BLUE}→ Paste a Quora link${NC}"
echo -e "   ${BLUE}→ Click 'Generate Video'${NC}\n"

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${CYAN}📖 Documentation:${NC}"
echo -e "   ${BLUE}→ README.md - General documentation${NC}"
echo -e "   ${BLUE}→ FRONTEND_GUIDE.md - Detailed user guide${NC}"
echo -e "   ${BLUE}→ web-ui/README.md - Frontend documentation${NC}\n"

echo -e "${CYAN}💬 Need help?${NC}"
echo -e "   ${BLUE}→ Check the documentation${NC}"
echo -e "   ${BLUE}→ Review TEST_RESULTS.md${NC}"
echo -e "   ${BLUE}→ Open an issue on GitHub${NC}\n"

# Ask if user wants to start now
read -p "$(echo -e ${YELLOW}Do you want to start the application now? \(y/N\):${NC} )" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${GREEN}Starting application...${NC}\n"
    ./start-all.sh
else
    echo -e "\n${CYAN}You can start the application anytime by running:${NC}"
    echo -e "${GREEN}./start-all.sh${NC}\n"
fi
