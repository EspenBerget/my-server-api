import { serve } from "https://deno.land/std@0.103.0/http/server.ts";

export class Server {
    constructor(port, loggingOn = false) {
        this.port = port;
        this.loggingOn = loggingOn;

        this.server = serve({ port });

        // url -> (method -> handle)
        this.routes = new Map();
    }

    // Adds a reply to any option request for all urls
    addOption() {
        for (const methodMap of this.routes.values()) {
            let methods = "";
            for (const method of methodMap.keys()) {
                if (methods !== "") {
                    methods += ", ";
                }
                methods += method;
            }
            methodMap.set('OPTIONS', makeOptionsHandler(methods));
        }
    }

    log(req) {
        if (this.loggingOn) {
            console.log(`server: got %c${req.method}%c request on %c${req.url}%c from %c${req.headers.get("user-agent")}`,
                "color: red",
                "color: white",
                "color: lightgreen",
                "color: white",
                "color: orange");
        }
    }

    async listen() {
        console.log(`Starting server on localhost:${this.port}`);

        this.addOption();

        for await (const req of this.server) {
            this.run(req);
        }
    }

    run(req) {
        this.log(req);
        // this localhost stuff is a hack but it will work fine, and give us the 
        // needed functionality from the URL class.
        let url = new URL("https://localhost" + req.url);
        let methods = this.routes.get(url.pathname);
        if (methods === undefined) {
            req.respond({ status: 404, body: "Not Found" });
            return;
        }
        
        let handle = methods.get(req.method);
        if (handle === undefined) {
            req.respond({ status: 404, body: "Not Found" });
            return;
        }

        handle(req);
    }

    // Handlers
    handle(route, handles, method) {
        let methods = this.routes.get(route);

        if (methods === undefined) {
            methods = new Map();
            this.routes.set(route, methods);
        }

        methods.set(method, async req => {
            for (const h of handles) {
                await h(req);
            }
        });
    }

    get(route, ...handles) {
        this.handle(route, handles, "GET");
    }

    post(route, ...handles) {
        this.handle(route, handles, "POST");
    }
    
    patch(route, ...handles) {
        this.handle(route, handles, "PATCH");
    }

    delete(route, ...handles) {
        this.handle(route, handles, "DELETE");
    }
}

const corsAll = new Headers({
    "Access-Control-Allow-Origin": "*",
});

export function respondWithJSON(req, obj, headers = corsAll) {
    req.respond({body: JSON.stringify(obj), headers});
}


function makeOptionsHandler(methods) {
    return req => {
        req.respond({body: null, headers: new Headers({
            'Access-Control-Allow-Methods': methods,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        })});
    }
}