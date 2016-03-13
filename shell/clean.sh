#!/bin/bash

set -u

# Remove root node modules
rm -fr node_modules;

# Remove root jspm packages
rm -fr jspm_packages;

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Create module / package links
        (
            cd ${directory};

            # Remove node modules
            rm -fr node_modules;

            # Remove jspm packages
            rm -fr jspm_packages;
        )
    fi
done
