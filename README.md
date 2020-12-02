# Blog API

## Folder Structure
```
.
├── .github         # Github actions CI config
├── api             # Api Definitions
├── src             # Source code
├── test            # Integration tests
│
└── README.md 
```

## Getting started
**Requirements:**
- node 10 or newer
- yarn

### Development:
```
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

```
| Variable name | type   | description                                       | default     |
|---------------|--------|---------------------------------------------------|-------------|
| PORT          | Number | The port on which the application will be listing | 3000        |
| LOG_LEVEL     | String | Available: debug, http, info, warn, error         | http        |
| ENV           | String | Available: dev, prod, test                        | development |
|               |        |                                                   |             |
```

## Testing

**Unit tests:**
```
$ yarn test
```

**Integration tests:**
```
$ yarn run test:integration
```