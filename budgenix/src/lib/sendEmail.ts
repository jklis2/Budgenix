import nodemailer from "nodemailer";

// Parse EMAIL_SERVER string to extract credentials
// Format: smtps://email:password@smtp.provider.com
const getTransporter = () => {
  const emailServer = process.env.EMAIL_SERVER;
  
  if (!emailServer) {
    throw new Error("EMAIL_SERVER environment variable is not set");
  }
  
  // For EMAIL_SERVER in format: smtps://email:password@smtp.provider.com
  if (emailServer.startsWith('smtps://')) {
    const match = emailServer.match(/smtps:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      const [, user, pass, host] = match;
      return nodemailer.createTransport({
        host,
        port: 465,
        secure: true,
        auth: {
          user,
          pass,
        },
        tls: {
          // Do not fail on invalid certificates
          rejectUnauthorized: false
        }
      });
    }
  }
  
  // Fallback to direct configuration
  return nodemailer.createTransport(emailServer);
};

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Legacy function for backward compatibility
export default async function sendEmail(
  to: string,
  subject: string,
  textOrHtml: string,
  isHtml?: boolean
) {
  return sendEmailWithOptions({
    to,
    subject,
    ...(isHtml ? { html: textOrHtml } : { text: textOrHtml })
  });
}

// New function with options
export async function sendEmailWithOptions(options: EmailOptions) {
  try {
    if (!options.to) {
      throw new Error('Email recipient (to) is required');
    }

    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
      throw new Error('Email configuration (EMAIL_SERVER and EMAIL_FROM) is missing');
    }

    console.log(`Attempting to send email to: ${options.to}`);
    
    const transporter = getTransporter();
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    
    console.log(`Email sent successfully to ${options.to}`);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Specific email sending functions
import { renderVerifyEmail } from './emails/VerifyEmail';
import { renderTwoFactorEmail } from './emails/TwoFactorEmail';
import { renderResetPasswordEmail } from './emails/ResetPasswordEmail';

export async function sendVerificationEmail(to: string, token: string) {
  if (!to || !token) {
    throw new Error('Email address and token are required for verification email');
  }

  if (!process.env.NEXT_PUBLIC_URL) {
    throw new Error('NEXT_PUBLIC_URL environment variable is not set');
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/activate?token=${token}`;
  
  return sendEmailWithOptions({
    to,
    subject: "Potwierdź swój adres e-mail | Budgenix",
    html: renderVerifyEmail({ verificationUrl })
  });
}

export async function sendTwoFactorEmail(to: string, code: string) {
  if (!to || !code) {
    throw new Error('Email address and verification code are required for 2FA email');
  }

  return sendEmailWithOptions({
    to,
    subject: "Kod weryfikacji dwuskładnikowej | Budgenix",
    html: renderTwoFactorEmail({ code })
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  if (!to || !token) {
    throw new Error('Email address and token are required for password reset email');
  }

  if (!process.env.NEXT_PUBLIC_URL) {
    throw new Error('NEXT_PUBLIC_URL environment variable is not set');
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`;
  
  return sendEmailWithOptions({
    to,
    subject: "Reset hasła | Budgenix",
    html: renderResetPasswordEmail({ resetUrl })
  });
}
