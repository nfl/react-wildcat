#!/bin/sh

set -e

TIMEOUT=10000

if [ -n "$CI" ]; then
    TIMEOUT=120000;
fi

istanbulBin=node_modules/istanbul/lib/cli.js
mochaBin=node_modules/mocha/bin/_mocha

mochaArgs=$(shell/_get-test-directories.sh)

# Run Node tests
node ${istanbulBin} cover --report json --dir coverage/node --print none ${mochaBin} -- ${mochaArgs} --reporter spec --ui tdd --timeout ${TIMEOUT} --bail
