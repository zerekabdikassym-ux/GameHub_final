# GameHub - A Multi-Game Platform with User Profiles

A full-stack gaming platform built with Node.js, Express, MongoDB, and Mongoose. Players can create accounts, play multiple games, and track their scores across different games.

## Project Overview

**GameHub** is an interactive web application that allows users to:
- Register and authenticate securely with JWT tokens
- Play 5 different games: Tic Tac Toe, 2048, Dino Run, Tanks, and Sudoku
- Track their scores for each game in a personal profile
- View global leaderboards
- Access game resources and manage their gaming history

### Games Included:
1. **Tic Tac Toe** - Classic two-player game
2. **2048** - Tile merging puzzle game
3. **Dino Run** - Endless runner game
4. **Tanks** - Tank battle game
5. **Sudoku** - Number puzzle game

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in the backend directory:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamehub
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gamehub

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Start the backend server:**
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Serve the frontend** (using a simple HTTP server):
```bash
# Using Node.js http-server
npx http-server -p 8080
```

Or open `frontend/public/index.html` directly in your browser.

---

## Project Structure

```
GameHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── userController.js     # User profile & scores
│   │   │   └── resourceController.js # Game resources
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   ├── errorMiddleware.js    # Global error handling
│   │   │   └── validate.js           # Data validation
│   │   ├── models/
│   │   │   ├── User.js               # User schema with scores
│   │   │   └── Resource.js           # Game resource schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   ├── userRoutes.js         # User endpoints
│   │   │   ├── resourceRoutes.js     # Resource endpoints
│   │   │   └── externalRoutes.js     # External API integration
│   │   └── validators/
│   │       ├── authValidators.js     # Auth validation schemas
│   │       ├── userValidators.js     # User validation schemas
│   │       └── resourceValidators.js # Resource validation schemas
│   ├── server.js                     # Express app setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html                # Home page
│   │   ├── login.html                # Login page
│   │   ├── signup.html               # Registration page
│   │   ├── profile.html              # User profile with scores table
│   │   ├── 2048.html                 # 2048 game
│   │   ├── dino.html                 # Dino Run game
│   │   ├── tanks.html                # Tanks game
│   │   ├── tictactoe.html            # Tic Tac Toe game
│   │   └── sudoku.html               # Sudoku game
│   └── src/
│       ├── css/
│       │   ├── style.css             # Main stylesheet
│       │   └── weather-widget.css    # Weather widget styles
│       └── js/
│           ├── auth.js               # Authentication functions
│           ├── game2048.js           # 2048 game logic
│           ├── dino.js               # Dino Run game logic
│           ├── tanks.js              # Tanks game logic
│           ├── sudoku.js             # Sudoku game logic
│           ├── tictactoe.js          # Tic Tac Toe game logic
│           ├── leaderboard.js        # Leaderboard display
│           ├── theme.js              # Dark/Light mode toggle
│           ├── weather.js            # Weather API integration
│           └── search.js             # Search functionality
│
└── README.md                         # This file
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints (PUBLIC)

#### 1. Register New User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890"
}
```

**Response (Success - 201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scores": {
    "tictactoe": 0,
    "game2048": 0,
    "dino": 0,
    "tanks": 0,
    "sudoku": 0
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Email already registered",
  "error": "Validation error"
}
```

---

#### 2. Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scores": {
    "tictactoe": 0,
    "game2048": 100,
    "dino": 250,
    "tanks": 50,
    "sudoku": 0
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### User Routes (PRIVATE - Requires JWT Token)

#### 3. Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "avatarUrl": "https://...",
  "scores": {
    "tictactoe": 10,
    "game2048": 100,
    "dino": 250,
    "tanks": 50,
    "sudoku": 0
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 4. Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+9876543210",
  "avatarUrl": "https://example.com/avatar.png"
}
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+9876543210",
  "avatarUrl": "https://example.com/avatar.png",
  "scores": {
    "tictactoe": 10,
    "game2048": 100,
    "dino": 250,
    "tanks": 50,
    "sudoku": 0
  }
}
```

---

#### 5. Update Game Score
```
PUT /api/users/score/:game
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `game`: `tictactoe`, `game2048`, `dino`, `tanks`, or `sudoku`

**Request Body:**
```json
{
  "score": 500
}
```

**Response (Success - 200):**
```json
{
  "message": "Score updated",
  "scores": {
    "tictactoe": 10,
    "game2048": 500,
    "dino": 250,
    "tanks": 50,
    "sudoku": 0
  }
}
```

---

### Resource Routes (PRIVATE)

#### 6. Create Game Resource
```
POST /api/resource
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "gameKey": "sudoku",
  "title": "My Daily Sudoku Challenge",
  "notes": "Working on hard difficulty",
  "score": 100,
  "status": "playing"
}
```

**Response (Success - 201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "gameKey": "sudoku",
  "title": "My Daily Sudoku Challenge",
  "notes": "Working on hard difficulty",
  "score": 100,
  "status": "playing",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 7. Get All User Resources
```
GET /api/resource
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "resources": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "gameKey": "sudoku",
      "title": "My Daily Sudoku Challenge",
      "score": 100,
      "status": "playing",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

#### 8. Get Specific Resource
```
GET /api/resource/:id
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "gameKey": "sudoku",
  "title": "My Daily Sudoku Challenge",
  "notes": "Working on hard difficulty",
  "score": 100,
  "status": "playing",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 9. Update Resource
```
PUT /api/resource/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "score": 150,
  "status": "completed"
}
```

**Response (Success - 200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "gameKey": "sudoku",
  "title": "My Daily Sudoku Challenge",
  "score": 150,
  "status": "completed",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### 10. Delete Resource
```
DELETE /api/resource/:id
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "message": "Resource deleted successfully"
}
```

---

### Leaderboard Routes (PUBLIC)

#### 11. Get Global Leaderboard
```
GET /api/users/leaderboard
```

**Response (Success - 200):**
```json
[
  {
    "rank": 1,
    "username": "pro_gamer_1",
    "totalScore": 800,
    "tictactoe": 50,
    "game2048": 200,
    "dino": 300,
    "tanks": 150,
    "sudoku": 100
  },
  {
    "rank": 2,
    "username": "john_doe",
    "totalScore": 410,
    "tictactoe": 10,
    "game2048": 100,
    "dino": 250,
    "tanks": 50,
    "sudoku": 0
  }
]
```

---

#### 12. Get Game-Specific Leaderboard
```
GET /api/users/leaderboard/:game
```

**Parameters:**
- `game`: `tictactoe`, `game2048`, `dino`, `tanks`, or `sudoku`

**Response (Success - 200):**
```json
[
  {
    "rank": 1,
    "username": "pro_gamer_1",
    "score": 300
  },
  {
    "rank": 2,
    "username": "john_doe",
    "score": 250
  }
]
```

---

## Authentication & Security

### JWT Token
- Tokens are issued upon successful registration or login
- Include the token in the `Authorization` header: `Bearer <token>`
- Tokens expire after 7 days by default

### Password Security
- Passwords are hashed using bcrypt (min 10 rounds)
- Passwords must be at least 6 characters

### Error Handling
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Validation Rules

### User Registration
- **username**: 2-40 characters, unique
- **email**: Valid email format, unique
- **password**: Minimum 6 characters
- **phone**: Optional, any format

### Resource Creation
- **gameKey**: Required, one of: `tictactoe`, `game2048`, `dino`, `tanks`, `sudoku`
- **title**: Required, max 80 characters
- **score**: Minimum 0
- **status**: One of: `planned`, `playing`, `completed`

---

## External API Integration

### Weather Widget (Optional Integration)
The frontend includes a weather widget that integrates with a weather API to display current weather information on the home page.

---

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **bcryptjs** - Password hashing
- **jsonwebtoken (JWT)** - Authentication
- **Joi** - Data validation

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Game logic and interactions
- **LocalStorage** - Client-side data persistence

---

## How to Play

1. **Register** an account on the Sign Up page
2. **Log In** with your credentials
3. **Select a game** from the navigation menu
4. **Play the game** - Your score will be automatically submitted
5. **View Profile** to see your scores across all games
6. **Check Leaderboard** to compare with other players

---

## Features Implemented

✅ User Registration & Authentication  
✅ JWT-based Authorization  
✅ Password Hashing with bcrypt  
✅ User Profile Management  
✅ Game Score Tracking  
✅ Global Leaderboard  
✅ Game-Specific Leaderboards  
✅ Input Validation & Error Handling  
✅ MongoDB Integration with Mongoose  
✅ RESTful API Architecture  
✅ Dark/Light Theme Toggle  
✅ Responsive Design  
✅ 5 Interactive Games  
✅ Score Table on Profile Page

---

## Deployment

The application is ready for deployment on platforms like:
- **Render.com**
- **Railway.app**
- **Heroku**
- **Replit**

Ensure all environment variables are set in the deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

---

## Contributors

- Amir Abil
- Zerek Abdikassym
- Group: IT-2403

---

## License

This project is created for educational purposes as a Final Project assignment.

---

## Support

For issues or questions, please contact the development team or refer to the API documentation above.
