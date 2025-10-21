import nodemailer from 'nodemailer';

type EmailData = {
  name: string;
  email: string;
  message: string;
};

export async function sendEmail({ name, email, message }: EmailData) {
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: 'fbla@campbellhigh.net',
    subject: `New Contact Form Submission from ${name}`,
    text: message,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
  return info;
}
