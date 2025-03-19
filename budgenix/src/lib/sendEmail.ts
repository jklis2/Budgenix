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

export default async function sendEmail(
  to: string,
  subject: string,
  text: string
) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    
    if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
      console.error("Email configuration is not set properly");
      throw new Error("Email configuration missing");
    }
    
    const transporter = getTransporter();
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
    
    console.log(`Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
