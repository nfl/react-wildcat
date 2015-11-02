#!/bin/bash

set -u
set -x

example=example
version=$(<VERSION)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Create module / package links
        (
            cd ${directory};

            # Link package to npm
            npm link;

            # Link package to jspm
            jspm link npm:${package}@${version} -y;
        )

        # Link module / package in example
        (
            cd ${example};

            # Link package to npm
            npm link ${package};

            # Link package to jspm
            jspm install --link npm:${package}@${version} -y;
        )
    fi

    echo "";
done
