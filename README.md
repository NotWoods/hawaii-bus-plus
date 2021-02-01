# Hawaii Bus Plus

## Contributing

This repository is a monorepo which leverages [pnpm](https://pnpm.js.org/) for dependency management.

To begin, please install `pnpm`:

```bash
$ npm install pnpm -g
$ pnpm recursive install
```

A `.env` file needs to be placed in the root directory, including variables from this template:

```bash
# IPStack API Key
IPSTACK_KEY=xxxxxxxxxxxxxxxxxxxxx
# Google Maps API Key
VITE_GOOGLE_MAPS_KEY=xxxxxxxxxxxxxxxx
# Password for the application
API_KEY=xxxxxxxxxxxxxx
```

### Running

#### Build the API

```bash
pnpm run api
```

Uses the `@hawaii-bus-plus/api-gen` package to generate an API file, which is placed in the client package's public directory.

#### Test the code

```bash
pnpm recursive test
```

Runs the test script in every single package.

#### Run the client

```bash
pnpm run dev
```

Uses the `@hawaii-bus-plus/client` package to start a server on `localhost:3000`. [Vite](https://vitejs.dev/) is used for the dev server and automatically deals with bundling.
