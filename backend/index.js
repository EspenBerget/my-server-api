import { Server } from './server.js';
import {addEvent, removeEvent, updateEvent, getAllEvents, closeDB} from './db.js';

const decoder = new TextDecoder();
function getJSON(buf) {
    const json = buf.then(b => 
        JSON.parse(decoder.decode(b))
    );
    return json;
}

async function processBuffer(readBuffer) {
    let buf = new Uint8Array(4096);
    const n = await readBuffer.read(buf);
    return buf.slice(0, n);
}

const server = new Server(8001);

server.get('/', req => {
    req.respond({body: "hello world"});
});

server.get('/events/all', req => {
    const events = getAllEvents();
    req.respond({body: JSON.stringify(events)});
});

server.post("/events/new", req => {
    let buf = processBuffer(req.r);
    getJSON(buf).then(json => {
        addEvent(json.desc);
    });
    req.respond({
        body: JSON.stringify({reply: "adding event"})
    });
});

// server.delete('/events/:id', TODO);
// server.get("/events/:id", TODO);

await server.listen();

closeDB();