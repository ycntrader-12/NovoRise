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

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null, // Ne pas boucler indéfiniment si Redis local n'est pas actif
};

// File de tâches Bull pour les emails
export const emailQueue = new Queue<EmailJobData>('email-jobs', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,         // 3 tentatives max en cas d'échec SMTP
    backoff: {
      type: 'exponential',
      delay: 5000,       // 5s → 25s → 125s entre les retries
    },
    removeOnComplete: 50, // Garde les 50 derniers jobs terminés
    removeOnFail: 100,    // Garde les 100 derniers jobs échoués pour debug
  },
});

emailQueue.on('ready', () => {
  console.log('📬 Email queue (Bull/Redis) ready');
});

emailQueue.on('error', (err) => {
  // Silence logs if local Redis server is not running
  if (!err.message.includes('ECONNREFUSED')) {
    console.error('❌ Email queue warning:', err.message);
  }
});

emailQueue.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed (attempt ${job.attemptsMade}):`, err.message);
});

emailQueue.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} [${job.data.type}] sent to ${job.data.to}`);
});

export default emailQueue;
