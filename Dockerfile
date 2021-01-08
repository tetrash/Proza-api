FROM node:14.9.0-alpine
ENV DIR=/api
WORKDIR $DIR

COPY package.json yarn.lock $DIR/
COPY package.json $DIR/server
RUN yarn

COPY . .

RUN yarn build

ENV ENV=prod
CMD ["node", "./dist/index.js"]