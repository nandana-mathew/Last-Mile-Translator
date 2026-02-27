import { config } from '../config/awsConfig.js';
import { DocumentIngestionService } from '../services/documentIngestion.js';
import { ProcessingEngine } from '../services/processingEngine.js';
import { TranslationService } from '../services/translationService.js';
import { DocumentRepository } from '../repositories/documentRepository.js';

const region = config.aws.region;
const ingestionService = new DocumentIngestionService(region);
const processingEngine = new ProcessingEngine(region);
const translationService = new TranslationService(
  region,
  config.aws.bedrock.modelId,
  config.aws.bedrock.maxTokens
);
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
  
  const analysis = await processingEngine.analyzeContent(extractedData.text);
  
  const summary = await translationService.generatePlainLanguageSummary(
    extractedData.text,
    analysis.entities
  );

  const documentId = Date.now().toString();
  const document = {
    id: documentId,
    fileName,
    s3Key,
    extractedText: extractedData.text,
    analysis,
    summary,
    createdAt: new Date().toISOString()
  };

  await documentRepository.saveDocument(document);

  return {
    documentId,
    summary: summary.brief,
    analysis: {
      entities: analysis.entities,
      keyPhrases: analysis.keyPhrases.slice(0, 5)
    }
  };
}

export async function getDocument(documentId) {
  return await documentRepository.getDocument(documentId);
}
