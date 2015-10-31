#!/bin/bash

for directory in packages/*; do
    if [ -d "${directory}" ]; then
        (
            cd $directory;
            ncu --upgradeAll
        );
    fi
done
