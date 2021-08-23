FROM node:fermium-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

RUN rm yarn.lock
RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn add -D @types/node
RUN rm yarn.lock
RUN yarn install --production && yarn build

CMD ["node", "/dist/main"]

FROM node:fermium-alpine AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

RUN rm yarn.lock
RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn add -D @types/node
RUN yarn && yarn build

CMD ["node", "/dist/main"]