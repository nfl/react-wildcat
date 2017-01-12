#!/bin/bash

set -u

example=example

# Install remaining modules / packages
(
    cd ${example};

    # Install node modules
    yarn run test;
)
