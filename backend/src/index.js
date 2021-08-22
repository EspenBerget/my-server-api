import { Server, respondWithJSON } from './server.js';
import {addEvent, removeEvent, updateEvent, getEvent, getAllEvents, closeDB} from './db.js';
import {getJSON, checkJSON, getQuery} from './middleware.js';

const server = new Server(8001, true);


server.get('/', req => {
    req.respond({body: "hello world"});
});

server.get('/events', req => {
    const events = getAllEvents();
    respondWithJSON(req, events);
});

server.post('/event', 
    getJSON,
    checkJSON({desc: "string"}),
    req => {
        if (req.jsonErrors === "") {
            addEvent(req.json.desc);
            respondWithJSON(req, {status: "ok"});
        } else {
            respondWithJSON(req, {status: req.jsonErrors});
        }
    }
);

server.get('/event', 
    getQuery,
    req => {
        if (req.query.id !== undefined) {
            const event = getEvent(req.query.id);
            respondWithJSON(req, event);
        } else {
            respondWithJSON(req, {status: "query param 'id' is missing"});
        }
    }
);


server.delete('/event', 
    getQuery,
    req => {
       if (req.query.id !== undefined) {
           removeEvent(req.query.id);
           respondWithJSON(req, {status: "deleted"});
       } else {
           respondWithJSON(req, {status: "query param 'id' is missing"});
       }
    }
);

server.patch('/event', 
    getQuery,
    getJSON,
    checkJSON({desc: "string"}),
    req => {
        if (req.query.id !== undefined) {
            if (req.jsonErrors === "") {
                updateEvent(req.query.id, req.json.desc);
                respondWithJSON(req, {status: "patched"});
            } else {
                respondWithJSON(req, {status: req.jsonErrors});
            }
        } else {
            respondWithJSON(req, {status: "query param 'id' is missing"});
        }
    }
);

await server.listen();

closeDB();