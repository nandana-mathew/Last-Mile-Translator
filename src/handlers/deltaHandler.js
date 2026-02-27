import { config } from '../config/awsConfig.js';
import { DeltaEngine } from '../services/deltaEngine.js';
import { DocumentRepository } from '../repositories/documentRepository.js';

const region = config.aws.region;
const deltaEngine = new DeltaEngine(region, config.aws.bedrock.modelId);
const documentRepository = new DocumentRepository(region, config.aws.dynamodb.documentsTable);

export async function compareDocuments(currentDocumentId, previousDocumentId) {
  const currentDoc = await documentRepository.getDocument(currentDocumentId);
  const previousDoc = await documentRepository.getDocument(previousDocumentId);

  if (!currentDoc) {
    throw new Error('Current document not found');
  }

  const previousText = previousDoc?.extractedText || null;
  const comparison = await deltaEngine.compareDocuments(
    currentDoc.extractedText,
    previousText
  );

  return comparison;
}
