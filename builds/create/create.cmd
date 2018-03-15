@ECHO OFF
REM %1 is app directory + id
REM %2 is app name

IF "%~2"=="" (
	@ECHO ON
	ECHO Missing an app name
	ECHO create.cmd "com.kidoju.en00" "Kidoju UK Reception"
	GOTO:EOF
)
IF "%~1"=="" (
	@ECHO ON
	ECHO Missing an app dir/id
	ECHO create.cmd "com.kidoju.en00" "Kidoju UK Reception"
	GOTO:EOF
)

@ECHO ON
CD /d %~dp0

REM Check directory exists
IF EXIST %1 GOTO:EOF

REM Create a new phonegap application
CALL phonegap create %~1 --id "%~1" --name "%~2"

REM Initialize package.json
CD %1
CALL npm init -y

REM Install build packages
CALL npm i autoprefixer --save-dev
CALL npm i bundle-loader --save-dev
CALL npm i css-loader --save-dev
CALL npm i deasync --save-dev
CALL npm i deep-extend --save-dev
CALL npm i ejs --save-dev
CALL npm i file-loader --save-dev
CALL npm i grunt --save-dev
CALL npm i grunt-contrib-copy --save-dev
CALL npm i grunt-contrib-uglify --save-dev
CALL npm i grunt-webpack --save-dev
CALL npm i less --save-dev
CALL npm i less-loader --save-dev
CALL npm i loader-utils --save-dev
CALL npm i nconf --save-dev
CALL npm i postcss-loader --save-dev
CALL npm i style-loader --save-dev
CALL npm i url-loader --save-dev
CALL npm i webpack@3 --save-dev

REM install plugs and platforms
COPY ..\..\Kidoju\Kidoju.Mobile\plugins.cmd .\ /Y
CALL plugins.cmd

REM Copy excludelist.txt for XCOPY
COPY ..\..\Kidoju\Kidoju.Mobile\builds\create\excludelist.txt .\ /Y
ATTRIB +R .\excludelist.txt /S

REM Clear www
RD www /Q /S
MD www\build
XCOPY ..\..\Kidoju\Kidoju.Mobile\www\res .\www\res  /C /E /I /R /Y /EXCLUDE:excludelist.txt

REM Copy graphics
XCOPY ..\..\Kidoju\Kidoju.Mobile\graphics .\graphics  /C /E /I /R /Y /EXCLUDE:excludelist.txt
REM ATTRIB +R .\graphics\*.* /S

REM update all files
COPY ..\..\Kidoju\Kidoju.Mobile\builds\create\update.cmd .\ /Y
CALL update.cmd

REM Copy app.constants.js
COPY ..\..\Kidoju\Kidoju.Mobile\js\app.constants.js .\js /Y

REM Create git repository
CALL git init
CALL git add .
CALL git commit -m "Initial commit"

REM Get back to where we are coming from
CD..
