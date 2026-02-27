import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class LocalizationService {
  constructor(region) {
    this.translateClient = new TranslateClient({ region });
    this.pollyClient = new PollyClient({ region });
    this.s3Client = new S3Client({ region });
  }

  async translateToLocalLanguage(text, targetLanguage) {
    const languageMap = {
      'hindi': 'hi',
      'tamil': 'ta',
      'telugu': 'te',
      'bengali': 'bn',
      'marathi': 'mr',
      'gujarati': 'gu',
      'kannada': 'kn',
      'malayalam': 'ml',
      'punjabi': 'pa'
    };

    const langCode = languageMap[targetLanguage.toLowerCase()] || 'hi';

    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: langCode
    });

    const response = await this.translateClient.send(command);
    return response.TranslatedText;
  }

  async generateVoiceNote(text, language, bucketName) {
    const voiceMap = {
      'hi': 'Aditi',
      'ta': 'Aditi',
      'te': 'Aditi',
      'en': 'Joanna'
    };

    const command = new SynthesizeSpeechCommand({
      Text: text.substring(0, 3000),
      OutputFormat: 'mp3',
      VoiceId: voiceMap[language] || 'Joanna',
      Engine: 'neural'
    });

    const response = await this.pollyClient.send(command);
    const audioStream = response.AudioStream;
    
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    const fileName = `voice-notes/${Date.now()}.mp3`;
    await this.uploadAudioToS3(audioBuffer, fileName, bucketName);

    return {
      url: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
      duration: Math.ceil(text.length / 15)
    };
  }

  async uploadAudioToS3(audioBuffer, fileName, bucketName) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: audioBuffer,
      ContentType: 'audio/mpeg'
    });
    await this.s3Client.send(command);
  }
}
