import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';

export class PolicyIngestionService {
  constructor(region, bucketName, tableName) {
    this.s3Client = new S3Client({ region });
    const dynamoClient = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(dynamoClient);
    this.bucketName = bucketName;
    this.tableName = tableName;
  }

  async fetchPolicyFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    return Buffer.from(await response.arrayBuffer());
  }

  async checkIfExists(url, contentHash) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'url-index',
      KeyConditionExpression: 'sourceUrl = :url',
      ExpressionAttributeValues: { ':url': url }
    });
    
    const result = await this.docClient.send(command);
    return result.Items?.some(item => item.contentHash === contentHash);
  }

  async uploadToS3(buffer, fileName) {
    const key = `ingested/${Date.now()}-${fileName}`;
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ServerSideEncryption: 'AES256'
    }));
    return key;
  }

  async saveMetadata(url, s3Key, contentHash) {
    await this.docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        policyId: `policy-${Date.now()}`,
        sourceUrl: url,
        s3Key,
        contentHash,
        status: 'pending',
        ingestedAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
      }
    }));
  }

  async ingestPolicy(url) {
    const buffer = await this.fetchPolicyFromUrl(url);
    const contentHash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    if (await this.checkIfExists(url, contentHash)) {
      return { status: 'duplicate', url };
    }

    const fileName = url.split('/').pop() || 'policy.pdf';
    const s3Key = await this.uploadToS3(buffer, fileName);
    await this.saveMetadata(url, s3Key, contentHash);

    return { status: 'ingested', url, s3Key, contentHash };
  }

  async ingestMultiple(urls) {
    const results = [];
    for (const url of urls) {
      try {
        const result = await this.ingestPolicy(url);
        results.push(result);
      } catch (error) {
        results.push({ status: 'error', url, error: error.message });
      }
    }
    return results;
  }
}
