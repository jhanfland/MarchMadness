# March Madness Betting Platform - Development Plan

## Tech Stack
- **Backend**: Flask (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **Frontend**: React (Max Hubenko)

## Features
### 1. User Authentication & Account Management
- User registration and login (email & password)
- (If additional security measures are necessary) JWT-based authentication
- Password reset functionality
- Profile management

### 2. Betting System
- View upcoming March Madness games
- Place straight bets or spread bets
- Track betting history
- Calculate winnings/losses based on odds

### 3. Payment Processing
- Deposit funds via Stripe's demo API
- "Withdraw" winnings via Stripe's demo API

### 4. Game Data Integration
- Fetch real-time game updates if possible? schedules, scores, and results via an API (NCAA API?)
- Update betting odds dynamically

### 5. Leaderboards & Social Features
- Display top winners
- Allow users to see what other people are betting on
- Chat for game discussions?

### 6. Admin Panel
- Manage users and transactions
- Adjust betting odds manually if needed

Potential Database Schema
### Users Table
| Column       | Type         | Description |
|-------------|-------------|-------------|
| id          | INT (PK)     | Unique ID   |
| email       | VARCHAR(255) | User email  |
| password    | VARCHAR(255) | Hashed password |
| balance     | FLOAT        | Account balance |

### Bets Table
| Column      | Type         | Description |
|------------|-------------|-------------|
| id         | INT (PK)     | Unique ID   |
| user_id    | INT (FK)     | Reference to Users table |
| game_id    | INT (FK)     | Reference to Games table |
| bet_amount | FLOAT        | Amount wagered |
| bet_type   | VARCHAR(50)  | Type of bet |
| odds       | FLOAT        | Betting odds |
| status     | ENUM        | Pending, Won, Lost |
| created_at | TIMESTAMP   | Bet timestamp |

### Games Table
| Column      | Type         | Description |
|------------|-------------|-------------|
| id         | INT (PK)     | Unique game ID |
| team_1     | VARCHAR(255) | First team |
| team_2     | VARCHAR(255) | Second team |
| start_time | DATETIME     | Game start time |
| winner     | VARCHAR(255) | Winner (NULL if game sint finished) |

### Bracket Table
| Column      | Type         | Description |
|------------|-------------|-------------|
| user_id         | INT (PK)     | Unique ID for the user |
| backet_id     | INT(PK) | Unique bracket ID for user |
| picks     | JSON | JSON object for the bracket's picks |



## Potential API Endpoints
### Authentication
- `POST /api/auth/register`  Register new users
- `POST /api/auth/login`  Authenticate users
- `POST /api/auth/logout`  Logout user

### Betting
- `GET /api/bets`  Get user bets
- `POST /api/bets`  Place a bet
- `GET /api/bets/:id`  Get bet details
- `DELETE /api/bets/:id`  Cancel a bet (if allowed)

### Games
- `GET /api/games`  Get all upcoming games
- `GET /api/games/:id`  Get specific game details

### Payments
- `POST /api/payments/deposit`  "Deposit" money
- `POST /api/payments/withdraw`  "Withdraw" funds

## Frontend Pages
- **Home Page**: Overview of upcoming games & betting options
- **Login/Register**: User authentication
- **Dashboard**: View bets, balance, and history
- **Game Details**: Place bets & view odds
- **Leaderboard**: Display top bettors

## Development Plan
### Phase 1: Backend Development
- Set up Flask project & database
- Implement authentication
- Develop core betting logic
- Set up API endpoints

### Phase 2: Frontend Development
- Set up React project
- Implement authentication UI
- Create betting interface
- Integrate API with frontend

### Phase 3: Testing & Deployment
- Write unit tests to test backend betting logic
- Test frontend interactions to ensure they sync correctly to backend

## Security Measures
- Encrypt passwords before storing in database
- JWT for authentication?

## Above and Beyond
- Mobile app
- More betting types (e.g. parlays, teasers)
- AI-driven betting suggestions



