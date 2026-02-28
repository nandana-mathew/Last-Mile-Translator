# Last-Mile Translator - Deployment Guide

## Quick Start

### Prerequisites
- AWS Account with credentials configured
- Node.js 18+ installed
- AWS CLI installed and configured

### Configuration

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Update `.env` with your values:**
```
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
DYNAMODB_DOCUMENTS_TABLE=government-documents
DYNAMODB_USERS_TABLE=user-profiles
DEMO_MODE=false
```

---

## Deployment Commands

### Windows

**Deploy Backend:**
```cmd
serverless deploy --stage prod --region us-east-1
```

**Upload Frontend:**
```cmd
upload-frontend.bat
```

Or use the all-in-one script:
```cmd
deploy-complete-system.bat
```

---

### Mac / Linux / WSL

**Make scripts executable:**
```bash
chmod +x upload-frontend.sh
chmod +x deploy-complete-system.sh
```

**Deploy Backend:**
```bash
serverless deploy --stage prod --region us-east-1
```

**Upload Frontend:**
```bash
./upload-frontend.sh
```

Or use the all-in-one script:
```bash
./deploy-complete-system.sh
```

---

## Manual Deployment

If scripts don't work, use these commands directly:

### 1. Deploy Backend
```bash
serverless deploy --stage prod --region us-east-1
```

### 2. Find Your S3 Bucket
```bash
# Windows
aws s3 ls | findstr last-mile

# Mac/Linux/WSL
aws s3 ls | grep last-mile
```

### 3. Upload Frontend
```bash
aws s3 sync ./public s3://YOUR-BUCKET-NAME --delete
```

Replace `YOUR-BUCKET-NAME` with the bucket name from step 2.

---

## AWS Permissions Required

The system uses these AWS services:
- **S3** - Document storage and static website hosting
- **Lambda** - Serverless functions
- **API Gateway** - REST API endpoints
- **DynamoDB** - Document and user data storage
- **Textract** - PDF text extraction (OCR)
- **Translate** - Language translation
- **Polly** - Text-to-speech
- **SNS** - SMS notifications

Make sure your AWS account has access to these services.

---

## Testing

After deployment:

1. **Get your website URL:**
   - Format: `http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com`
   - Or check S3 console → Properties → Static website hosting

2. **Clear browser cache:**
   - Windows: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`

3. **Hard refresh:**
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

4. **Test features:**
   - Upload a PDF document
   - Subscribe to policy updates
   - Change language
   - Click on policy cards

---

## Troubleshooting

### Backend deployment fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Serverless version
serverless --version
```

### Frontend upload fails
```bash
# Verify bucket exists
aws s3 ls s3://YOUR-BUCKET-NAME

# Check bucket permissions
aws s3api get-bucket-policy --bucket YOUR-BUCKET-NAME
```

### Website shows 403 Forbidden
Run the fix script:
```bash
# Windows
fix-bucket-access.bat

# Mac/Linux/WSL
chmod +x fix-bucket-access.sh
./fix-bucket-access.sh
```

### CORS errors in browser
Make sure you deployed the latest backend:
```bash
serverless deploy --stage prod --region us-east-1
```

---

## Project Structure

```
├── public/              # Frontend files
│   ├── index.html      # Main website
│   ├── policy.html     # Policy details page
│   └── config.js       # API configuration
├── src/
│   ├── handlers/       # Business logic
│   ├── lambda/         # Lambda function handlers
│   ├── services/       # AWS service integrations
│   └── config/         # Configuration
├── serverless.yml      # AWS infrastructure config
└── .env               # Environment variables
```

---

## Support

For issues:
1. Check AWS CloudWatch logs for Lambda errors
2. Check browser console for frontend errors
3. Verify all AWS services are available in your region
4. Ensure AWS credentials have proper permissions

---

## Cost Estimate

With AWS Free Tier:
- Lambda: 1M requests/month free
- S3: 5GB storage free
- Textract: 1,000 pages/month free
- API Gateway: 1M requests/month free

Estimated cost after free tier: $5-20/month depending on usage.
