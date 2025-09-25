import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTPEmail(email: string, otp: string, type: 'email_verification' | 'password_reset'): Promise<boolean> {
    try {
      const subject = type === 'email_verification' 
        ? 'Verify Your Email - FastBite' 
        : 'Reset Your Password - FastBite';

      const html = this.generateOTPEmailTemplate(otp, type);

      await this.transporter.sendMail({
        from: config.external.sendgrid.fromEmail,
        to: email,
        subject,
        html,
      });

      logger.info(`OTP email sent to ${email} for ${type}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send OTP email to ${email}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      const html = this.generateWelcomeEmailTemplate(firstName);

      await this.transporter.sendMail({
        from: config.external.sendgrid.fromEmail,
        to: email,
        subject: 'Welcome to FastBite! 🍔',
        html,
      });

      logger.info(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
      return false;
    }
  }

  private generateOTPEmailTemplate(otp: string, type: string): string {
    const action = type === 'email_verification' ? 'verify your email' : 'reset your password';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FastBite ${type === 'email_verification' ? 'Email Verification' : 'Password Reset'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #fff; border: 2px dashed #f59e0b; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #f59e0b; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍔 FastBite</h1>
            <h2>${type === 'email_verification' ? 'Verify Your Email' : 'Reset Your Password'}</h2>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>Use the following code to ${action}:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The FastBite Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FastBite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FastBite!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .cta-button { background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍔 Welcome to FastBite!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName}!</p>
            <p>Welcome to FastBite - your gateway to delicious food delivered right to your doorstep!</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>🍕 Browse thousands of restaurants</li>
              <li>🤖 Get AI-powered food recommendations</li>
              <li>📍 Track your orders in real-time</li>
              <li>💳 Pay securely with multiple payment methods</li>
              <li>⭐ Rate and review your favorite dishes</li>
            </ul>
            <a href="#" class="cta-button">Start Ordering Now</a>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Happy eating!<br>The FastBite Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FastBite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();

