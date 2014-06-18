cd /d %~dp0
xcopy ..\Kidoju.Widgets\dist\*.* www\*.* /S /C /Y
copy ..\Kidoju.Server\client\js\app.rapi.js www\js\app.rapi.js /Y