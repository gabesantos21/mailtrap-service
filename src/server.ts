import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { sendEmail } from './utils/mailer.utils';
import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

const port = Number(process.env.APP_PORT) || 5050;

app.get('/', (req: Request, res: Response) =>
  res.json({
    message: 'Mailtrap Server is up.',
    version: process.env.API_VERSION,
  })
);

// for multiple email sending
const fetchEmails = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return (await response.json()).map((user: any, index: number) => ({
    email: user.email,
    index,
  }));
};

app.post('/bulk-mail', async (req: Request, res: Response) => {
  try {
    fetchEmails()
      .then((emails) => {
        const emailPromises = emails.map(async (data: any) => {
          if (data.index > 3) return; // remove if on premium plan only
          await sendEmail(
            `Sample Subject ${data.index}`,
            `Sample Message ${data.index}`,
            data.email
          );
        });

        return Promise.all(emailPromises);
      })
      .then(() => {
        res.status(200).json({ Message: 'Successfully sent emails.' });
      });
  } catch (e) {
    res.json({ 'Internal Server Error': e });
  }
});

app.post('/single-mail', async (req: Request, res: Response) => {
  try {
    await sendEmail(
      'Sample Subject',
      'Sample Message',
      'sample_email@mail.com'
    );
    res.status(200).json({ Message: 'Successfully sent email!' });
  } catch (e) {
    res.json({ 'Internal Server Error': e });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
