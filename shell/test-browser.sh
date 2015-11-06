#!/bin/sh

set -e

karmaBin=node_modules/karma/bin/karma

# Run browser test
node ${karmaBin} start karma.config.js
