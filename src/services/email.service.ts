import { transporter } from "../utils/mail";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  await transporter.sendMail({
    from: `"PMS" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
