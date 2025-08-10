# GL-web

GhostLand Website 

## Cloning the project

```bash
git clone github.com/Team-GhostLand/GL-web.git ghostland-website
cd ghostland-website
```

## Developing

Once you've cloned the project and installed dependencies with `bun install`, start a development server:

```bash
bun dev

# or start the server and open the app in a new browser tab
bun dev --open

# or start the server and broadcast it to your local network (for eg. mobile dev) 
bun dev --host
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `bun run build` will generate a fully-Bun-compatible Node app which can be ran with `bun run .output/server/index.mjs`.

You may export a better-optimised build by exporting `NODE_ENV=production` and `SERVER_PRESET=bun`before doing `bun run build`. Resulting files can still be ran with `bun run .output/server/index.mjs`. Just make sure to wipe those vars (do `export NODE_ENV=` and `export SERVER_PRESET=`) before running `bun dev` again, otherwise you'll get an `Error 503`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)