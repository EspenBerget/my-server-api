// import { open, save } from "<https://deno.land/x/sqlite/mod.ts>";
import { Server } from './server.js';

const server = new Server(8001);

server.get('/', req => {
    req.respond({body: "hello world"});
});

await server.listen();