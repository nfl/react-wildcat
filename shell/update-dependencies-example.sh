#!/bin/bash

example=example

(
    cd $example;
    ncu --upgradeAll;
    jspm update;
);
