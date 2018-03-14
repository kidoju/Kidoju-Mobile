cd /d %~dp0

call phonegap plugins add cordova-plugin-battery-status --save
call phonegap plugins add cordova-plugin-console --save
call phonegap plugins add cordova-plugin-customurlscheme --variable URL_SCHEME=com.kidoju.en00 --save
call phonegap plugins add cordova-plugin-device --save
call phonegap plugins add cordova-plugin-dialogs --save
call phonegap plugins add cordova-plugin-file --save
call phonegap plugins add cordova-plugin-google-analytics --save
call phonegap plugins add cordova-plugin-inappbrowser --save
call phonegap plugins add cordova-plugin-local-notification --save
call phonegap plugins add cordova-plugin-network-information --save
call phonegap plugins add cordova-plugin-safariviewcontroller --save
call phonegap plugins add cordova-plugin-splashscreen --save
REM call phonegap plugins add cordova-plugin-statusbar --save
REM call phonegap plugins add cordova-plugin-tts --save
call phonegap plugins add https://github.com/vilic/cordova-plugin-tts#b25e7ac --save
call phonegap plugins add cordova-plugin-whitelist --save
call phonegap plugins add cordova-plugin-x-socialsharing --save
call phonegap plugins add phonegap-plugin-barcodescanner --variable CAMERA_USAGE_DESCRIPTION="Scan QR Codes" --save

call phonegap platforms add android
call phonegap platforms add ios
