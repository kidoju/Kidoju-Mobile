cd /d %~dp0
REM call "%ProgramFiles%\nodejs\nodevars.bat"
REM run mongodb
start cmd /k "call ..\Memba.Server\mongodb.cmd"
REM run node
timeout 5
set NODE_ENV=development
start cmd /k "node ..\Memba.Server\webapp\server.js"
watch.cmd
