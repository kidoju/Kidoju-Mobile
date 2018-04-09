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
IF EXIST %1 GOTO DIR_EXISTS

REM Create a new phonegap application
REM CALL phonegap create %~1 --id "%~1" --name "%~2"

REM Create git repository
git clone https://github.com/kidoju/%~1
IF ERRORLEVEL 1 GOTO GIT_ERROR

REM Go into new directory
CD %1

REM Copy excludelist.txt for XCOPY
COPY ..\..\Kidoju\Kidoju.Mobile\builds\excludelist.txt .\ /Y
ATTRIB +R .\excludelist.txt /S

REM Copy graphics
XCOPY ..\..\Kidoju\Kidoju.Mobile\graphics .\graphics  /C /E /I /R /Y /EXCLUDE:excludelist.txt

REM Create and run update batch
COPY ..\..\Kidoju\Kidoju.Mobile\builds\update.cmd .\ /Y
sed -i -e "s/__id__/%~1/g" ./update.cmd
sed -i -e "s/__name__/%~2/g" ./update.cmd

REM Wait for 5 sec and launch an update
ping 127.0.0.1 -n 6 > nul
CALL update.cmd

REM Copy app.constants.js (which should not be readonly)
COPY ..\..\Kidoju\Kidoju.Mobile\js\app.constants.js .\js /Y

REM Add resources (especially icons and splash screens)
XCOPY ..\..\Kidoju\Kidoju.Mobile\www\res .\www\res  /C /E /I /R /Y /EXCLUDE:excludelist.txt

REM Make build directory
MD .\www\build

REM Install packages
CALL npm install --only=prod
CALL npm install --only=dev

REM Run Phonegap
CALL phonegap prepare android
CALL phonegap prepare browser
CALL phonegap prepare ios
CALL phonegap prepare windows

REM Add to git
REM git add .
REM git commit -m "Initial commit"

REM Get back to where we are coming from
CD..

GOTO :EOF

:DIR_EXISTS
ECHO Directory %1 already exists
GOTO :EOF

:GIT_ERR
ECHO Cannot clone https://github.com/kidoju/%~1
