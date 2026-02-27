import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { config, isAwsConfigured } from './config/awsConfig.js';
import { processDocument, getDocument } from './handlers/documentHandler.js';
import { translateDocument, generateVoiceNote } from './handlers/translationHandler.js';
import { saveUserProfile, getUserProfile, personalizeDocument } from './handlers/userHandler.js';
import { compareDocuments } from './handlers/deltaHandler.js';
import { scheduledIngestion, manualIngest } from './handlers/ingestionHandler.js';
import { demoData } from './config/demoData.js';
import { 
  processDemoDocument, 
  getDemoDocument, 
  translateDemoDocument, 
  generateDemoVoice,
  personalizeDemoDocument,
  compareDemoDocuments,
  saveDemoProfile,
  getDemoProfile,
  sendDemoSMS,
  sendDemoWhatsApp
} from './handlers/demoHandler.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const isDemoMode = config.demo.enabled;

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    demoMode: isDemoMode,
    awsConfigured: isAwsConfigured(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/policies/recent', async (req, res) => {
  try {
    const policies = isDemoMode 
      ? demoData.recentPolicies
      : []; // TODO: Fetch from DynamoDB in production
    
    res.json({ success: true, policies });
  } catch (error) {
    console.error('Recent policies error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/demo/analyze', async (req, res) => {
  try {
    const policyType = req.query.policy || 'maharashtra';
    
    let result, document;
    
    if (policyType === 'karnataka') {
      result = { documentId: `demo-karnataka-${Date.now()}` };
      const doc = demoData.karnatakaBusinessPolicy;
      document = {
        id: result.documentId,
        extractedText: doc.extractedText,
        summary: doc.summary,
        translations: doc.translations,
        personalization: doc.personalization
      };
    } else {
      result = await processDemoDocument();
      document = await getDemoDocument(result.documentId);
    }
    
    res.json({
      success: true,
      documentId: result.documentId || document.id,
      plainLanguageSummary: document.summary.brief,
      detailedSummary: document.summary.detailed,
      keyChanges: document.summary.actions,
      personalImpact: {
        business: document.personalization?.business?.explanation || 
                 (await personalizeDemoDocument({ demographics: { occupation: 'business' }})).explanation,
        farmer: document.personalization?.farmer?.explanation ||
                (await personalizeDemoDocument({ demographics: { occupation: 'farmer' }})).explanation
      },
      translations: document.translations || {
        hindi: await translateDemoDocument('hindi'),
        kannada: await translateDemoDocument('kannada')
      }
    });
  } catch (error) {
    console.error('Demo analyze error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'phoneNumber and message required' });
    }

    const result = isDemoMode
      ? await sendDemoSMS(phoneNumber, message)
      : { status: 'aws_required', note: 'Set DEMO_MODE=false and configure AWS SNS' };
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('SMS error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/whatsapp', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'phoneNumber and message required' });
    }

    const result = isDemoMode
      ? await sendDemoWhatsApp(phoneNumber, message)
      : { status: 'aws_required', note: 'Set DEMO_MODE=false and configure AWS SNS' };
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('WhatsApp error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ingestion/manual', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'urls array required' });
    }

    if (isDemoMode) {
      return res.json({
        success: true,
        note: 'Demo mode - ingestion simulated',
        total: urls.length,
        ingested: urls.length,
        duplicates: 0,
        errors: 0
      });
    }

    const result = await manualIngest(urls);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Manual ingestion error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' });
    }

    if (isDemoMode) {
      const result = await processDemoDocument();
      return res.json({ success: true, ...result });
    }

    const result = await processDocument(req.file.buffer, req.file.originalname);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = isDemoMode 
      ? await getDemoDocument(req.params.id)
      : await getDocument(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ success: true, document });
  } catch (error) {
    console.error('Document get error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/documents/:id/translation', async (req, res) => {
  try {
    const { language = 'hindi', format = 'brief' } = req.query;
    
    const translation = isDemoMode
      ? await translateDemoDocument(language)
      : (await translateDocument(req.params.id, language, format)).translation;
    
    res.json({ success: true, language, format, translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/:id/voice', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    
    const voiceNote = isDemoMode
      ? await generateDemoVoice()
      : await generateVoiceNote(req.params.id, text, language);
    
    res.json({ success: true, voiceNote });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/:id/personalize', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    const personalized = isDemoMode
      ? await personalizeDemoDocument(userProfile)
      : await personalizeDocument(req.params.id, userProfile);
    
    res.json({ success: true, personalized });
  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/compare', async (req, res) => {
  try {
    const { currentDocumentId, previousDocumentId } = req.body;
    
    const comparison = isDemoMode
      ? await compareDemoDocuments()
      : await compareDocuments(currentDocumentId, previousDocumentId);
    
    res.json({ success: true, comparison });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const result = isDemoMode
      ? await saveDemoProfile(req.body)
      : await saveUserProfile(req.body);
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const profile = isDemoMode
      ? await getDemoProfile(req.params.userId)
      : await getUserProfile(req.params.userId);
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Profile get error:', error);
    const status = error.message === 'Profile not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Last-Mile Translator API running on port ${PORT}`);
  console.log(`📍 Environment: ${config.app.environment}`);
  console.log(`🎭 Demo Mode: ${isDemoMode ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`☁️  AWS Configured: ${isAwsConfigured() ? '✅ YES' : '❌ NO'}`);
  console.log(`\n📖 Access the web interface at: http://localhost:${PORT}`);
  if (isDemoMode) {
    console.log(`🎯 Try the demo: http://localhost:${PORT}/api/demo/analyze\n`);
  }
});

