#!/bin/bash

# There are dependencies between plugins and some plugins might not be removed like cordova-plugin-file which would make add fail
# At some point the best way to circumvent that is to update version numbers in config.xml, then remove the platform and add the platform again

PLUGINS=$(phonegap plugin list | awk '{print $1'})

for PLUGIN in $PLUGINS; do
    phonegap plugin rm $PLUGIN --save && phonegap plugin add $PLUGIN@latest --save
done
