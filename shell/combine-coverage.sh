#!/bin/sh

# Combine Node / browser reports
npm run mapCoverage

if [ -n "$CI" ]; then
    # Send to codecov.io
    ./node_modules/.bin/codecov -f ./coverage/lcov.info
else
    # Open in browser
    test -n "`which open`" && open coverage/lcov-report/index.html
fi
