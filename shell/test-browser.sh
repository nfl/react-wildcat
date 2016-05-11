#!/bin/sh

set -e

TIMEOUT=10000

if [ -n "$CI" ]; then
    TIMEOUT=120000;
fi

karmaBin=node_modules/karma/bin/karma

# pretest tasks
node ./shell/pretest.js

# Run browser test
node ${karmaBin} start karma.config.js --log-level error --reporters coverage,mocha --ui tdd --timeout ${TIMEOUT} --bail
