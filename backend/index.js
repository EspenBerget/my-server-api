import { Server } from './server.js';
import {addEvent, removeEvent, updateEvent, getAllEvents, closeDB} from './db.js';
import {getJSON, checkJSON} from './middleware.js';


const server = new Server(8001);


server.get('/', req => {
    req.respond({body: "hello world"});
});

server.get('/events/all', req => {
    const events = getAllEvents();
    req.respond({body: JSON.stringify(events)});
});

server.post("/events/new", 
    getJSON,
    checkJSON({desc: "string"}),
    req => {
        if (req.jsonErrors === "") {
            addEvent(req.json.desc);
            req.respond({
                body: JSON.stringify({status: "ok"})
            });
        } else {
            req.respond({
                body: JSON.stringify({status: req.jsonErrors})
            });
        }
    }
);

// server.delete('/events/delete', TODO);
// server.get("/events/get", TODO);

await server.listen();

closeDB();