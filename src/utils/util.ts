import { IncomingMessage, ServerResponse } from 'http';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const errorResponse = (req: IncomingMessage, res: ServerResponse, code: number, message: string) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.write(
    JSON.stringify({
      message,
    }),
  );
  res.end();
};

const writeToFile = async (data: any) => {
  await writeFile(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(data));
};

export { errorResponse, writeToFile };
