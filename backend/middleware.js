export async function getJSON(req) {
    let buf = await Deno.readAll(req.body);
    req.json = JSON.parse(new TextDecoder().decode(buf));
    return Promise.resolve("done");
}

export function checkJSON(correct) {
    return req => {
        req.jsonErrors = "";
        if (req.json === undefined) {
            req.jsonErrors = "no JSON found";
        } else {
            for (const k in correct) {
                if (req.json[k] === undefined) {
                    req.jsonErrors += ` ! missing ${k} of ${correct[k]}`;
                } else if (typeof req.json[k] !== correct[k]) {
                    req.jsonErrors += ` ! wrong type of ${k}, is ${typeof req.json[k]} but should be ${correct[k]}`;
                }
            }
        } 
    }
}