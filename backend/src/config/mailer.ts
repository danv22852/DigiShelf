import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await transporter.sendMail({
    from: `"DigiShelf" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your DigiShelf account',
    html: `
      <h2>Welcome to DigiShelf!</h2>
      <p>Click the link below to verify your email. This link expires in 24 hours.</p>
      <a href="${url}">${url}</a>
    `
  });
};

export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"DigiShelf" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your DigiShelf password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${url}">${url}</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  });
};