import dotenv from 'dotenv';
dotenv.config();

const isDemoMode = process.env.DEMO_MODE === 'true';

const requiredEnvVars = isDemoMode ? [] : [
  'AWS_REGION',
  'S3_BUCKET_NAME',
  'DYNAMODB_DOCUMENTS_TABLE',
  'DYNAMODB_USERS_TABLE'
];

function validateConfig() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.warn(`⚠️  Missing AWS environment variables: ${missing.join(', ')}`);
    console.warn('⚠️  Set DEMO_MODE=true to run without AWS credentials');
  }
}

export const config = {
  demo: {
    enabled: isDemoMode
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || 'demo-bucket',
      documentPrefix: 'documents/',
      voicePrefix: 'voice-notes/'
    },
    dynamodb: {
      documentsTable: process.env.DYNAMODB_DOCUMENTS_TABLE || 'demo-documents',
      usersTable: process.env.DYNAMODB_USERS_TABLE || 'demo-users'
    },
    bedrock: {
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-v2',
      maxTokens: parseInt(process.env.BEDROCK_MAX_TOKENS || '1000'),
      temperature: parseFloat(process.env.BEDROCK_TEMPERATURE || '0.5')
    },
    textract: {
      maxPages: parseInt(process.env.TEXTRACT_MAX_PAGES || '100')
    }
  },
  app: {
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development'
  }
};

if (!isDemoMode) {
  validateConfig();
}

export const isAwsConfigured = () => {
  return !isDemoMode && 
         process.env.AWS_REGION && 
         process.env.S3_BUCKET_NAME && 
         process.env.DYNAMODB_DOCUMENTS_TABLE;
};
