import { Server } from './server.js';
import {addEvent, removeEvent, updateEvent, getEvent, getAllEvents, closeDB} from './db.js';
import {getJSON, checkJSON, getQuery} from './middleware.js';


const server = new Server(8001, true);


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

server.get("/events/get", 
    getQuery,
    req => {
        if (req.query.id !== undefined) {
            const event = getEvent(req.query.id);
            req.respond({body: JSON.stringify({event})});
        } else {
            req.respond({body: JSON.stringify({event: null})});
        }
    }
);


server.delete('/events/delete', 
    getQuery,
    req => {
       if (req.query.id !== undefined) {
           removeEvent(req.query.id);
           req.respond({body: JSON.stringify({status: "deleted"})});
       } else {
           req.respond({body: JSON.stringify({status: "not found"})});
       }
    }
);

await server.listen();

closeDB();