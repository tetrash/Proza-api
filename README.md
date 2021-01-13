# Proza API
![GitHub package.json version](https://img.shields.io/github/package-json/v/tetrash/proza-api)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tetrash/proza-api/Build%20and%20test/main)
[![Codecov coverage](https://codecov.io/gh/tetrash/Proza-api/branch/main/graph/badge.svg?token=LBE4LJQDYN)](https://codecov.io/gh/tetrash/Proza-api)
![GitHub](https://img.shields.io/github/license/tetrash/proza-api)
![GitHub milestone](https://img.shields.io/github/milestones/progress/tetrash/proza-api/2)

Open-source blog api.

## Folder Structure
```
.
├── .github         # Github actions CI configs
├── api             # Api Definitions
├── examples        # Configuration examples
├── src             # Source code
│
└── README.md 
```

## Getting started
**Requirements:**
- node 10 or newer
- yarn
- mongodb 4.4.2
- docker (optional)

### Development:
```
$ docker run -p 27017:27017 -d mongo:4.4.2 # Start local mongodb (optional)
$ yarn
$ yarn run start:dev
```

### Build from source:
```
$ yarn
$ yarn build
$ node ./dist/index.js
```

### Build with docker:
```
$ docker build -t blog:latest .
$ docker run -p 3000:3000 -e PORT=3000 blog:latest
```

## Configuration
Application is using environment variables to store configs.

[📄 List of environment variables](https://github.com/tetrash/Proza-api/wiki/Configuration).

## Authentication
[Check the wiki page](https://github.com/tetrash/Proza-api/wiki/Authentication)

## Testing

**Unit tests:**
```
$ yarn test
```
