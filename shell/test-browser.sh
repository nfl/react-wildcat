#!/bin/sh

set -e

karmaBin=node_modules/karma/bin/karma

# pretest tasks
node ./shell/pretest.js

# Run browser test
node ${karmaBin} start karma.config.js --log-level error --reporters coverage,mocha --ui tdd --timeout 10000
