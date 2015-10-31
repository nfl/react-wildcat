#!/bin/bash

set -u
set -x

example=example

# Install remaining modules / packages
(
    cd ${example};

    # Install node modules
    npm test;
)
