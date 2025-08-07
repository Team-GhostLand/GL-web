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

By default, `bun run build` will generate a Node app that you can run with `bun start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)