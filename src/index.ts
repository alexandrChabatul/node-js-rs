import { createServer } from "./worker.js";
import dotenv from 'dotenv';

dotenv.config();
const PORT: number = Number(process.env.PORT) || 3000;

createServer(PORT.toString());