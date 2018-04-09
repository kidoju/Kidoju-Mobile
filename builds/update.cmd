@ECHO ON
CD /d %~dp0

REM Copy all files
XCOPY ..\..\Kidoju\Kidoju.Mobile\hooks .\hooks  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\hooks\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\js .\js  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\js\*.* /S
ATTRIB -R .\js\app.constants.js
XCOPY ..\..\Kidoju\Kidoju.Mobile\styles .\styles  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\styles\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\web_modules .\web_modules  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\web_modules\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\webapp .\webapp  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\webapp\*.* /S
DEL .\webapp\public\build\workerlib.bundle.js /F /Q

REM Update .\www directory except resources
REM .\www files cannot be readonly - See https://github.com/phonegap/phonegap-cli/issues/772
XCOPY ..\..\Kidoju\Kidoju.Mobile\www\img .\www\img  /C /E /I /R /Y /EXCLUDE:excludelist.txt
REM ATTRIB +R .\www\img\*.* /S
COPY ..\..\Kidoju\Kidoju.Mobile\www\index.html .\www /Y
REM ATTRIB +R .\www\index.html /S

REM Copy environment files
ATTRIB -R .\.*
COPY ..\..\Kidoju\Kidoju.Mobile\.babelrc .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.editorconfig .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.eslintignore .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.eslintrc .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.gitattributes .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.gitignore .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.jscsrc .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.jshintignore .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.jshintrc .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.npmignore .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.stylelintignore .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.stylelintrc .\ /Y
ATTRIB +R .\.*

REM Copy build files
ATTRIB -R .\*.js
COPY ..\..\Kidoju\Kidoju.Mobile\gruntfile.js .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\postcss.config.js .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\webpack.config.js .\ /Y
ATTRIB +R .\*.js

REM Copy batch files
ATTRIB -R .\*.cmd
ATTRIB -R .\*.md
ATTRIB -R .\*.txt
COPY ..\..\Kidoju\Kidoju.Mobile\builds\excludelist.txt .\ /Y
REM COPY ..\..\Kidoju\Kidoju.Mobile\builds\update.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\build.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\BUILD.md .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\kidoju.server.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\watch.cmd .\ /Y
ATTRIB +R .\*.cmd
ATTRIB +R .\*.md
ATTRIB +R .\*.txt

SETLOCAL

REM Define variables id and name
set ID=__id__
set NAME=__name__

REM Copy and modify config.xml
COPY ..\..\Kidoju\Kidoju.Mobile\config.xml .\ /Y
sed -i -e "s/com.kidoju.mobile/%ID%/g" ./config.xml
sed -i -e "s/Kidoju Mobile/%NAME%/g" ./config.xml

REM Copy and modify packages.json
COPY ..\..\Kidoju\Kidoju.Mobile\package.json .\ /Y
sed -i -e "s/com.kidoju.mobile/%ID%/g" ./package.json
sed -i -e "s/Kidoju[\.-]Mobile/%ID%/g" ./package.json

ENDLOCAL
