# Last-Mile Translator - Refactored Architecture

## 📁 Updated Folder Structure

```
Last-Mile-Translator/
├── src/
│   ├── config/
│   │   └── awsConfig.js              # Centralized AWS configuration
│   ├── services/                     # AWS service integrations
│   │   ├── documentIngestion.js     # Textract (async jobs)
│   │   ├── processingEngine.js      # Comprehend NLP
│   │   ├── translationService.js    # Bedrock AI (fixed)
│   │   ├── localizationService.js   # Translate + Polly
│   │   ├── personalizationService.js # User personalization
│   │   └── deltaEngine.js           # NEW: Document comparison
│   ├── repositories/                 # Data access layer
│   │   └── documentRepository.js    # DynamoDB operations
│   ├── handlers/                     # Business logic (Lambda-ready)
│   │   ├── documentHandler.js       # Document processing logic
│   │   ├── translationHandler.js    # Translation logic
│   │   ├── userHandler.js           # User operations logic
│   │   └── deltaHandler.js          # Comparison logic
│   ├── lambda/
│   │   └── handlers.js              # Lambda function handlers
│   └── server.js                     # Express server (local testing)
├── public/
│   └── index.html                    # Web frontend
├── serverless.yml                    # Serverless Framework config
├── package.json
├── .env.example
└── REFACTOR.md                       # This file
```

## 🔧 Key Changes

### 1. Centralized Configuration
- All AWS settings in `config/awsConfig.js`
- Environment variable validation at startup
- No hardcoded credentials or settings

### 2. Fixed AWS Services

#### documentIngestion.js
- ✅ Uses async `StartDocumentAnalysis` (production-safe)
- ✅ Polls for job completion
- ✅ Proper error handling
- ✅ S3 encryption enabled

#### translationService.js
- ✅ Correct Bedrock Runtime client usage
- ✅ Structured JSON output
- ✅ Proper error handling
- ✅ Configurable model ID and parameters

### 3. New Services

#### deltaEngine.js
- Semantic document comparison using Bedrock
- Returns structured JSON:
  - `changes`: List of specific changes
  - `affected`: Groups/people affected
  - `summary`: Overall impact summary
  - `severity`: low/medium/high

### 4. Lambda-Compatible Architecture

#### Separation of Concerns
- **Services**: AWS SDK interactions
- **Repositories**: Data persistence
- **Handlers**: Business logic (reusable)
- **Lambda handlers**: Event transformation
- **Express server**: Local testing only

#### No Local Filesystem Dependencies
- All file operations use S3
- No temp file storage
- Memory-based processing

### 5. Production-Ready Features
- ✅ Document storage in DynamoDB
- ✅ Proper error handling throughout
- ✅ No mock/placeholder data
- ✅ Async Textract for large documents
- ✅ Structured logging
- ✅ TTL on DynamoDB items

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your AWS settings

# Run Express server
npm start

# Access at http://localhost:3000
```

## ☁️ Lambda Deployment

### Using Serverless Framework

```bash
# Install Serverless
npm install -g serverless

# Deploy to AWS
serverless deploy --stage dev

# Deploy specific function
serverless deploy function -f documentUpload

# View logs
serverless logs -f documentUpload --tail

# Remove deployment
serverless remove
```

### Manual Lambda Deployment

1. **Create deployment package:**
```bash
npm install --production
zip -r function.zip src/ node_modules/ package.json
```

2. **Upload to Lambda:**
- Create Lambda function in AWS Console
- Upload function.zip
- Set handler: `src/lambda/handlers.documentUploadHandler`
- Configure environment variables
- Set timeout to 300 seconds
- Set memory to 512 MB

3. **Configure API Gateway:**
- Create REST API
- Create resources and methods
- Integrate with Lambda functions
- Enable CORS
- Deploy API

## 📊 AWS Resources Required

### DynamoDB Tables

**government-documents:**
```bash
aws dynamodb create-table \
  --table-name government-documents \
  --attribute-definitions AttributeName=documentId,AttributeType=S \
  --key-schema AttributeName=documentId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**user-profiles:**
```bash
aws dynamodb create-table \
  --table-name user-profiles \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### S3 Bucket

```bash
aws s3 mb s3://govt-documents-bucket --region us-east-1

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket govt-documents-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### IAM Role (for Lambda)

Create role with policies for:
- S3: PutObject, GetObject
- DynamoDB: PutItem, GetItem, Query
- Textract: StartDocumentAnalysis, GetDocumentAnalysis
- Comprehend: DetectEntities, DetectKeyPhrases
- Bedrock: InvokeModel
- Translate: TranslateText
- Polly: SynthesizeSpeech

## 🔍 Example Lambda Handler Usage

```javascript
// Lambda event for document upload
{
  "body": "{\"file\":\"base64encodedcontent\",\"fileName\":\"document.pdf\"}",
  "pathParameters": null,
  "queryStringParameters": null
}

// Lambda event for translation
{
  "pathParameters": { "id": "1234567890" },
  "queryStringParameters": { "language": "hindi", "format": "brief" }
}

// Lambda event for comparison
{
  "body": "{\"currentDocumentId\":\"123\",\"previousDocumentId\":\"456\"}"
}
```

## 🧪 Testing

### Test Document Processing
```bash
curl -X POST http://localhost:3000/api/documents \
  -F "document=@sample.pdf"
```

### Test Translation
```bash
curl "http://localhost:3000/api/documents/123/translation?language=hindi"
```

### Test Comparison
```bash
curl -X POST http://localhost:3000/api/documents/compare \
  -H "Content-Type: application/json" \
  -d '{"currentDocumentId":"123","previousDocumentId":"456"}'
```

## ⚠️ Important Notes

1. **Bedrock Access**: Request model access in AWS Console before use
2. **Textract Async**: Jobs can take 30-60 seconds for large documents
3. **Lambda Timeout**: Set to 300 seconds for Textract polling
4. **Memory**: 512MB minimum for document processing
5. **Cold Starts**: First invocation may take 5-10 seconds

## 🎯 What Was Fixed

### Problems Resolved:
1. ✅ Removed hardcoded AWS credentials
2. ✅ Fixed Textract to use async API
3. ✅ Fixed Bedrock invocation with proper error handling
4. ✅ Removed all mock/placeholder data
5. ✅ Separated business logic from Express routes
6. ✅ Made Lambda-compatible handlers
7. ✅ Added document storage in DynamoDB
8. ✅ Created delta engine for comparisons
9. ✅ Centralized configuration
10. ✅ Removed filesystem dependencies

### Production-Ready Features Added:
- Document versioning support
- Proper error handling
- Structured logging
- S3 encryption
- DynamoDB TTL
- Async job processing
- Retry logic ready (can be added)
- CloudWatch compatible logging
