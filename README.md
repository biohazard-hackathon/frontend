Biohazard Frontend
------------------------------

## Requirements
- Docker

## Installation and Running Locally

Both installation and running is recommended to do inside a docker container.
The container setup includes a mock server for the GraphQL API.
This helps with standalone development without the need of a real backend.
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Run Tests
```bash
docker compose run frontend npm test
```

## Design Style Guide

For proper component development read and actively use the Style Guide (Storybook).
You can find it at [http://localhost:9011/](http://localhost:9011/) URL locally and even on staging and prod.

## FAQ

### Auto Reload does not work

Check out [Webpack Dev Server](https://github.com/webpack/docs/wiki/webpack-dev-server#working-with-editorsides-supporting-safe-write) documentation for more info.
