FROM node:14.9.0-alpine
ENV DIR=/app
WORKDIR $DIR

COPY package.json yarn.lock $DIR/
RUN yarn

COPY . .

RUN yarn build

ENV ENV=prod
CMD ["node", "./dist/index.js"]