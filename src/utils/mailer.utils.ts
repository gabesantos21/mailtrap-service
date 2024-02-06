import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';

export const sendEmail = async (
  subject: string,
  body: string,
  recipient: string
) => {
  const transportOptions: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  const hanldebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      defaultLayout: path.resolve(__dirname, '../hbs/layouts/sample'),
    },
    viewPath: path.resolve(__dirname, '../hbs/views'),
    extName: '.handlebars',
  };

  transporter.use('compile', hbs(hanldebarOptions));
  const mailOptions = {
    from: {
      name: String(process.env.SMTP_SENDER_NAME),
      address: String(process.env.SMTP_SENDER_ADDRESS),
    },
    to: recipient,
    subject,
    template: 'sample',
    context: {
      text: body,
    },
  };

  return transporter.sendMail(mailOptions);
};
