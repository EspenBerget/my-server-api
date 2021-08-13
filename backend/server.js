import { serve } from "https://deno.land/std@0.103.0/http/server.ts";

export class Server {
    constructor(port) {
        this.port = port;
        this.server = serve({ port });
        this.routes = new Map();
        // routes is a object of objects.
        // url -> (method -> handle)
    }

    async listen() {
        console.log(`Starting server on localhost:${this.port}`);
        for await (const req of this.server) {
            this.run(req);
        }
    }

    run(req) {
        let methods = this.routes.get(req.url);
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
