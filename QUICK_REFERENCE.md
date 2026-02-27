# Quick Reference - Last-Mile Translator

## 📂 File Structure Quick Reference

```
src/
├── config/
│   └── awsConfig.js              ← All AWS configuration
├── services/                     ← AWS SDK integrations
│   ├── documentIngestion.js      ← Textract (FIXED: async API)
│   ├── processingEngine.js       ← Comprehend
│   ├── translationService.js     ← Bedrock (FIXED: proper invocation)
│   ├── localizationService.js    ← Translate + Polly
│   ├── personalizationService.js ← User personalization
│   └── deltaEngine.js            ← NEW: Document comparison
├── repositories/
│   └── documentRepository.js     ← DynamoDB operations
├── handlers/                     ← Business logic (Lambda-ready)
│   ├── documentHandler.js
│   ├── translationHandler.js
│   ├── userHandler.js
│   └── deltaHandler.js
├── lambda/
│   └── handlers.js               ← Lambda function exports
└── server.js                     ← Express (local testing)
```

## 🚀 Commands

```bash
# Local Development
npm install
cp .env.example .env
npm start                         # Run Express server

# Lambda Deployment
serverless deploy                 # Deploy all functions
serverless deploy function -f documentUpload  # Deploy one function
serverless logs -f documentUpload --tail      # View logs
serverless remove                 # Remove deployment

# AWS Setup
aws s3 mb s3://govt-documents-bucket
aws dynamodb create-table --table-name government-documents ...
aws dynamodb create-table --table-name user-profiles ...
```

## 🔧 Environment Variables

```bash
# Required
AWS_REGION=us-east-1
S3_BUCKET_NAME=govt-documents-bucket
DYNAMODB_DOCUMENTS_TABLE=government-documents
DYNAMODB_USERS_TABLE=user-profiles

# Optional (with defaults)
BEDROCK_MODEL_ID=anthropic.claude-v2
BEDROCK_MAX_TOKENS=1000
BEDROCK_TEMPERATURE=0.5
TEXTRACT_MAX_PAGES=100
PORT=3000
NODE_ENV=development
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Upload & process document |
| GET | `/api/documents/:id` | Get document by ID |
| GET | `/api/documents/:id/translation` | Translate document |
| POST | `/api/documents/:id/voice` | Generate voice note |
| POST | `/api/documents/:id/personalize` | Personalize explanation |
| POST | `/api/documents/compare` | Compare two documents |
| POST | `/api/users/profile` | Save user profile |
| GET | `/api/users/:userId/profile` | Get user profile |
| GET | `/health` | Health check |

## 🧪 Test Commands

```bash
# Upload document
curl -X POST http://localhost:3000/api/documents \
  -F "document=@sample.pdf"

# Get document
curl http://localhost:3000/api/documents/123

# Translate
curl "http://localhost:3000/api/documents/123/translation?language=hindi&format=brief"

# Generate voice
curl -X POST http://localhost:3000/api/documents/123/voice \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample text","language":"en"}'

# Compare documents
curl -X POST http://localhost:3000/api/documents/compare \
  -H "Content-Type: application/json" \
  -d '{"currentDocumentId":"123","previousDocumentId":"456"}'

# Save profile
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{"demographics":{"occupation":"farmer","location":{"state":"Maharashtra"}}}'
```

## 🔍 Key Changes Summary

### What Was Fixed:
1. ✅ **documentIngestion.js** - Now uses async Textract API
2. ✅ **translationService.js** - Fixed Bedrock invocation
3. ✅ **All endpoints** - Now use real data (no mocks)
4. ✅ **Configuration** - Centralized in awsConfig.js
5. ✅ **Architecture** - Separated handlers from routes

### What Was Added:
1. ✅ **deltaEngine.js** - Document comparison service
2. ✅ **documentRepository.js** - DynamoDB storage
3. ✅ **handlers/** - Business logic layer
4. ✅ **lambda/handlers.js** - Lambda function exports
5. ✅ **serverless.yml** - Deployment configuration

## 📊 Service Usage

### Document Ingestion
```javascript
import { DocumentIngestionService } from './services/documentIngestion.js';

const service = new DocumentIngestionService('us-east-1');

// Upload to S3
await service.uploadToS3(buffer, 'file.pdf', 'bucket-name');

// Start Textract job
const jobId = await service.startTextractJob('bucket', 'key');

// Get results (polls automatically)
const results = await service.getTextractResults(jobId);
```

### Translation Service
```javascript
import { TranslationService } from './services/translationService.js';

const service = new TranslationService('us-east-1', 'anthropic.claude-v2', 1000);

// Generate summary
const summary = await service.generatePlainLanguageSummary(text, entities);
// Returns: { brief, detailed, actions, comprehensive }
```

### Delta Engine
```javascript
import { DeltaEngine } from './services/deltaEngine.js';

const engine = new DeltaEngine('us-east-1', 'anthropic.claude-v2');

// Compare documents
const comparison = await engine.compareDocuments(currentText, previousText);
// Returns: { hasChanges, changes, affected, summary, severity }
```

## 🐛 Troubleshooting

### Issue: "Missing required environment variables"
**Fix:** Copy `.env.example` to `.env` and fill in values

### Issue: "Bedrock invocation failed"
**Fix:** Request model access in AWS Bedrock console

### Issue: "Textract job timeout"
**Fix:** Increase `maxRetries` parameter or check document size

### Issue: "Document not found"
**Fix:** Ensure document was saved to DynamoDB after processing

### Issue: "Lambda timeout"
**Fix:** Increase timeout in serverless.yml (currently 300s)

## 📈 Performance Tips

1. **Cold Starts**: Keep Lambda warm with CloudWatch Events
2. **Large Documents**: Use Step Functions for orchestration
3. **Frequent Access**: Add ElastiCache layer
4. **Batch Processing**: Use SQS queue
5. **Cost Optimization**: Set DynamoDB TTL (already configured)

## 🔒 Security Checklist

- [x] No credentials in code
- [x] S3 encryption enabled
- [x] IAM role-based access
- [x] Environment variables for config
- [ ] Add input validation
- [ ] Add API authentication
- [ ] Add rate limiting
- [ ] Add VPC configuration
- [ ] Add WAF rules

## 📚 Documentation Files

- `ANALYSIS.md` - Complete problem analysis and fixes
- `REFACTOR.md` - Refactoring details and deployment
- `ARCHITECTURE.md` - System architecture diagrams
- `SETUP.md` - Original setup guide
- `README.md` - Project overview
- `QUICK_REFERENCE.md` - This file

## 🎯 Next Steps

1. **Test Locally**: Run `npm start` and test all endpoints
2. **Deploy to AWS**: Run `serverless deploy`
3. **Test Lambda**: Use AWS Console or Postman
4. **Monitor**: Check CloudWatch Logs
5. **Optimize**: Add caching, queues, etc.

## 💡 Pro Tips

- Use `serverless invoke local` to test Lambda functions locally
- Enable X-Ray tracing for debugging
- Set up CloudWatch alarms for errors
- Use AWS SAM for local Lambda testing
- Keep Lambda functions under 50MB for faster cold starts
