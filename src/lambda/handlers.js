import { processDocument, getDocument } from '../handlers/documentHandler.js';
import { translateDocument, generateVoiceNote } from '../handlers/translationHandler.js';
import { saveUserProfile, getUserProfile, personalizeDocument } from '../handlers/userHandler.js';
import { compareDocuments } from '../handlers/deltaHandler.js';

export const documentUploadHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const fileBuffer = Buffer.from(body.file, 'base64');
    const fileName = body.fileName;

    const result = await processDocument(fileBuffer, fileName);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const documentGetHandler = async (event) => {
  try {
    const documentId = event.pathParameters.id;
    const document = await getDocument(documentId);

    if (!document) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Document not found' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, document })
    };
  } catch (error) {
    console.error('Document get error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const translationHandler = async (event) => {
  try {
    const documentId = event.pathParameters.id;
    const { language = 'hindi', format = 'brief' } = event.queryStringParameters || {};

    const result = await translateDocument(documentId, language, format);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const voiceHandler = async (event) => {
  try {
    const documentId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { text, language = 'en' } = body;

    const voiceNote = await generateVoiceNote(documentId, text, language);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, voiceNote })
    };
  } catch (error) {
    console.error('Voice generation error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const profileSaveHandler = async (event) => {
  try {
    const profile = JSON.parse(event.body);
    const result = await saveUserProfile(profile);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('Profile save error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const profileGetHandler = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    const profile = await getUserProfile(userId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, profile })
    };
  } catch (error) {
    console.error('Profile get error:', error);
    return {
      statusCode: error.message === 'Profile not found' ? 404 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const personalizeHandler = async (event) => {
  try {
    const documentId = event.pathParameters.id;
    const { userProfile } = JSON.parse(event.body);

    const personalized = await personalizeDocument(documentId, userProfile);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, personalized })
    };
  } catch (error) {
    console.error('Personalization error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const compareHandler = async (event) => {
  try {
    const { currentDocumentId, previousDocumentId } = JSON.parse(event.body);

    const comparison = await compareDocuments(currentDocumentId, previousDocumentId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, comparison })
    };
  } catch (error) {
    console.error('Comparison error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
