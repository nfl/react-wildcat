#!/bin/bash

set -u

example=example
version=$(<VERSION)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Link module / package in example
        (
            cd ${example};

            # Link package to npm
            npm link ${package};

            # Link package to jspm
            jspm install --link npm:${package}@${version} --log warn -y;
        )
    fi

    echo "";
done

# Install remaining modules / packages
(
    cd ${example};

    # Install node modules
    npm install;

    # Install jspm packages
    jspm install --log warn -y;
)
