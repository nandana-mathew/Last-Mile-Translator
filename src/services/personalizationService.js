import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class PersonalizationService {
  constructor(region, tableName) {
    const client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async saveUserProfile(profile) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId: profile.id,
        demographics: profile.demographics,
        interests: profile.interests,
        subscriptions: profile.subscriptions,
        createdAt: new Date().toISOString()
      }
    });
    await this.docClient.send(command);
  }

  async getUserProfile(userId) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId }
    });
    const response = await this.docClient.send(command);
    return response.Item;
  }

  async generatePersonalizedExplanation(document, userProfile) {
    if (!userProfile) {
      return this.generateGenericExplanation(document);
    }

    const relevance = this.calculateRelevance(document, userProfile);
    const personalizedText = this.buildPersonalizedText(document, userProfile, relevance);

    return {
      relevanceScore: relevance.score,
      explanation: personalizedText,
      actionRequired: relevance.actionRequired,
      deadline: relevance.deadline
    };
  }

  calculateRelevance(document, userProfile) {
    let score = 0;
    let actionRequired = false;
    let deadline = null;

    const userLocation = userProfile.demographics?.location?.state?.toLowerCase();
    const docLocations = document.extractedContent?.geography?.map(g => g.toLowerCase()) || [];
    if (docLocations.includes(userLocation)) {
      score += 30;
    }

    const userOccupation = userProfile.demographics?.occupation?.toLowerCase();
    const targetAudience = document.extractedContent?.targetAudience || [];
    if (targetAudience.some(audience => audience.toLowerCase().includes(userOccupation))) {
      score += 40;
      actionRequired = true;
    }

    const userInterests = userProfile.interests?.map(i => i.toLowerCase()) || [];
    const docSector = document.sector?.map(s => s.toLowerCase()) || [];
    const matchingInterests = userInterests.filter(interest => 
      docSector.some(sector => sector.includes(interest))
    );
    score += matchingInterests.length * 10;

    if (document.extractedContent?.deadlines?.length > 0) {
      deadline = document.extractedContent.deadlines[0].date;
    }

    return { score, actionRequired, deadline };
  }

  buildPersonalizedText(document, userProfile, relevance) {
    const occupation = userProfile.demographics?.occupation || 'citizen';
    const location = userProfile.demographics?.location?.state || 'your area';
    
    let text = `As a ${occupation} in ${location}, `;

    if (relevance.score > 50) {
      text += `this decision directly affects you. `;
    } else if (relevance.score > 20) {
      text += `this decision may be relevant to you. `;
    } else {
      text += `this decision is for general information. `;
    }

    text += document.extractedContent?.summary || 'Please review the full document for details.';

    if (relevance.actionRequired && relevance.deadline) {
      text += ` You need to take action before ${relevance.deadline}.`;
    }

    return text;
  }

  generateGenericExplanation(document) {
    return {
      relevanceScore: 50,
      explanation: document.extractedContent?.summary || 'Government document summary not available.',
      actionRequired: false,
      deadline: null
    };
  }
}
