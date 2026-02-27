import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { config } from './config/awsConfig.js';
import { processDocument, getDocument } from './handlers/documentHandler.js';
import { translateDocument, generateVoiceNote } from './handlers/translationHandler.js';
import { saveUserProfile, getUserProfile, personalizeDocument } from './handlers/userHandler.js';
import { compareDocuments } from './handlers/deltaHandler.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/documents', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' });
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
    const document = await getDocument(req.params.id);
    
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
    const result = await translateDocument(req.params.id, language, format);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/:id/voice', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    const voiceNote = await generateVoiceNote(req.params.id, text, language);
    res.json({ success: true, voiceNote });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/:id/personalize', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const personalized = await personalizeDocument(req.params.id, userProfile);
    res.json({ success: true, personalized });
  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/compare', async (req, res) => {
  try {
    const { currentDocumentId, previousDocumentId } = req.body;
    const comparison = await compareDocuments(currentDocumentId, previousDocumentId);
    res.json({ success: true, comparison });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const result = await saveUserProfile(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const profile = await getUserProfile(req.params.userId);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Profile get error:', error);
    const status = error.message === 'Profile not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`Last-Mile Translator API running on port ${PORT}`);
  console.log(`Environment: ${config.app.environment}`);
  console.log(`Region: ${config.aws.region}`);
});
