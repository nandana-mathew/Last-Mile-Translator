import { config } from '../config/awsConfig.js';
import { demoData } from '../config/demoData.js';

export async function processDemoDocument() {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const documentId = `demo-${Date.now()}`;
  const doc = demoData.sampleDocument;
  
  return {
    documentId,
    summary: doc.summary.brief,
    analysis: {
      entities: doc.analysis.entities,
      keyPhrases: doc.analysis.keyPhrases.slice(0, 5)
    }
  };
}

export async function getDemoDocument(documentId) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: documentId,
    fileName: 'sample-policy.txt',
    s3Key: 'demo/sample-policy.txt',
    extractedText: demoData.sampleDocument.extractedText,
    analysis: demoData.sampleDocument.analysis,
    summary: demoData.sampleDocument.summary,
    createdAt: new Date().toISOString()
  };
}

export async function translateDemoDocument(language) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const translations = demoData.sampleDocument.translations;
  return translations[language] || translations.hindi;
}

export async function generateDemoVoice() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    url: 'https://demo-bucket.s3.amazonaws.com/voice-notes/demo-audio.mp3',
    duration: 45,
    text: 'This is a demo voice note. In production, this would be generated using Amazon Polly.'
  };
}

export async function sendDemoSMS(phoneNumber, message) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    messageId: `demo-sms-${Date.now()}`,
    status: 'sent',
    phoneNumber,
    message: message.substring(0, 160),
    note: 'Demo mode - SMS not actually sent'
  };
}

export async function sendDemoWhatsApp(phoneNumber, message) {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    messageId: `demo-wa-${Date.now()}`,
    status: 'sent',
    phoneNumber,
    message,
    channel: 'whatsapp',
    note: 'Demo mode - WhatsApp message not actually sent'
  };
}

export async function personalizeDemoDocument(userProfile) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const occupation = userProfile?.demographics?.occupation?.toLowerCase() || 'citizen';
  const personalization = demoData.sampleDocument.personalization;
  
  return personalization[occupation] || {
    relevanceScore: 50,
    explanation: 'This is a government policy update that may be relevant to you.',
    actionRequired: false,
    deadline: null
  };
}

export async function compareDemoDocuments() {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return demoData.sampleDocument.comparison;
}

export async function saveDemoProfile(profile) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { userId: profile.id || `demo-user-${Date.now()}` };
}

export async function getDemoProfile(userId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    userId,
    demographics: {
      occupation: 'farmer',
      location: { state: 'Maharashtra', district: 'Pune' },
      languages: ['hindi', 'marathi']
    },
    interests: ['agriculture', 'subsidies'],
    subscriptions: {
      documentTypes: ['circular', 'notice'],
      deliveryMethod: 'web',
      frequency: 'immediate'
    },
    createdAt: new Date().toISOString()
  };
}
