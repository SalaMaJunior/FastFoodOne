import twilio from 'twilio';
import { config } from '../config';
import { logger } from '../utils/logger';

class SMSService {
  private client: twilio.Twilio | null = null;

  constructor() {
    if (config.external.twilio.accountSid && config.external.twilio.authToken) {
      this.client = twilio(config.external.twilio.accountSid, config.external.twilio.authToken);
    }
  }

  async sendOTPSMS(phoneNumber: string, otp: string, type: 'phone_verification' | 'password_reset'): Promise<boolean> {
    if (!this.client) {
      logger.warn('Twilio not configured, SMS not sent');
      return false;
    }

    try {
      const message = type === 'phone_verification' 
        ? `Your FastBite verification code is: ${otp}. This code expires in 10 minutes.`
        : `Your FastBite password reset code is: ${otp}. This code expires in 10 minutes.`;

      await this.client.messages.create({
        body: message,
        from: config.external.twilio.phoneNumber,
        to: phoneNumber,
      });

      logger.info(`OTP SMS sent to ${phoneNumber} for ${type}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send OTP SMS to ${phoneNumber}:`, error);
      return false;
    }
  }

  async sendOrderUpdateSMS(phoneNumber: string, orderNumber: string, status: string): Promise<boolean> {
    if (!this.client) {
      logger.warn('Twilio not configured, SMS not sent');
      return false;
    }

    try {
      const statusMessages: Record<string, string> = {
        'confirmed': `Your order ${orderNumber} has been confirmed by the restaurant.`,
        'preparing': `Your order ${orderNumber} is being prepared.`,
        'ready': `Your order ${orderNumber} is ready for pickup.`,
        'out_for_delivery': `Your order ${orderNumber} is out for delivery.`,
        'delivered': `Your order ${orderNumber} has been delivered. Enjoy your meal!`,
        'cancelled': `Your order ${orderNumber} has been cancelled.`,
      };

      const message = statusMessages[status] || `Your order ${orderNumber} status has been updated to: ${status}`;

      await this.client.messages.create({
        body: message,
        from: config.external.twilio.phoneNumber,
        to: phoneNumber,
      });

      logger.info(`Order update SMS sent to ${phoneNumber} for order ${orderNumber}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send order update SMS to ${phoneNumber}:`, error);
      return false;
    }
  }

  async sendDeliveryUpdateSMS(phoneNumber: string, orderNumber: string, driverName: string, estimatedTime: string): Promise<boolean> {
    if (!this.client) {
      logger.warn('Twilio not configured, SMS not sent');
      return false;
    }

    try {
      const message = `Your order ${orderNumber} is out for delivery with ${driverName}. Estimated delivery time: ${estimatedTime}.`;

      await this.client.messages.create({
        body: message,
        from: config.external.twilio.phoneNumber,
        to: phoneNumber,
      });

      logger.info(`Delivery update SMS sent to ${phoneNumber} for order ${orderNumber}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send delivery update SMS to ${phoneNumber}:`, error);
      return false;
    }
  }
}

export default new SMSService();

