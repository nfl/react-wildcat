#!/bin/bash

set -u

example=example
version=$(<VERSION)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        # Create module / package links
        (
            cd ${directory};

            # react-wildcat-handoff depends on react-wildcat-radium
            if [ "${package}" == "react-wildcat-handoff" ]; then
                npm link "react-wildcat-radium";
            fi

            # Link package to npm
            npm link;

            # Link package to jspm
            jspm link npm:${package}@${version} --log warn -y;
        )

        # Link module / package in example
        (
            cd ${example};

            # Link package to npm
            npm link ${package};

            # Link package to jspm
            jspm install --link npm:${package}@${version} --log warn -y;
        )
    fi
done
