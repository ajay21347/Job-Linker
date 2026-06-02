import nodemailer from "nodemailer";

export const SendVerificationEmail = async (email, link) => {
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

    subject: "Verify Your Email",

    html: `
      <h2>Welcome to JobLinker</h2>

      <p>Please verify your email.</p>

      <a href="${link}">
        Verify Email
      </a>
    `,
  });
};
