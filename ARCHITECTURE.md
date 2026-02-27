# Last-Mile Translator - Architecture Diagram

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (index.html)  │  Mobile App  │  API Clients        │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                 │
├─────────────────────────────────────────────────────────────────┤
│  - CORS Enabled                                                  │
│  - Rate Limiting (recommended)                                   │
│  - Authentication (recommended)                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   Lambda     │      │   Express    │
│  Functions   │      │   Server     │
│ (Production) │      │   (Local)    │
└──────┬───────┘      └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HANDLER LAYER (Business Logic)              │
├─────────────────────────────────────────────────────────────────┤
│  documentHandler.js  │  translationHandler.js  │  userHandler.js│
│  deltaHandler.js                                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER (AWS Integration)             │
├─────────────────────────────────────────────────────────────────┤
│ documentIngestion │ processingEngine │ translationService       │
│ localizationService │ personalizationService │ deltaEngine      │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Textract  │  Comprehend  │  Bedrock  │  Translate  │  Polly    │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  S3 (Documents)  │  DynamoDB (Metadata)  │  DynamoDB (Users)    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Document Processing Flow

```
1. Upload Document
   │
   ├─► Express/Lambda Handler
   │   └─► documentHandler.processDocument()
   │       │
   │       ├─► documentIngestion.uploadToS3()
   │       │   └─► S3: Store PDF/Image
   │       │
   │       ├─► documentIngestion.startTextractJob()
   │       │   └─► Textract: Start async analysis
   │       │
   │       ├─► documentIngestion.getTextractResults()
   │       │   └─► Textract: Poll for completion
   │       │
   │       ├─► processingEngine.analyzeContent()
   │       │   └─► Comprehend: Extract entities
   │       │
   │       ├─► translationService.generatePlainLanguageSummary()
   │       │   └─► Bedrock: Generate summary
   │       │
   │       └─► documentRepository.saveDocument()
   │           └─► DynamoDB: Store metadata
   │
   └─► Return: { documentId, summary, analysis }
```

## 🌐 Translation Flow

```
2. Translate Document
   │
   ├─► Express/Lambda Handler
   │   └─► translationHandler.translateDocument()
   │       │
   │       ├─► documentRepository.getDocument()
   │       │   └─► DynamoDB: Fetch document
   │       │
   │       └─► localizationService.translateToLocalLanguage()
   │           └─► AWS Translate: Translate text
   │
   └─► Return: { language, translation }
```

## 🔊 Voice Generation Flow

```
3. Generate Voice Note
   │
   ├─► Express/Lambda Handler
   │   └─► translationHandler.generateVoiceNote()
   │       │
   │       ├─► localizationService.generateVoiceNote()
   │       │   ├─► Polly: Synthesize speech
   │       │   └─► S3: Upload audio file
   │       │
   │       └─► Return: { url, duration }
```

## 🔍 Document Comparison Flow

```
4. Compare Documents
   │
   ├─► Express/Lambda Handler
   │   └─► deltaHandler.compareDocuments()
   │       │
   │       ├─► documentRepository.getDocument() [current]
   │       ├─► documentRepository.getDocument() [previous]
   │       │
   │       └─► deltaEngine.compareDocuments()
   │           └─► Bedrock: Semantic comparison
   │
   └─► Return: { changes, affected, summary, severity }
```

## 👤 Personalization Flow

```
5. Personalize Explanation
   │
   ├─► Express/Lambda Handler
   │   └─► userHandler.personalizeDocument()
   │       │
   │       ├─► documentRepository.getDocument()
   │       │   └─► DynamoDB: Fetch document
   │       │
   │       └─► personalizationService.generatePersonalizedExplanation()
   │           ├─► Calculate relevance score
   │           └─► Build personalized text
   │
   └─► Return: { relevanceScore, explanation, actionRequired }
```

## 🗂️ Data Models

### Document Model (DynamoDB)
```javascript
{
  documentId: "1234567890",           // Partition Key
  fileName: "circular-2024.pdf",
  s3Key: "documents/1234567890-circular-2024.pdf",
  extractedText: "Full text...",
  analysis: {
    entities: { dates: [...], organizations: [...] },
    keyPhrases: [...]
  },
  summary: {
    brief: "Short summary",
    detailed: "Detailed explanation",
    actions: ["Action 1", "Action 2"]
  },
  createdAt: "2026-02-27T20:00:00Z",
  ttl: 1709078400                     // 1 year expiry
}
```

### User Profile Model (DynamoDB)
```javascript
{
  userId: "user-1234567890",          // Partition Key
  demographics: {
    occupation: "farmer",
    location: { state: "Maharashtra", district: "Pune" },
    languages: ["hindi", "marathi"]
  },
  interests: ["agriculture", "subsidies"],
  subscriptions: {
    documentTypes: ["circular", "notice"],
    deliveryMethod: "web",
    frequency: "immediate"
  },
  createdAt: "2026-02-27T20:00:00Z"
}
```

## 🔐 IAM Permissions Required

```yaml
Lambda Execution Role:
  - s3:PutObject, s3:GetObject
  - dynamodb:PutItem, dynamodb:GetItem, dynamodb:Query
  - textract:StartDocumentAnalysis, textract:GetDocumentAnalysis
  - comprehend:DetectEntities, comprehend:DetectKeyPhrases
  - bedrock:InvokeModel
  - translate:TranslateText
  - polly:SynthesizeSpeech
  - logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents
```

## 📊 Scalability Considerations

### Current Architecture Supports:
- **Concurrent Users**: 1000+ (Lambda auto-scaling)
- **Document Size**: Up to 500 pages (Textract async)
- **Processing Time**: 30-60 seconds per document
- **Storage**: Unlimited (S3 + DynamoDB)

### Bottlenecks to Monitor:
- Textract job queue (max 100 concurrent jobs per account)
- Bedrock throttling (varies by model)
- DynamoDB read/write capacity (on-demand handles spikes)
- Lambda concurrent executions (default 1000, can increase)

### Optimization Strategies:
1. Add SQS queue for document processing
2. Use Step Functions for orchestration
3. Add ElastiCache for frequently accessed documents
4. Use CloudFront for static assets
5. Implement request batching for translations

## 🎯 Deployment Checklist

- [ ] Create S3 bucket with encryption
- [ ] Create DynamoDB tables (documents + users)
- [ ] Request Bedrock model access
- [ ] Configure environment variables
- [ ] Deploy Lambda functions (serverless deploy)
- [ ] Test all endpoints
- [ ] Set up CloudWatch alarms
- [ ] Configure API Gateway custom domain
- [ ] Enable CloudWatch Logs
- [ ] Set up monitoring dashboard
