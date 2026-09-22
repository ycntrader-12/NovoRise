import nodemailer from 'nodemailer';
import { emailQueue, EmailJobData } from '../services/email.queue';
import dotenv from 'dotenv';

dotenv.config();

// ─── Transporter Nodemailer — port 587 STARTTLS (Mailtrap) ───────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,       // false = STARTTLS (upgrade automatique sur port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const FROM = process.env.SMTP_FROM || '"NovoRise" <noreply@novorise.ma>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Templates HTML ───────────────────────────────────────────────────────────

function templateVerification(name: string, token: string): string {
  const link = `${FRONTEND_URL}/verify?token=${token}`;
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirmez votre email — NovoRise</title></head>
  <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Novo<span style="color:#a5b4fc;">Rise</span></div>
            <p style="color:#e0e7ff;margin:8px 0 0;font-size:14px;">La plateforme emploi nouvelle génération</p>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:40px;">
            <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Bienvenue, ${name} 👋</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Votre compte NovoRise a été créé avec succès. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${link}" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;display:inline-block;">
                ✅ Confirmer mon email
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;margin:24px 0 0;">
              Ou copiez ce lien dans votre navigateur :<br>
              <a href="${link}" style="color:#818cf8;word-break:break-all;">${link}</a>
            </p>
            <p style="color:#64748b;font-size:12px;margin:16px 0 0;">⏱ Ce lien est valable 24 heures.</p>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

function templatePasswordReset(name: string, token: string): string {
  const link = `${FRONTEND_URL}/reset-password?token=${token}`;
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head><meta charset="UTF-8"><title>Réinitialisation mot de passe — NovoRise</title></head>
  <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;">
          <tr><td style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:32px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#fff;">Novo<span style="opacity:0.8;">Rise</span></div>
            <p style="color:#fef3c7;margin:8px 0 0;font-size:14px;">Réinitialisation de mot de passe</p>
          </td></tr>
          <tr><td style="padding:40px;">
            <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Bonjour ${name},</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous. Ce lien expire dans <strong style="color:#fbbf24;">1 heure</strong>.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${link}" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;display:inline-block;">
                🔑 Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color:#64748b;font-size:12px;margin:16px 0 0;">
              ⚠️ Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe reste inchangé.
            </p>
          </td></tr>
          <tr><td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">NovoRise — Casablanca, Maroc</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

function templateApplicationNotification(payload: {
  recruiterName: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
}): string {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head><meta charset="UTF-8"><title>Nouvelle candidature — NovoRise</title></head>
  <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;">
          <tr><td style="background:linear-gradient(135deg,#10b981,#059669);padding:32px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#fff;">Novo<span style="opacity:0.8;">Rise</span></div>
            <p style="color:#d1fae5;margin:8px 0 0;font-size:14px;">Nouvelle candidature reçue</p>
          </td></tr>
          <tr><td style="padding:40px;">
            <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Bonjour ${payload.recruiterName},</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Vous avez reçu une nouvelle candidature pour le poste <strong style="color:#34d399;">${payload.jobTitle}</strong>.
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:20px;margin:0 0 24px;">
              <p style="color:#94a3b8;margin:0 0 8px;font-size:14px;">👤 <strong style="color:#f1f5f9;">${payload.candidateName}</strong></p>
              <p style="color:#94a3b8;margin:0 0 8px;font-size:14px;">📧 <a href="mailto:${payload.candidateEmail}" style="color:#818cf8;">${payload.candidateEmail}</a></p>
              <p style="color:#94a3b8;margin:0;font-size:14px;">🕐 ${payload.appliedAt}</p>
            </div>
            <div style="text-align:center;">
              <a href="${FRONTEND_URL}" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;display:inline-block;">
                Voir le dashboard recruteur →
              </a>
            </div>
          </td></tr>
          <tr><td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">NovoRise — Casablanca, Maroc</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

// ─── Worker Bull : consommateur de la file email ───────────────────────────
emailQueue.process(async (job) => {
  const { type, to, name, token, payload } = job.data;
  console.log(`📨 Processing email job [${type}] → ${to}`);

  let subject = '';
  let html = '';

  switch (type) {
    case 'email-verification':
      subject = '✅ Confirmez votre adresse email — NovoRise';
      html = templateVerification(name || 'Utilisateur', token || '');
      break;

    case 'password-reset':
      subject = '🔑 Réinitialisez votre mot de passe — NovoRise';
      html = templatePasswordReset(name || 'Utilisateur', token || '');
      break;

    case 'application-notification':
      subject = `📋 Nouvelle candidature pour "${(payload as any)?.jobTitle}" — NovoRise`;
      html = templateApplicationNotification(payload as any);
      break;

    default:
      throw new Error(`Unknown email job type: ${type}`);
  }

  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
  });

  console.log(`✅ Email [${type}] sent to ${to}`);
});

export default emailQueue;
