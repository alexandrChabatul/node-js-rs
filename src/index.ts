import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {});

server.listen(port, () => {
    console.log('server listen on port', port);
})