#!/bin/bash

PLUGINS=$(phonegap plugin list | awk '{print $1'})

for PLUGIN in $PLUGINS; do
    phonegap plugin rm $PLUGIN --save && phonegap plugin add $PLUGIN --save
done
