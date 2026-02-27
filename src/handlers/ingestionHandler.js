import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { config } from '../config/awsConfig.js';
import { PolicyIngestionService } from '../services/policyIngestionService.js';
import { processDocument } from './documentHandler.js';

const region = config.aws.region;
const ingestionService = new PolicyIngestionService(
  region,
  config.aws.s3.bucketName,
  'policy-ingestion-metadata'
);

const eventBridgeClient = new EventBridgeClient({ region });

const POLICY_SOURCES = [
  'https://example.gov.in/policies/agriculture/latest.pdf',
  'https://example.gov.in/policies/health/latest.pdf',
  'https://example.gov.in/policies/education/latest.pdf'
];

export async function scheduledIngestion() {
  console.log('Starting scheduled policy ingestion...');
  
  const results = await ingestionService.ingestMultiple(POLICY_SOURCES);
  
  const newPolicies = results.filter(r => r.status === 'ingested');
  
  for (const policy of newPolicies) {
    await triggerProcessing(policy.s3Key);
  }

  return {
    total: results.length,
    ingested: newPolicies.length,
    duplicates: results.filter(r => r.status === 'duplicate').length,
    errors: results.filter(r => r.status === 'error').length,
    results
  };
}

async function triggerProcessing(s3Key) {
  await eventBridgeClient.send(new PutEventsCommand({
    Entries: [{
      Source: 'policy.ingestion',
      DetailType: 'PolicyIngested',
      Detail: JSON.stringify({ s3Key, timestamp: new Date().toISOString() })
    }]
  }));
}

export async function manualIngest(urls) {
  return await ingestionService.ingestMultiple(urls);
}
