# Contributing

## Getting started

1. Fork the repo and checkout your fork
2. Create a branch for your change 
1. `nvm use` to pick up node version from `.nvmrc`
3. `npm i --ci` to install all required packages 
1. `npm run watch` - tests should now run and pass.

## Testing

Tests are located in `./test` and can be run in watch mode via `npm run watch`.

All changes code must have accompanying tests. If you are adding a new feature to the library, add an integration test that uses the library as a user might use it in their own tests. Be sure to include unit tests for the individual components too.

