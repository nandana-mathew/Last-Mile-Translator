import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class NotificationService {
  constructor(region) {
    this.snsClient = new SNSClient({ region });
  }

  async sendSMS(phoneNumber, message) {
    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message.substring(0, 160)
    });
    
    const response = await this.snsClient.send(command);
    return { messageId: response.MessageId, status: 'sent' };
  }

  async sendWhatsApp(phoneNumber, message) {
    // WhatsApp via SNS requires topic subscription
    const command = new PublishCommand({
      TopicArn: process.env.WHATSAPP_TOPIC_ARN,
      Message: JSON.stringify({
        phoneNumber,
        message,
        channel: 'whatsapp'
      })
    });
    
    const response = await this.snsClient.send(command);
    return { messageId: response.MessageId, status: 'sent' };
  }

  async notifyNewPolicy(userProfile, policySummary) {
    const message = `New Policy Alert: ${policySummary.brief}. Check details at: ${process.env.APP_URL}`;
    
    if (userProfile.phoneNumber) {
      return await this.sendSMS(userProfile.phoneNumber, message);
    }
    
    return { status: 'no_phone' };
  }
}
