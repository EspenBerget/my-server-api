import { Server } from './server.js';
import database, { removeEvent } from './db.js';

const server = new Server(8001);

server.get('/', req => {
    req.respond({body: "hello world"});
});

server.get('/request', req => {
    req.respond({body: JSON.stringify(req)});
})

server.get('/all', req => {
    const events = database.getAllEvents();
    req.respond({body: JSON.stringify(events)});
})

//server.get("/events/:id", TODO);

await server.listen();