import { TextractClient, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class DocumentIngestionService {
  constructor(region) {
    this.textractClient = new TextractClient({ region });
    this.s3Client = new S3Client({ region });
  }

  async uploadToS3(fileBuffer, fileName, bucketName) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ServerSideEncryption: 'AES256'
    });
    
    try {
      await this.s3Client.send(command);
      return { success: true, key: fileName };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  async startTextractJob(bucketName, s3Key) {
    const command = new StartDocumentAnalysisCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: s3Key
        }
      },
      FeatureTypes: ['TABLES', 'FORMS']
    });

    try {
      const response = await this.textractClient.send(command);
      return response.JobId;
    } catch (error) {
      throw new Error(`Textract job start failed: ${error.message}`);
    }
  }

  async getTextractResults(jobId, maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
      const command = new GetDocumentAnalysisCommand({ JobId: jobId });
      const response = await this.textractClient.send(command);

      if (response.JobStatus === 'SUCCEEDED') {
        return this.parseTextractResponse(response);
      } else if (response.JobStatus === 'FAILED') {
        throw new Error('Textract job failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Textract job timeout');
  }

  parseTextractResponse(response) {
    const blocks = response.Blocks || [];
    const lines = blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n');

    const tables = blocks
      .filter(block => block.BlockType === 'TABLE')
      .map(table => ({ id: table.Id, confidence: table.Confidence }));

    const keyValues = blocks
      .filter(block => block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY'))
      .map(kv => ({ id: kv.Id, confidence: kv.Confidence }));

    return { 
      text: lines, 
      tables, 
      keyValues,
      pageCount: response.DocumentMetadata?.Pages || 0
    };
  }
}
