# Proza API
[![codecov](https://codecov.io/gh/tetrash/Proza-api/branch/main/graph/badge.svg?token=LBE4LJQDYN)](https://codecov.io/gh/tetrash/Proza-api)

Open-source blog api.

## Folder Structure
```
.
├── .github         # Github actions CI configs
├── api             # Api Definitions
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
$ docker run -p 27017:27017 -d mongo:4.4.2 # Start local mongodb
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

### `PORT`
Type: number

### `LOG_LEVEL`
Type: debug | info | warn | error | http

### `ENV`
Type: dev | prod | test

### `MONGODB_URL`
Type: string

### `MONGODB_DB_NAME`
Type: string

### `MONGODB_USER`
Type: string

### `MONGODB_PASSWORD`
Type: string

## Testing

**Unit tests:**
```
$ yarn test
```

## User authentication
