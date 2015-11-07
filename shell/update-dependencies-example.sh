#!/bin/bash

set -e

example=example

(
    cd $example;
    ncu --upgradeAll;
    jspm update;
);
