FROM node:4.4.4
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ARG JSPM_GITHUB_AUTH_TOKEN

RUN mkdir /code
WORKDIR /code

RUN npm install -g npm@3.10.5

COPY ./package.json /code/package.json
RUN npm cache clean && npm install

COPY ./system.config.js /code/system.config.js
RUN jspm install

COPY ./ ./
