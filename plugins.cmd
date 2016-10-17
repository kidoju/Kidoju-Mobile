phonegap plugin add cordova-plugin-console --save
phonegap plugin add cordova-plugin-crosswalk-webview --save
phonegap plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=kidoju --save
phonegap plugin add cordova-plugin-dialogs --save
REM cordova plugin add cordova-plugin-google-analytics
phonegap plugin add cordova-plugin-inappbrowser --save
phonegap plugin add cordova-plugin-secure-storage --save
phonegap plugin add cordova-plugin-splashscreen --save
phonegap plugin add cordova-plugin-statusbar --save
phonegap plugin add cordova-plugin-wkwebview-engine --save
phonegap plugin add cordova-plugin-x-socialsharing --save
phonegap plugin add phonegap-plugin-barcodescanner --variable CAMERA_USAGE_DESCRIPTION="To Scan QR Codes" --save

phonegap prepare
