import { ComprehendClient, DetectEntitiesCommand, DetectKeyPhrasesCommand } from '@aws-sdk/client-comprehend';

export class ProcessingEngine {
  constructor(region) {
    this.comprehendClient = new ComprehendClient({ region });
  }

  async analyzeContent(text) {
    const entities = await this.detectEntities(text);
    const keyPhrases = await this.detectKeyPhrases(text);
    
    return {
      entities: this.categorizeEntities(entities),
      keyPhrases,
      metadata: this.extractMetadata(entities)
    };
  }

  async detectEntities(text) {
    const command = new DetectEntitiesCommand({
      Text: text.substring(0, 5000),
      LanguageCode: 'en'
    });
    const response = await this.comprehendClient.send(command);
    return response.Entities || [];
  }

  async detectKeyPhrases(text) {
    const command = new DetectKeyPhrasesCommand({
      Text: text.substring(0, 5000),
      LanguageCode: 'en'
    });
    const response = await this.comprehendClient.send(command);
    return response.KeyPhrases || [];
  }

  categorizeEntities(entities) {
    const categorized = {
      dates: [],
      organizations: [],
      locations: [],
      persons: [],
      quantities: []
    };

    entities.forEach(entity => {
      switch(entity.Type) {
        case 'DATE':
          categorized.dates.push({ text: entity.Text, score: entity.Score });
          break;
        case 'ORGANIZATION':
          categorized.organizations.push({ text: entity.Text, score: entity.Score });
          break;
        case 'LOCATION':
          categorized.locations.push({ text: entity.Text, score: entity.Score });
          break;
        case 'PERSON':
          categorized.persons.push({ text: entity.Text, score: entity.Score });
          break;
        case 'QUANTITY':
          categorized.quantities.push({ text: entity.Text, score: entity.Score });
          break;
      }
    });

    return categorized;
  }

  extractMetadata(entities) {
    const dates = entities.filter(e => e.Type === 'DATE');
    const orgs = entities.filter(e => e.Type === 'ORGANIZATION');
    
    return {
      issueDate: dates[0]?.Text || null,
      issuer: orgs[0]?.Text || null,
      targetAudience: this.inferTargetAudience(entities)
    };
  }

  inferTargetAudience(entities) {
    const keywords = ['farmer', 'student', 'senior citizen', 'business', 'women', 'youth'];
    const text = entities.map(e => e.Text.toLowerCase()).join(' ');
    return keywords.filter(keyword => text.includes(keyword));
  }
}
