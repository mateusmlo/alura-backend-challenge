FROM node:lts-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn install --production && yarn build

CMD ["node", "/dist/main"]

FROM node:lts-alpine AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn && yarn build

CMD ["node", "/dist/main"]