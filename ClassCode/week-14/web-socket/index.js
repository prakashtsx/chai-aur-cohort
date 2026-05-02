import http from 'http';
import { Server } from 'socket.io'
import express from 'express';
import path from 'path';

async function main() {
    const app = express();
    app.use(express.static(path.resolve('./public')));

    const server = http.createServer();
    const io = new Server();

    io.attach(server);

    server.listen(3000, () => {
        console.log(`HTTP Server is listening on PORT : 3000`);

    })
}
main()