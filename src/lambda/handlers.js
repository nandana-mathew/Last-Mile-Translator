import { processDocument, getDocument } from '../handlers/documentHandler.js';
import { translateDocument, generateVoiceNote } from '../handlers/translationHandler.js';
import { saveUserProfile, getUserProfile, personalizeDocument } from '../handlers/userHandler.js';
import { compareDocuments } from '../handlers/deltaHandler.js';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

export const documentUploadHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const body = JSON.parse(event.body);
    const fileBuffer = Buffer.from(body.file, 'base64');
    const fileName = body.fileName;
    const result = await processDocument(fileBuffer, fileName);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, ...result }) };
  } catch (error) {
    console.error('Document upload error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const documentGetHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const documentId = event.pathParameters.id;
    const document = await getDocument(documentId);
    if (!document) return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Document not found' }) };
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, document }) };
  } catch (error) {
    console.error('Document get error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const translationHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const documentId = event.pathParameters.id;
    const { language = 'hindi', format = 'brief' } = event.queryStringParameters || {};
    const result = await translateDocument(documentId, language, format);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, ...result }) };
  } catch (error) {
    console.error('Translation error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const voiceHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const documentId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { text, language = 'en' } = body;
    const voiceNote = await generateVoiceNote(documentId, text, language);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, voiceNote }) };
  } catch (error) {
    console.error('Voice generation error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const profileSaveHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const profile = JSON.parse(event.body);
    const result = await saveUserProfile(profile);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, ...result }) };
  } catch (error) {
    console.error('Profile save error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const profileGetHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const userId = event.pathParameters.userId;
    const profile = await getUserProfile(userId);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, profile }) };
  } catch (error) {
    console.error('Profile get error:', error);
    return { statusCode: error.message === 'Profile not found' ? 404 : 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const personalizeHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const documentId = event.pathParameters.id;
    const { userProfile } = JSON.parse(event.body);
    const personalized = await personalizeDocument(documentId, userProfile);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, personalized }) };
  } catch (error) {
    console.error('Personalization error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const compareHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const { currentDocumentId, previousDocumentId } = JSON.parse(event.body);
    const comparison = await compareDocuments(currentDocumentId, previousDocumentId);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, comparison }) };
  } catch (error) {
    console.error('Comparison error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const recentPoliciesHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const { demoData } = await import('../config/demoData.js');
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, policies: demoData.recentPolicies }) };
  } catch (error) {
    console.error('Recent policies error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const translateTextHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  try {
    const { text, language } = JSON.parse(event.body);
    if (!text || !language) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'text and language required' }) };
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, translation: text }) };
  } catch (error) {
    console.error('Translation error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

export const healthHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ status: 'ok', demoMode: false, awsConfigured: true, timestamp: new Date().toISOString() }) };
};
