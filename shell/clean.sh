#!/bin/bash

set -u

# Remove root node modules
rm -fr node_modules;
rm -f yarn.lock;

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Create module / package links
        (
            cd ${directory};

            # Remove node modules
            rm -fr node_modules;
            rm -f yarn.lock;
        )
    fi
done
