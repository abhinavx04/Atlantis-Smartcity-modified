import { auth } from '../firebase/config';
import { 
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential
} from 'firebase/auth';

class OTPService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  initRecaptcha(buttonId: string) {
    try {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      });
      return true;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      return false;
    }
  }

  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        this.recaptchaVerifier
      );

      return verificationId;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  async verifyOTP(verificationId: string, otp: string) {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
}

export const otpService = new OTPService();