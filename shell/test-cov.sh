#!/bin/sh

set -e

# remove coverage dir
rm -fr coverage

istanbulBin=node_modules/istanbul/lib/cli.js
karmaBin=node_modules/karma/bin/karma
mochaBin=node_modules/mocha/bin/_mocha

mochaArgs=$(shell/_get-test-directories.sh)

# pretest tasks
node ./shell/pretest.js

# Run Node tests
node ${istanbulBin} cover --report json --print none ${mochaBin} -- ${mochaArgs} --reporter spec --ui tdd --timeout 10000

# Run browser test
node ${karmaBin} start karma.config.js --log-level error --reporters coverage,dots --ui tdd --timeout 10000

# Combine Node / browser reports
node ${istanbulBin} report lcov

if [ -n "$CI" ]; then
    # Send to codecov.io
    cat ./coverage/lcov.info | ./node_modules/.bin/codecov
else
    # Open in browser
    test -n "`which open`" && open coverage/lcov-report/index.html
fi
