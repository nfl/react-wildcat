FROM node:6.3.1
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn

# Github auth token has to be passed in during build time, unfortunately
# the only way to do this is via an environment variable on the host
# machine that must be set. To generate a token use `jspm registry config github`
# This is the only dependency outside of docker that's needed
ARG JSPM_GITHUB_AUTH_TOKEN

RUN mkdir /code
WORKDIR /code

COPY ./package.json /code/package.json
RUN npm cache clean && npm install

COPY ./system.config.js /code/system.config.js
RUN jspm install

COPY ./ ./
