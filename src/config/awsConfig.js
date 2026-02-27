import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'AWS_REGION',
  'S3_BUCKET_NAME',
  'DYNAMODB_DOCUMENTS_TABLE',
  'DYNAMODB_USERS_TABLE'
];

function validateConfig() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const config = {
  aws: {
    region: process.env.AWS_REGION,
    s3: {
      bucketName: process.env.S3_BUCKET_NAME,
      documentPrefix: 'documents/',
      voicePrefix: 'voice-notes/'
    },
    dynamodb: {
      documentsTable: process.env.DYNAMODB_DOCUMENTS_TABLE,
      usersTable: process.env.DYNAMODB_USERS_TABLE
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

validateConfig();
