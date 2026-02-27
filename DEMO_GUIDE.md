# 🎯 Demo-Ready Setup Guide

## Quick Start (No AWS Required)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Demo Mode
```bash
cp .env.example .env
```

The `.env` file is already configured for demo mode:
```
DEMO_MODE=true
```

### 3. Start the Server
```bash
npm start
```

You should see:
```
🚀 Last-Mile Translator API running on port 3000
📍 Environment: development
🎭 Demo Mode: ✅ ENABLED
☁️ AWS Configured: ❌ NO

📖 Access the web interface at: http://localhost:3000
🎯 Try the demo: http://localhost:3000/api/demo/analyze
```

### 4. Open the Web Interface
Open your browser and go to:
```
http://localhost:3000
```

Click the **"🚀 Run Demo Analysis"** button to see the system in action!

---

## What Works in Demo Mode

✅ **Full Pipeline Simulation**
- Document text extraction
- Entity recognition (dates, organizations, locations)
- Plain language summarization
- Key changes detection
- Personalized impact analysis
- Multi-language translation (Hindi, Marathi, Tamil, Telugu)
- Voice note generation (placeholder)

✅ **All Endpoints**
- `GET /api/health` - System status
- `GET /api/demo/analyze` - Complete demo analysis
- `POST /api/documents` - Document upload (demo data)
- `GET /api/documents/:id` - Get document
- `GET /api/documents/:id/translation` - Translate
- `POST /api/documents/:id/voice` - Generate voice
- `POST /api/documents/:id/personalize` - Personalize
- `POST /api/documents/compare` - Compare documents
- `POST /api/users/profile` - Save profile
- `GET /api/users/:userId/profile` - Get profile

✅ **Realistic Delays**
- Simulates actual AWS processing times
- Shows loading indicators
- Feels like real system

---

## Demo Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "demoMode": true,
  "awsConfigured": false,
  "timestamp": "2026-02-27T14:51:15.241Z"
}
```

### Run Demo Analysis
```bash
curl http://localhost:3000/api/demo/analyze
```

Returns complete analysis with:
- Plain language summary
- Detailed summary
- Key changes
- Personal impact (farmer, student)
- Translations (Hindi, Marathi)
- Extracted entities

---

## Switching to AWS Mode

When you're ready to use real AWS services:

### 1. Update `.env`
```bash
DEMO_MODE=false
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
DYNAMODB_DOCUMENTS_TABLE=government-documents
DYNAMODB_USERS_TABLE=user-profiles
```

### 2. Set Up AWS Resources
Follow the instructions in `DEPLOYMENT_CHECKLIST.md`:
- Create S3 bucket
- Create DynamoDB tables
- Enable Bedrock access
- Configure IAM permissions

### 3. Restart Server
```bash
npm start
```

You should see:
```
🚀 Last-Mile Translator API running on port 3000
📍 Environment: development
🎭 Demo Mode: ❌ DISABLED
☁️ AWS Configured: ✅ YES
```

---

## Sample Data

The demo uses a realistic government circular located at:
```
sample-data/sample-policy.txt
```

This is a Maharashtra Agriculture Department circular about:
- Revised subsidy scheme for marginal farmers
- Income limit increased to Rs. 2,00,000
- Subsidy amount increased to Rs. 20,000
- Application deadline: March 31, 2024

---

## Testing the Demo

### Web Interface
1. Open http://localhost:3000
2. Click "🚀 Run Demo Analysis"
3. See results in ~2 seconds

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Demo analysis
curl http://localhost:3000/api/demo/analyze

# Get demo document
curl http://localhost:3000/api/documents/demo-123

# Translate demo document
curl "http://localhost:3000/api/documents/demo-123/translation?language=hindi"

# Personalize demo document
curl -X POST http://localhost:3000/api/documents/demo-123/personalize \
  -H "Content-Type: application/json" \
  -d '{"userProfile":{"demographics":{"occupation":"farmer"}}}'
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Demo Not Working
1. Check `.env` has `DEMO_MODE=true`
2. Restart server: `npm start`
3. Clear browser cache
4. Check console for errors

---

## Project Structure

```
Last-Mile-Translator/
├── src/
│   ├── config/
│   │   ├── awsConfig.js       # Config with demo mode support
│   │   └── demoData.js        # Sample data and responses
│   ├── handlers/
│   │   └── demoHandler.js     # Demo mode handlers
│   └── server.js              # Server with demo routing
├── sample-data/
│   └── sample-policy.txt      # Sample government circular
├── public/
│   └── index.html             # Demo-focused web interface
├── .env.example               # Demo mode enabled by default
└── package.json
```

---

## Features Demonstrated

### 1. Document Processing
- Text extraction from government documents
- Entity recognition (dates, organizations, locations, amounts)
- Key phrase extraction

### 2. AI Translation
- Plain language summarization
- Complex → Simple language conversion
- Action items extraction

### 3. Personalization
- Role-based explanations (farmer, student, business)
- Relevance scoring
- Action requirements and deadlines

### 4. Multi-Language Support
- Hindi translation
- Marathi translation
- Tamil translation
- Telugu translation

### 5. Document Comparison
- Detect changes between versions
- Identify affected groups
- Severity assessment

---

## Next Steps

1. **Demo for Stakeholders**: Use the web interface to show functionality
2. **Test API**: Use curl or Postman to test endpoints
3. **Configure AWS**: When ready, switch to real AWS services
4. **Deploy**: Follow `DEPLOYMENT_CHECKLIST.md` for production deployment

---

## Support

- **Demo Issues**: Check this guide
- **AWS Setup**: See `DEPLOYMENT_CHECKLIST.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`

---

**The project is now fully demo-ready! 🎉**

Run `npm start` and open http://localhost:3000 to see it in action.
