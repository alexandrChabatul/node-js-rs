import cluster from "cluster";
import os from 'os';
import { createServer } from "./worker.js";
import dotenv from 'dotenv';
dotenv.config();
const PORT: number = Number(process.env.PORT) || 3000;

if (cluster.isPrimary) {
  const num = os.cpus().length - 1;
  for (let i = 1; i <= num; i++) {
    cluster.fork({PORT: PORT + i});
  }
} else {
  createServer(process.env.PORT);
}