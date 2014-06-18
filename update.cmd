cd /d %~dp0
xcopy %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Widgets\dist\*.* %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Mobile\www\*.* /S /C /Y
copy %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Server\client\js\app.rapi.js %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Mobile\www\js\app.rapi.js /Y