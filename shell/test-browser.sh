#!/bin/sh

set -e

TIMEOUT=10000

if [ -n "$CI" ]; then
    TIMEOUT=120000;
fi

karmaBin=node_modules/karma/bin/karma

# Run browser test
node ${karmaBin} start karma.config.js --log-level error --ui tdd --timeout ${TIMEOUT} --bail
