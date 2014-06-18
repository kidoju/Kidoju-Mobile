cd /d %~dp0
call "%ProgramFiles%\nodejs\nodevars.bat"
REM run mongodb
start cmd /k "call ..\Kidoju.Server\mongodb.cmd"
REM run node
start cmd /k "node ..\Kidoju.Server\api\server.js"