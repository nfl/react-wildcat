#!/bin/sh

set -e

istanbulBin=node_modules/istanbul/lib/cli.js

if [ -n "$DOCKER" ]; then
    # TODO: launch browser
    # Exit when in docker
    exit 0
fi

# Combine Node / browser reports
node ${istanbulBin} report lcov

if [ -n "$CI" ]; then
    # Send to codecov.io
    ./node_modules/.bin/codecov -f ./coverage/lcov.info
else
    # Open in browser
    test -n "`which open`" && open coverage/lcov-report/index.html
fi
