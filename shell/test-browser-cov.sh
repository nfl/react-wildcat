#!/bin/sh

set -e

rm -fr coverage

istanbulBin=node_modules/istanbul/lib/cli.js
karmaBin=node_modules/karma/bin/karma

# pretest tasks
node ./shell/pretest.js

# Run browser test
node ${karmaBin} start karma.config.js

# Combine Node / browser reports
node ${istanbulBin} report lcov

# Open in browser
test -n "`which open`" && open coverage/lcov-report/index.html
