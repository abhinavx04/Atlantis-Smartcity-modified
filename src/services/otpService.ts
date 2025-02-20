import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export class OtpService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  setupRecaptcha(elementId: string) {
    this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {},
    });
  }

  async sendOtp(phoneNumber: string): Promise<any> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }
}

export const otpService = new OtpService();