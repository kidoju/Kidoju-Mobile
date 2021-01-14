cd /d %~dp0
REM The following requires modifying C:\Windows\System32\Drivers\etc\hosts
start "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://lvh.me:3000"
REM The following requires https://www.npmjs.com/package/http-server
http-server ./www -p 3000
