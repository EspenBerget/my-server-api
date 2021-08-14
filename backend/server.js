import { serve } from "https://deno.land/std@0.103.0/http/server.ts";

export class Server {
    constructor(port, loggingOn = false) {
        this.port = port;
        this.server = serve({ port });
        this.routes = new Map();
        // routes is a object of objects.
        // url -> (method -> handle)

        this.loggingOn = loggingOn;
    }

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
            console.log(`server: got %c${req.method}%c request on %c${req.url}%c from %c${req.headers.get("origin")}`,
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
    handle(url, handles, method) {
        let methods = this.routes.get(url);

        if (methods === undefined) {
            methods = new Map();
        }

        methods.set(method, async req => {
            for (const h of handles) {
                await h(req);
            }
        });

        this.routes.set(url, methods);
    }

    get(url, ...handles) {
        this.handle(url, handles, "GET");
    }

    post(url, ...handles) {
        this.handle(url, handles, "POST");
    }
    
    update(url, ...handles) {
        this.handle(url, handles, "UPDATE");
    }

    delete(url, ...handles) {
        this.handle(url, handles, "DELETE");
    }
}

const corsAll = new Headers({"Access-Control-Allow-Origin": "*"});

export function respondWithJSON(req, obj, headers = corsAll) {
    req.respond({body: JSON.stringify(obj), headers});
}


function makeOptionsHandler(methods) {
    return req => {
        req.respond({body: null, headers: new Headers({
            'Allow': methods
        })});
    }
}