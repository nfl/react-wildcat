#!/bin/sh

set -e

TEST_DIRS=""

for f in packages/react-wildcat; do
  if [ -n "$TEST_ONLY" ] && [ `basename $f` != "$TEST_ONLY" ]; then
    continue
  fi

  if [ -d "$f/test" ]; then
    TEST_DIRS="$PWD/$f/test $TEST_DIRS"
  fi
done

echo $TEST_DIRS
