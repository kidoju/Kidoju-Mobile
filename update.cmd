cd /d %~dp0

REM Copy Kidoju webfonts
REM xcopy ..\Kidoju.WebFonts\dist\fonts\*.* www\styles\fonts\*.* /S /C /Y

REM Copy Memba widgets
xcopy ..\..\Memba\Memba.Widgets\dist\*.* www\*.* /S /C /Y

REM Copy Kidoju widgets
xcopy ..\Kidoju.Widgets\dist\*.* www\*.* /S /C /Y

copy ..\Kidoju.Server\client\js\app.rapi.js www\js\app.rapi.js /Y
copy ..\Kidoju.Server\client\js\app.cache.js www\js\app.cache.js /Y
copy ..\Kidoju.Server\client\js\app.models.js www\js\app.models.js /Y

copy ..\Kidoju.Server\test\client\app.models.mock.js www\js\app.models.mock.js /Y
