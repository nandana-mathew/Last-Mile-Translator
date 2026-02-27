import { config } from '../config/awsConfig.js';
import { PersonalizationService } from '../services/personalizationService.js';
import { DocumentRepository } from '../repositories/documentRepository.js';

const region = config.aws.region;
const personalizationService = new PersonalizationService(region, config.aws.dynamodb.usersTable);
const documentRepository = new DocumentRepository(region, config.aws.dynamodb.documentsTable);

export async function saveUserProfile(profile) {
  if (!profile.id) {
    profile.id = `user-${Date.now()}`;
  }

  await personalizationService.saveUserProfile(profile);
  return { userId: profile.id };
}

export async function getUserProfile(userId) {
  const profile = await personalizationService.getUserProfile(userId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }

  return profile;
}

export async function personalizeDocument(documentId, userProfile) {
  const document = await documentRepository.getDocument(documentId);
  
  if (!document) {
    throw new Error('Document not found');
  }

  const personalized = await personalizationService.generatePersonalizedExplanation(
    document,
    userProfile
  );

  return personalized;
}
