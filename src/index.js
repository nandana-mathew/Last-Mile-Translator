import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { DocumentIngestionService } from './services/documentIngestion.js';
import { ProcessingEngine } from './services/processingEngine.js';
import { TranslationService } from './services/translationService.js';
import { LocalizationService } from './services/localizationService.js';
import { PersonalizationService } from './services/personalizationService.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.S3_BUCKET_NAME;
const tableName = process.env.DYNAMODB_TABLE_NAME;

const ingestionService = new DocumentIngestionService(region);
const processingEngine = new ProcessingEngine(region);
const translationService = new TranslationService(region);
const localizationService = new LocalizationService(region);
const personalizationService = new PersonalizationService(region, tableName);

app.post('/api/documents', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `documents/${Date.now()}-${req.file.originalname}`;
    
    await ingestionService.uploadToS3(fileBuffer, fileName, bucketName);
    
    const extractedData = await ingestionService.extractText(fileBuffer);
    
    const analysis = await processingEngine.analyzeContent(extractedData.text);
    
    const summary = await translationService.generatePlainLanguageSummary(
      extractedData.text,
      analysis.entities
    );

    const documentId = Date.now().toString();
    const document = {
      id: documentId,
      fileName: req.file.originalname,
      s3Key: fileName,
      extractedText: extractedData.text,
      analysis,
      summary,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      documentId,
      summary: summary.brief,
      analysis: {
        entities: analysis.entities,
        keyPhrases: analysis.keyPhrases.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ error: 'Failed to process document', details: error.message });
  }
});

app.get('/api/documents/:id/translation', async (req, res) => {
  try {
    const { language = 'hindi', format = 'brief' } = req.query;
    
    const summaryText = "This is a sample government document summary.";
    
    const translatedText = await localizationService.translateToLocalLanguage(
      summaryText,
      language
    );

    res.json({
      success: true,
      language,
      format,
      translation: translatedText
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate document', details: error.message });
  }
});

app.post('/api/documents/:id/voice', async (req, res) => {
  try {
    const { language = 'en' } = req.body;
    const text = req.body.text || "This is a sample government document.";

    const voiceNote = await localizationService.generateVoiceNote(
      text,
      language,
      bucketName
    );

    res.json({
      success: true,
      voiceNote
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: 'Failed to generate voice note', details: error.message });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const profile = req.body;
    
    if (!profile.id) {
      profile.id = `user-${Date.now()}`;
    }

    await personalizationService.saveUserProfile(profile);

    res.json({
      success: true,
      userId: profile.id,
      message: 'Profile saved successfully'
    });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ error: 'Failed to save profile', details: error.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await personalizationService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

app.post('/api/documents/:id/personalize', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    const mockDocument = {
      extractedContent: {
        summary: 'New subsidy scheme for farmers announced.',
        targetAudience: ['farmer'],
        geography: ['Maharashtra'],
        deadlines: [{ date: '2026-03-31' }]
      },
      sector: ['agriculture']
    };

    const personalized = await personalizationService.generatePersonalizedExplanation(
      mockDocument,
      userProfile
    );

    res.json({
      success: true,
      personalized
    });
  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({ error: 'Failed to personalize', details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Last-Mile Translator API running on port ${PORT}`);
  console.log(`Region: ${region}`);
  console.log(`S3 Bucket: ${bucketName}`);
  console.log(`DynamoDB Table: ${tableName}`);
});
