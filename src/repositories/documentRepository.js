import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export class DocumentRepository {
  constructor(region, tableName) {
    const client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async saveDocument(document) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        documentId: document.id,
        fileName: document.fileName,
        s3Key: document.s3Key,
        extractedText: document.extractedText,
        analysis: document.analysis,
        summary: document.summary,
        createdAt: document.createdAt,
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
      }
    });

    try {
      await this.docClient.send(command);
      return { success: true, documentId: document.id };
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  async getDocument(documentId) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { documentId }
    });

    try {
      const response = await this.docClient.send(command);
      return response.Item || null;
    } catch (error) {
      throw new Error(`Failed to retrieve document: ${error.message}`);
    }
  }
}
