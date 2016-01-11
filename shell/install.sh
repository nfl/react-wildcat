#!/bin/bash

set -u

example=example
version=$(<VERSION)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        if [ -f "${directory}/package.json" ]; then
            # Create module / package links
            (
                cd ${directory};

                # Link package to npm
                npm link;

                if [[ "$package" != "react-wildcat" && "$package" != "react-wildcat-test-runners" ]]; then
                    # Link package to jspm
                    jspm link npm:${package}@${version} --log warn -y;
                fi
            )
        fi
    fi
done
