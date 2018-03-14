cd /d %~dp0
REM call "%ProgramFiles%\nodejs\nodevars.bat"
REM run mongodb
start cmd /k "call ..\..\Kidoju\Kidoju.Server\mongodb.cmd"
REM run node
timeout 5
set NODE_ENV=mobile
start cmd /k "node ..\..\Kidoju\Kidoju.Server\api\server.js"
watch.cmd
