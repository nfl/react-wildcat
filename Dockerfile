FROM node:4.4.4
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_OPTIONAL false

# Github auth token has to be passed in during build time, unfortunately
# the only way to do this is via an environment variable on the host
# machine that must be set. To generate a token use `jspm registry config github`
# This is the only dependency outside of docker that's needed
ARG JSPM_GITHUB_AUTH_TOKEN

# Set on travis, needed for combine-coverage.sh
ARG CI

RUN mkdir /code
WORKDIR /code

RUN npm install -g npm@3.10.5
RUN npm install -g jspm && jspm config registries.github.auth $JSPM_GITHUB_AUTH_TOKEN

COPY ./package.json /code/package.json
COPY ./system.config.js /code/system.config.js

COPY ./ ./

RUN npm cache clean && make test-travis

ENTRYPOINT make
CMD test-travis
