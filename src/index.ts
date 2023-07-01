import http, { IncomingMessage, ServerResponse} from 'http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req);
});

server.listen(port, () => {
    console.log('server listen on port', port);
})