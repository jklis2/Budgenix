require("dotenv/config");
const nodemailer = require("nodemailer");
// TS tutaj nie jest krytyczny, ważne żeby runtime użył dokładnie template'ów z lib/emails
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderTwoFactorEmail } = require("../src/lib/emails/TwoFactorEmail");

// skopiowana logika z src/lib/sendEmail.ts
const getTransporter = () => {
  const emailServer = process.env.EMAIL_SERVER;

  if (!emailServer) {
    throw new Error("EMAIL_SERVER environment variable is not set");
  }

  if (emailServer.startsWith("smtps://")) {
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
          rejectUnauthorized: false,
        },
      });
    }
  }

  return nodemailer.createTransport(emailServer);
};

async function main() {
  const to = "jakubklis2201@gmail.com";

  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
    console.error("EMAIL_SERVER or EMAIL_FROM is not set");
    process.exit(1);
  }

  const code = "123456";

  const html = renderTwoFactorEmail({ code });

  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Twój kod weryfikacyjny 2FA do Budgenix",
      text: `Twój kod weryfikacyjny to: ${code}`,
      html,
    });

    console.log("Test activation email sent to", to, "messageId:", info.messageId || info);
  } catch (error) {
    console.error("Error sending test email:", error);
    process.exit(1);
  }
}

main();
