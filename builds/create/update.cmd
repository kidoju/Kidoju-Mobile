REM Copy all files
XCOPY ..\..\Kidoju\Kidoju.Mobile\hooks .\hooks  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\hooks\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\js .\js  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\js\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\styles .\styles  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\styles\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\web_modules .\web_modules  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\web_modules\*.* /S
XCOPY ..\..\Kidoju\Kidoju.Mobile\webapp .\webapp  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\webapp\*.* /S
DEL .\webapp\public\build\workerlib.bundle.js /F /Q
XCOPY ..\..\Kidoju\Kidoju.Mobile\www\img .\www\img  /C /E /I /R /Y /EXCLUDE:excludelist.txt
ATTRIB +R .\www\img\*.* /S
COPY ..\..\Kidoju\Kidoju.Mobile\www\index.html .\www /Y
ATTRIB +R .\www\index.html /S

REM Copy environment files
COPY ..\..\Kidoju\Kidoju.Mobile\.editorconfig .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.gitattributes .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\.gitignore .\ /Y
ATTRIB +R .\.* /S

REM Copy build files
COPY ..\..\Kidoju\Kidoju.Mobile\builds\create\gruntfile.js .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\postcss.config.js .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\webpack.config.js .\ /Y
ATTRIB +R .\*.js /S

REM Copy batch files
COPY ..\..\Kidoju\Kidoju.Mobile\builds\create\excludelist.txt .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\builds\create\update.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\build.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\BUILD.md .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\kidoju.server.cmd .\ /Y
COPY ..\..\Kidoju\Kidoju.Mobile\watch.cmd .\ /Y
ATTRIB +R .\*.cmd /S
ATTRIB +R .\*.md /S
ATTRIB +R .\*.txt /S

REM Copy and modify config.xml
COPY ..\..\Kidoju\Kidoju.Mobile\config.xml .\ /Y
sed -i -e "s/com.kidoju.mobile/%~1/g" ./config.xml
sed -i -e "s/Kidoju Mobile/%~2/g" ./config.xml
