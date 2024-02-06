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

app.post('/mail', async (req: Request, res: Response) => {
  try {
    await sendEmail(
      'Sample Subject',
      'Sample Message',
      'sample_email@mail.com'
    );
    res.status(200).json({ Message: 'Successfully sent email!' });
  } catch(e) {
    res.json({'Error': e});
  }
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
