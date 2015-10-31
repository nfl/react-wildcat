#!/bin/bash

set -u
set -x

example=example

# Remove existing modules / packages
(
    cd ${example};

    # Remove node modules
    rm -fr node_modules;

    # Remove jspm packages
    rm -fr jspm_packages;

    # spacer.gif
    echo "";
)
