#!/bin/bash

set -u

version=$(<VERSION)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        if [ -f "${directory}/package.json" ]; then
            # Create module / package links
            (
                cd ${directory};

                # Update package version
                npm version ${version};

                # publish package to npm
                npm publish --dry-run;
            )
        fi
    fi
done
