FROM node:4.4.4
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ARG JSPM_GITHUB_AUTH_TOKEN

RUN apt-get update && apt-get install -y net-tools vim

RUN mkdir /src
WORKDIR /src

RUN npm install -g npm@3.10.5

COPY ./package.json /src/package.json
RUN npm cache clean && npm install

COPY ./system.config.js /src/system.config.js
RUN jspm install

COPY ./ ./
