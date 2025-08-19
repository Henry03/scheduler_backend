import express from 'express';
import dotenv from 'dotenv';
import { validateJson } from './middlewares/validateJson';
import router from './routes';
import { reminderCron } from "./cron/reminder.cron";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Reminder Cron job
reminderCron();

app.use(validateJson);

app.use('/api/v1', router)

export default app;