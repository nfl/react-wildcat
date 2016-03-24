#!/bin/sh

set -e

TEST_DIRS=""

for f in packages/*; do
  if [ -n "$TEST_ONLY" ] && [ `basename $f` != "$TEST_ONLY" ]; then
    continue
  fi

  if [ -d "$f/test" ]; then
    TEST_DIRS="$f/test $TEST_DIRS"
  fi
done

# Add CLI tests
CLI_DIR="packages/react-wildcat/cli"
TEST_DIRS="$CLI_DIR/test $TEST_DIRS"

echo $TEST_DIRS
