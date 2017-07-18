FROM node:6.9.1
ENV PATH ./node_modules/.bin/:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_OPTIONAL true

RUN npm install -g yarn
RUN mkdir /code
WORKDIR /code

COPY ./ ./

ENTRYPOINT make
CMD test-travis
