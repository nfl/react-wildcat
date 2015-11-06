#!/bin/sh
set -e

rm -fr coverage

istanbulBin=node_modules/istanbul/lib/cli.js
karmaBin=node_modules/karma/bin/karma
mochaBin=node_modules/mocha/bin/_mocha

mochaArgs=$(shell/_get-test-directories.sh --opts mocha.opts)

# pretest tasks
node ./shell/pretest.js

# Run Node tests
node ${istanbulBin} cover ${mochaBin} -- ${mochaArgs}

# Run browser test
node ${karmaBin} start karma.config.js

# Combine Node / browser reports
node ${istanbulBin} report lcov

# Send to codecov.io
if [ -n "$CI" ]; then
    cat ./coverage/lcov.info | ./node_modules/.bin/codecov
else
    # Open in browser
    test -n "`which open`" && open coverage/lcov-report/index.html
fi
