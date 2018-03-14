CD /d %~dp0

CALL phonegap plugins add cordova-plugin-battery-status@2 --save
CALL phonegap plugins add cordova-plugin-console --save
CALL phonegap plugins add cordova-plugin-customurlscheme --variable URL_SCHEME=com.kidoju.mobile --save
CALL phonegap plugins add cordova-plugin-device@2 --save
CALL phonegap plugins add cordova-plugin-dialogs@2 --save
CALL phonegap plugins add cordova-plugin-file@6 --save
CALL phonegap plugins add cordova-plugin-google-analytics --save
CALL phonegap plugins add cordova-plugin-inappbrowser@2 --save
CALL phonegap plugins add cordova-plugin-local-notification --save
CALL phonegap plugins add cordova-plugin-network-information@2 --save
CALL phonegap plugins add cordova-plugin-safariviewcontroller --save
CALL phonegap plugins add cordova-plugin-splashscreen --save
REM CALL phonegap plugins add cordova-plugin-statusbar --save
REM CALL phonegap plugins add cordova-plugin-tts --save
CALL phonegap plugins add https://github.com/vilic/cordova-plugin-tts#b25e7ac --save
CALL phonegap plugins add cordova-plugin-whitelist --save
CALL phonegap plugins add cordova-plugin-x-socialsharing --save
CALL phonegap plugins add phonegap-plugin-barcodescanner --variable CAMERA_USAGE_DESCRIPTION="Scan QR Codes" --save

REM CALL cordova-check-plugins --update=auto --force-update --unconstrain-versions
CALL cordova-check-plugins --update:auto --force-update

CALL phonegap platforms add android@7.1.0
CALL phonegap platforms add browser
CALL phonegap platforms add ios
CALL phonegap platforms add windows@6.0.0
