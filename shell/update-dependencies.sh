#!/bin/bash

set -e

for directory in packages/*; do
    if [ -d "${directory}" ]; then
        (
            cd $directory;
            ncu --upgradeAll
        );
    fi
done
