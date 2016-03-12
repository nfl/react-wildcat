#!/bin/sh

set -e

istanbulBin=node_modules/istanbul/lib/cli.js

# Combine Node / browser reports
node ${istanbulBin} report lcov

if [ -n "$CI" ]; then
    # Send to codecov.io
    cat ./coverage/lcov.info | ./node_modules/.bin/codecov
else
    # Open in browser
    test -n "`which open`" && open coverage/lcov-report/index.html
fi
