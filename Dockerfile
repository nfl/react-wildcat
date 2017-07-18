FROM node:6.10.0
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_OPTIONAL true

RUN mkdir /code
WORKDIR /code

COPY ./ ./

ENTRYPOINT make
CMD test-travis
