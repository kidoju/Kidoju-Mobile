cd /d %~dp0
call "%ProgramFiles%\nodejs\nodevars.bat"
REM update npm, which is a requirement for some modules
npm install -g npm
REM grunt command in terminal mode
npm install -g grunt-cli
REM code coverage with istanbul
npm install -g istanbul
REM karma command in terminal mode
npm install -g karma-cli
REM mocha command in terminal mode
npm install -g mocha
REM phonegap command in terminal mode
npm install -g phonegap
REM ripple emulator
npm install -g ripple-emulator
REM install all local modules in package.json
npm install
