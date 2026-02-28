import { config } from '../config/awsConfig.js';
import { DocumentIngestionService } from '../services/documentIngestion.js';
import { DocumentRepository } from '../repositories/documentRepository.js';

const region = config.aws.region;
const ingestionService = new DocumentIngestionService(region);
const documentRepository = new DocumentRepository(region, config.aws.dynamodb.documentsTable);

export async function processDocument(fileBuffer, fileName) {
  const s3Key = `${config.aws.s3.documentPrefix}${Date.now()}-${fileName}`;
  
  const uploadResult = await ingestionService.uploadToS3(
    fileBuffer,
    s3Key,
    config.aws.s3.bucketName
  );

  const jobId = await ingestionService.startTextractJob(
    config.aws.s3.bucketName,
    s3Key
  );

  const extractedData = await ingestionService.getTextractResults(jobId);

  const documentId = Date.now().toString();
  const document = {
    id: documentId,
    fileName,
    s3Key,
    extractedText: extractedData.text,
    pageCount: extractedData.pageCount,
    createdAt: new Date().toISOString()
  };

  await documentRepository.saveDocument(document);

  return {
    documentId,
    text: extractedData.text,
    pageCount: extractedData.pageCount,
    fileName
  };
}

export async function getDocument(documentId) {
  return await documentRepository.getDocument(documentId);
}
