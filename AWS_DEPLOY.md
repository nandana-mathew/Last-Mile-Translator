# AWS DEPLOYMENT CHECKLIST

## Step 1: Create S3 Bucket
```bash
aws s3 mb s3://govt-documents-bucket --region us-east-1

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

## Step 2: Create DynamoDB Tables
```bash
# Documents table
aws dynamodb create-table \
  --table-name government-documents \
  --attribute-definitions AttributeName=documentId,AttributeType=S \
  --key-schema AttributeName=documentId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Users table
aws dynamodb create-table \
  --table-name user-profiles \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Policy ingestion metadata
aws dynamodb create-table \
  --table-name policy-ingestion-metadata \
  --attribute-definitions \
    AttributeName=policyId,AttributeType=S \
    AttributeName=sourceUrl,AttributeType=S \
  --key-schema AttributeName=policyId,KeyType=HASH \
  --global-secondary-indexes '[{
    "IndexName": "url-index",
    "KeySchema": [{"AttributeName":"sourceUrl","KeyType":"HASH"}],
    "Projection": {"ProjectionType":"ALL"}
  }]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Step 3: Enable Bedrock Access
1. Go to AWS Console → Bedrock
2. Click "Model access" in left menu
3. Click "Manage model access"
4. Select "Anthropic - Claude"
5. Click "Request model access"
6. Wait 5-10 minutes for approval

## Step 4: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```
DEMO_MODE=false
AWS_REGION=us-east-1
S3_BUCKET_NAME=govt-documents-bucket
DYNAMODB_DOCUMENTS_TABLE=government-documents
DYNAMODB_USERS_TABLE=user-profiles
BEDROCK_MODEL_ID=anthropic.claude-v2
```

## Step 5: Install Serverless Framework
```bash
npm install -g serverless
```

## Step 6: Configure AWS Credentials
```bash
serverless config credentials \
  --provider aws \
  --key YOUR_ACCESS_KEY \
  --secret YOUR_SECRET_KEY
```

## Step 7: Deploy to Lambda
```bash
serverless deploy --stage prod
```

## Step 8: Test Deployment
```bash
# Get API URL from deploy output
API_URL="https://xxx.execute-api.us-east-1.amazonaws.com/prod"

# Test health
curl $API_URL/api/health

# Test recent policies
curl $API_URL/api/policies/recent
```

## Step 9: Configure SNS for SMS (Optional)
```bash
aws sns set-sms-attributes \
  --attributes DefaultSMSType=Transactional
```

## Step 10: Monitor
1. Go to CloudWatch → Logs
2. Check `/aws/lambda/last-mile-translator-prod-*`
3. Set up alarms for errors

## Done! ✅
Your application is now live on AWS Lambda.
