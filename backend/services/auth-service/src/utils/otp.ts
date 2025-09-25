import crypto from 'crypto';

export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

export const generateSecureOTP = (length: number = 6): string => {
  const buffer = crypto.randomBytes(Math.ceil(length / 2));
  const otp = buffer.toString('hex').slice(0, length);
  return otp;
};

export const verifyOTP = (providedOTP: string, storedOTP: string): boolean => {
  return providedOTP === storedOTP;
};

export const isOTPExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const generateOTPHash = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

