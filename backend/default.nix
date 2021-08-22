with (import <nixpkgs> {});

stdenv.mkDerivation {
    pname = "DenoServer";
    version = "1.0.0"; 

    src = ./src;

    buildInputs = [ deno ];

    DENO_DIR = ".cached";

    buildPhase = ''
        deno compile -o server --allow-net --allow-read --allow-write index.js 
    '';

    installPhase = ''
        mkdir -p $out/bin
        mv server $out/bin
    '';

    shellHook = ''
        $out/bin/server
    '';
}