# Setup Instructions

## Quick Start

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure Environment** (Optional)
   
   Create `backend/.env`:
   ```env
   PORT=3001
   JWT_SECRET=your-secret-key
   OPENROUTER_API_KEY=your-api-key-here
   NODE_ENV=development
   ```
   
   > Note: System works without OpenRouter API key (uses simulated responses)

4. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start Frontend** (in new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access Application**
   - Open http://localhost:3000
   - Login with: `demo` / `demo123`

## Database

The SQLite database is automatically created in `backend/data/database.sqlite` on first run.

A demo user is automatically created:
- Username: `demo`
- Password: `demo123`

## Troubleshooting

### Port Already in Use
- Change PORT in `backend/.env` or kill the process using port 3001

### Module Not Found
- Run `npm install` in both backend and frontend directories

### Database Errors
- Delete `backend/data/database.sqlite` and restart the server

### WebSocket Connection Failed
- Ensure backend is running on port 3001
- Check browser console for CORS errors

