#!/bin/sh

set -e

istanbulBin=node_modules/istanbul/lib/cli.js
mochaBin=node_modules/mocha/bin/_mocha

mochaArgs=$(shell/_get-test-directories.sh)

# Run Node tests
node ${istanbulBin} cover --report json --print none ${mochaBin} -- ${mochaArgs} --reporter spec --ui tdd --timeout 10000
