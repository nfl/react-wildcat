FROM node:4.4.4
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_OPTIONAL true

# Github auth token has to be passed in during build time, unfortunately
# the only way to do this is via an environment variable on the host
# machine that must be set. To generate a token use `jspm registry config github`
# This is the only dependency outside of docker that's needed
ARG JSPM_GITHUB_AUTH_TOKEN

RUN mkdir /code
WORKDIR /code

RUN npm install -g npm@3.10.5 nfl/jspm-cli#0.16.34/fetch-support && \
  jspm config registries.github.auth $JSPM_GITHUB_AUTH_TOKEN && \
  jspm install

COPY ./ ./

ENTRYPOINT make
CMD test-travis
