CD /d %~dp0
CALL npm outdated
CALL phonegap platform remove android
CALL phonegap platform remove browser
CALL phonegap platform remove ios
CALL phonegap platform remove windows
REM CALL phonegap plugin remove phonegap-plugin-barcodescanner
REM CALL phonegap plugin add phonegap-plugin-barcodescanner --variable CAMERA_USAGE_DESCRIPTION="Scan QR Codes" --save
CALL npm update
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package-lock.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./config.xml
CALL phonegap platform add android@7.1.0
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package-lock.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./config.xml
CALL phonegap platform add browser@5.0.3
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package-lock.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./config.xml
CALL phonegap platform add ios@4.5.4
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package-lock.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./config.xml
CALL phonegap platform add windows@6.0.0
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package-lock.json
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./config.xml
