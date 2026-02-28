import { scheduledIngestion } from '../handlers/ingestionHandler.js';

export const scheduledIngestionHandler = async (event) => {
  try {
    console.log('Scheduled ingestion triggered:', event);
    
    const result = await scheduledIngestion();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Policy ingestion completed',
        ...result
      })
    };
  } catch (error) {
    console.error('Scheduled ingestion error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

export const manualIngestionHandler = async (event) => {
  try {
    const { urls } = JSON.parse(event.body);
    
    if (!urls || !Array.isArray(urls)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'urls array required' })
      };
    }

    const { manualIngest } = await import('../handlers/ingestionHandler.js');
    const result = await manualIngest(urls);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('Manual ingestion error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const smsNotificationHandler = async (event) => {
  try {
    const { phoneNumber, message } = JSON.parse(event.body);
    
    const { NotificationService } = await import('../services/notificationService.js');
    const { config } = await import('../config/awsConfig.js');
    const notificationService = new NotificationService(config.aws.region);
    
    const result = await notificationService.sendSMS(phoneNumber, message);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('SMS notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const whatsappNotificationHandler = async (event) => {
  try {
    const { phoneNumber, message } = JSON.parse(event.body);
    
    const { NotificationService } = await import('../services/notificationService.js');
    const { config } = await import('../config/awsConfig.js');
    const notificationService = new NotificationService(config.aws.region);
    
    const result = await notificationService.sendWhatsApp(phoneNumber, message);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result })
    };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
