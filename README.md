# Where's Waldo Photo Tagging Game

A full-stack photo tagging game where players find hidden characters (Waldo, Wizard, and Wilma) in a busy beach scene and compete for the fastest completion times.

## Features
- Interactive photo clicking with targeting crosshair
- Character selection dropdown menu
- Real-time timer tracking
- Score validation and feedback
- Leaderboard with top completion times
- Session-based user tracking
- Responsive design that works on different screen sizes

## Tech Stack
**Frontend:**
- React 18 with functional components and hooks
- Modern CSS with animations and responsive design
- Fetch API for backend communication

**Backend:**
- Node.js with Express.js
- In-memory data storage (no database required)
- Session management for user tracking
- RESTful API endpoints

## Project Structure
\`\`\`
wheres-waldo-app/
├── client/                 # React frontend
│   ├── public/
│   │   └── images/
│   │       └── waldo-scene.jpg
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Game.js
│   │   │   ├── Timer.js
│   │   │   ├── TargetingBox.js
│   │   │   ├── Leaderboard.js
│   │   │   └── NameModal.js
│   │   └── styles/         # Component CSS files
│   └── package.json
└── server/                 # Express API
    ├── server.js          # Main server with in-memory storage
    └── package.json
\`\`\`

## Installation & Setup
### Prerequisites
- Node.js (v14 or higher)
- npm

### Install Dependencies
\`\`\`bash
cd server && npm install
cd ../client && npm install
\`\`\`

### Run the Application
\`\`\`bash
# Terminal 1
cd server && npm start
# http://localhost:5000

# Terminal 2
cd client && npm start
# http://localhost:3000
\`\`\`

## How to Play
1. Click "Start Game"  
2. Click on the beach image → targeting box  
3. Pick a character from dropdown  
4. Correct → green marker  
5. Find all three characters quickly  
6. Enter name → leaderboard  

## Game Mechanics
- Clicks converted to % for responsiveness  
- Validation within 3% tolerance  
- Sessions prevent cheating  
- Timer tracks full duration  

## Characters
- Waldo → red/white stripes, glasses, hat  
- Wizard → robes, beard, hat  
- Wilma → red/white stripes (female Waldo)  

## API Endpoints
- GET /api/characters  
- POST /api/characters/start-game  
- POST /api/characters/validate  
- POST /api/scores  
- GET /api/scores/leaderboard  

## License
Open source project for educational purposes.
