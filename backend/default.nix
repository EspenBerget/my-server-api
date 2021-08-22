with (import <nixpkgs> {});

stdenv.mkDerivation {
    pname = "DenoServer";
    version = "1.0.0"; 

    buildInputs = [ deno ];

    shellHook = ''
        deno run --allow-net --allow-write --allow-read index.js
    '';
}