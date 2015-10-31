#!/bin/bash

set -u
set -x

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Create module / package links
        (
            cd ${directory};

            # Link package to npm
            npm test;
        )
    fi

    echo "";
done
