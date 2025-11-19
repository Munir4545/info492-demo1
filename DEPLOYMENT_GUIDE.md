# 🚀 24-Hour Cloud Deployment Guide

This guide explains how to deploy the pharmaceutical attack simulation system to run autonomously for 24 hours on a cloud server.

## 📋 Overview

The system consists of:
1. **Pharma Attack Backend** - Autonomous attack simulation with learning system
2. **Synthetic Industry Backend** - Realistic delivery data generator
3. **Synthetic Industry Frontend** - Realistic login and dashboard UI

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed
- MongoDB connection string with password

### Local Docker Testing

1. **Set Environment Variables**
   ```bash
   # Create .env file in pharma-attack-sim/
   echo "MONGODB_PASSWORD=IET69DTditoVtzJz" > pharma-attack-sim/.env
   ```

2. **Build and Run**
   ```bash
   docker-compose up -d --build
   ```

3. **Check Status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

## ☁️ Cloud Deployment (Render)

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub** (ensure render.yaml is in root)

2. **Connect to Render**
   - Go to https://render.com
   - New → Blueprint
   - Connect your GitHub repo
   - Render will detect `render.yaml` and create all services

3. **Set Environment Variables**
   - In Render dashboard, for `pharma-attack-backend` service:
     - `MONGODB_PASSWORD`: Your MongoDB password
     - `SYNTHETIC_API_BASE`: URL of synthetic-industry-backend service

### Option 2: Manual Service Creation

#### Pharma Attack Backend
- **Type**: Web Service
- **Dockerfile Path**: `pharma-attack-sim/backend/Dockerfile`
- **Docker Context**: `pharma-attack-sim/backend`
- **Environment Variables**:
  - `PORT=3001`
  - `MONGODB_PASSWORD` (from secrets)
  - `NODE_ENV=production`
  - `SYNTHETIC_API_BASE` (URL of synthetic backend)

#### Synthetic Industry Backend
- **Type**: Web Service
- **Dockerfile Path**: `synthetic-industry/backend/Dockerfile`
- **Docker Context**: `synthetic-industry/backend`
- **Environment Variables**:
  - `PORT=8007`
  - `NODE_ENV=production`

#### Synthetic Industry Frontend
- **Type**: Web Service
- **Dockerfile Path**: `synthetic-industry/frontend/Dockerfile`
- **Docker Context**: `synthetic-industry/frontend`
- **Environment Variables**:
  - `VITE_API_URL` (URL of synthetic backend)

## 🤖 Starting 24-Hour Autonomous Run

### Method 1: Automatic (via wait-and-trigger.js)

The `wait-and-trigger.js` script automatically starts the autonomous attack loop after servers stabilize:

```bash
# In root directory
npm start
```

This will:
1. Start pharma backend
2. Start synthetic industry backend
3. Wait 15 seconds
4. Trigger autonomous attack loop

### Method 2: Manual API Call

```bash
# After servers are running
curl -X POST http://localhost:3001/api/autonomous/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or use the script:
```bash
cd pharma-attack-sim/backend
npm run start_attack
```

## 📊 Monitoring the 24-Hour Run

### Check Attack Status
```bash
curl http://localhost:3001/api/autonomous/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Learning Insights
```bash
# Get pattern analysis
curl http://localhost:3001/api/learning/patterns?hours=24 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get strategy recommendations
curl http://localhost:3001/api/learning/strategy \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get full report
curl http://localhost:3001/api/learning/report?hours=24 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Logs
```bash
# Docker logs
docker-compose logs -f pharma-attack-backend

# Or if running directly
tail -f pharma-attack-sim/backend/*.log
```

## 📈 Analyzing 24-Hour Data

After 24 hours, run the analysis script:

```bash
cd pharma-attack-sim/backend
npm run analyze
```

This will:
1. Connect to MongoDB
2. Analyze all attacks from the past 24 hours
3. Generate insights on:
   - Success/detection rates
   - Best/worst performing vectors
   - Time-based patterns
   - Target vulnerability patterns
   - Decision-making patterns
4. Save report to `analysis-report.json`

### Report Contents

The analysis report includes:
- **Summary**: Total attacks, success rate, detection rate
- **Best/Worst Vectors**: Which attack methods work best
- **Time Patterns**: Optimal attack times
- **Target Analysis**: Most vulnerable targets
- **Decision Patterns**: Best decision choices
- **Strategy Recommendations**: Actionable insights

## 🧠 Learning System Integration

The agent learns from past runs by:

1. **Pattern Analysis**: Analyzes MongoDB attack logs
2. **Strategy Adaptation**: Adjusts target selection and vector choice
3. **Decision Learning**: Learns which decisions lead to success
4. **Time Optimization**: Identifies best attack windows

### How It Works

- After each attack, results are saved to MongoDB
- The `PatternLearningSystem` queries past attacks
- It calculates success rates, detection rates, and patterns
- The `CampaignManager` uses these insights to:
  - Prioritize vulnerable targets
  - Avoid vigilant targets
  - Select optimal attack vectors
  - Time attacks for maximum success

## 🔒 Security Notes

- MongoDB password is stored in environment variables
- Never commit `.env` files to git
- Use Render's environment variable management
- Frontend uses session-based authentication

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection
node -e "require('mongoose').connect('YOUR_URI').then(() => console.log('OK')).catch(e => console.error(e))"
```

### Docker Build Fails
```bash
# Check Dockerfile syntax
docker build -t test ./pharma-attack-sim/backend

# Check logs
docker-compose logs pharma-attack-backend
```

### Services Not Starting
```bash
# Check health endpoints
curl http://localhost:3001/api/attacks
curl http://localhost:8007/api/synthetic/stats

# Check port conflicts
lsof -i :3001
lsof -i :8007
```

## 📝 Environment Variables Reference

### Pharma Attack Backend
- `PORT`: Server port (default: 3001)
- `MONGODB_PASSWORD`: MongoDB Atlas password
- `NODE_ENV`: Environment (production/development)
- `SYNTHETIC_API_BASE`: Synthetic industry backend URL
- `AUTO_LOOP_DELAY_MS`: Delay between autonomous attacks (default: 5000)
- `SIM_TOTAL_MINUTES`: Total simulation minutes (default: 1440 = 24 hours)
- `SIM_MINUTE_MS`: Real-time per simulated minute (default: 1000)

### Synthetic Industry Backend
- `PORT`: Server port (default: 8007)
- `NODE_ENV`: Environment

### Synthetic Industry Frontend
- `VITE_API_URL`: Backend API URL

## 🎯 Next Steps

1. Deploy to cloud using Render
2. Set environment variables
3. Start autonomous 24-hour run
4. Monitor via dashboard and logs
5. After 24 hours, run analysis script
6. Review insights and adjust strategy

## 📚 Additional Resources

- `DEPLOYMENT_FOR_24H.md` - Detailed 24-hour run guide
- `pharma-attack-sim/backend/scripts/analyze-24hr.js` - Analysis script
- `pharma-attack-sim/backend/pattern-learning.js` - Learning system
- `pharma-attack-sim/backend/campaign-manager.js` - Campaign management

