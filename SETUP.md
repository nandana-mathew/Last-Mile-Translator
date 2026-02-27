# Last-Mile Translator - Setup Guide

## Prerequisites
- Node.js 18+ installed
- AWS Account with appropriate permissions
- AWS CLI configured

## AWS Services Setup

### 1. S3 Bucket
```bash
aws s3 mb s3://govt-documents-bucket --region us-east-1
```

### 2. DynamoDB Table
```bash
aws dynamodb create-table \
    --table-name user-profiles \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3. IAM Permissions
Ensure your AWS credentials have permissions for:
- Amazon Textract (AnalyzeDocument)
- Amazon Comprehend (DetectEntities, DetectKeyPhrases)
- Amazon Bedrock (InvokeModel)
- Amazon Translate (TranslateText)
- Amazon Polly (SynthesizeSpeech)
- S3 (PutObject, GetObject)
- DynamoDB (PutItem, GetItem, Query)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your AWS credentials:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=govt-documents-bucket
DYNAMODB_TABLE_NAME=user-profiles
PORT=3000
```

## Running the Application

### Start the API server:
```bash
npm start
```

### For development with auto-reload:
```bash
npm run dev
```

### Access the web interface:
Open `public/index.html` in your browser or serve it with:
```bash
npx serve public
```

## API Endpoints

### Document Processing
- `POST /api/documents` - Upload and process a government document
- `GET /api/documents/:id/translation` - Get translated version
- `POST /api/documents/:id/voice` - Generate voice note
- `POST /api/documents/:id/personalize` - Get personalized explanation

### User Management
- `POST /api/users/profile` - Create/update user profile
- `GET /api/users/:userId/profile` - Get user profile

### Health Check
- `GET /health` - Check API status

## Testing

### Test document upload:
```bash
curl -X POST http://localhost:3000/api/documents \
  -F "document=@sample-document.pdf"
```

### Test translation:
```bash
curl "http://localhost:3000/api/documents/123/translation?language=hindi"
```

### Test profile creation:
```bash
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "demographics": {
      "occupation": "farmer",
      "location": {"state": "Maharashtra", "district": "Pune"},
      "languages": ["hindi"]
    }
  }'
```

## Architecture

```
┌─────────────────┐
│   Web Frontend  │
│  (index.html)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Express API   │
│   (index.js)    │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┬─────────────┐
    ▼         ▼        ▼          ▼             ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌──────────┐
│Textract│ │Compre│ │Bedrock │ │Trans │ │  Polly   │
│        │ │ hend │ │  (LLM) │ │ late │ │ (Voice)  │
└────────┘ └──────┘ └────────┘ └──────┘ └──────────┘
    │         │         │          │          │
    └─────────┴─────────┴──────────┴──────────┘
                        │
                ┌───────┴────────┐
                ▼                ▼
            ┌──────┐      ┌──────────┐
            │  S3  │      │ DynamoDB │
            └──────┘      └──────────┘
```

## Features Implemented

✅ Document ingestion (PDF/Image upload)
✅ Text extraction using AWS Textract
✅ Entity recognition using AWS Comprehend
✅ Plain language summarization using AWS Bedrock
✅ Multi-language translation using AWS Translate
✅ Voice note generation using AWS Polly
✅ User profile management with DynamoDB
✅ Personalized explanations based on user context
✅ Web interface for demo

## Cost Estimation (AWS)

For a hackathon demo with ~100 documents:
- Textract: ~$1.50 per 1000 pages
- Comprehend: ~$0.0001 per unit
- Bedrock: ~$0.01 per 1000 tokens
- Translate: ~$15 per million characters
- Polly: ~$4 per million characters
- S3: Negligible for small files
- DynamoDB: Free tier covers demo usage

**Estimated demo cost: < $10**

## Troubleshooting

### AWS Credentials Error
- Ensure AWS CLI is configured: `aws configure`
- Check IAM permissions for all required services

### Bedrock Access Error
- Request access to Claude models in AWS Bedrock console
- Ensure your region supports Bedrock (us-east-1, us-west-2)

### CORS Issues
- If accessing from different domain, update CORS settings in index.js

## Next Steps

1. Add document storage and retrieval
2. Implement change detection between document versions
3. Add SMS/WhatsApp delivery via AWS SNS
4. Create mobile app with React Native
5. Add human validation workflow
6. Implement feedback collection system

## License

MIT
