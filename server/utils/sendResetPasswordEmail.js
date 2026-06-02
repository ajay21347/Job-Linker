import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,

    to: email,

    subject: "Reset Your Password",

    html: `
      <h2>Password Reset Request</h2>

      <p>Click the button below to reset your password.</p>

      <a href="${link}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `,
  });
};
