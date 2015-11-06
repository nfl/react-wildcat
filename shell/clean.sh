#!/bin/bash

set -u

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

            # spacer.gif
            echo "";
        )
    fi
done
