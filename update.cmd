cd /d %~dp0
xcopy %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Widgets\dist\*.* %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Mobile\www\*.* /S /Y
xcopy %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Server\client\*.* %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Mobile\www\*.* /S /Y
del %USERPROFILE%\CREATI~1\Kidoju\Kidoju.Mobile\www\.jshintrc