#!/bin/sh

set -e

if [ -z "$TEST_GREP" ]; then
   TEST_GREP=""
fi

mochaArgs=$(shell/_get-test-directories.sh --opts mocha.opts)

node node_modules/mocha/bin/_mocha ${mochaArgs} --grep "$TEST_GREP"
