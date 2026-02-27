import { config } from '../config/awsConfig.js';
import { LocalizationService } from '../services/localizationService.js';
import { DocumentRepository } from '../repositories/documentRepository.js';

const region = config.aws.region;
const localizationService = new LocalizationService(region);
const documentRepository = new DocumentRepository(region, config.aws.dynamodb.documentsTable);

export async function translateDocument(documentId, language, format = 'brief') {
  const document = await documentRepository.getDocument(documentId);
  
  if (!document) {
    throw new Error('Document not found');
  }

  const textToTranslate = format === 'brief' 
    ? document.summary.brief 
    : document.summary.detailed;

  const translatedText = await localizationService.translateToLocalLanguage(
    textToTranslate,
    language
  );

  return {
    language,
    format,
    translation: translatedText
  };
}

export async function generateVoiceNote(documentId, text, language = 'en') {
  const voiceNote = await localizationService.generateVoiceNote(
    text,
    language,
    config.aws.s3.bucketName
  );

  return voiceNote;
}
