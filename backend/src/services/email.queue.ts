import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

export interface EmailJobData {
  type: 'email-verification' | 'password-reset' | 'application-notification';
  to: string;
  name?: string;
  token?: string;
  payload?: Record<string, unknown>;
}

// Minimal mock for Bull queue that processes jobs in memory
export const emailQueue = {
  add: async (data: EmailJobData) => {
    console.log('Mock emailQueue.add called with data:', data.type);
    // Process asynchronously without blocking
    setTimeout(() => {
      if (emailQueue.processor) {
        console.log('Calling emailQueue.processor...');
        emailQueue.processor({ data, id: Date.now() }).catch((err: any) => console.error('Processor error:', err));
      } else {
        console.warn('emailQueue.processor is null!');
      }
    }, 100);
  },
  process: (fn: Function) => {
    emailQueue.processor = fn;
  },
  processor: null as Function | null,
  on: (event: string, callback: Function) => {
    // Ignore events
  }
};

export default emailQueue;
