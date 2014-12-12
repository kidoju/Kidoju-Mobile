cd /d %~dp0

REM Copy Kendo UI widgets
copy .\temp\2014.3.1119\js\jquery.min.js .\www\js\vendor\jquery.min.js
copy .\temp\2014.3.1119\js\jquery.min.map .\www\js\vendor\jquery.min.map
copy .\temp\2014.3.1119\js\kendo.all.min.js .\www\js\vendor\kendo.all.min.js
copy .\temp\2014.3.1119\js\kendo.all.min.js.map .\www\js\vendor\kendo.all.min.js.map
REM TODO cultures and messages
copy .\temp\2014.3.1119\styles\kendo.common.min.css .\www\styles\vendor\kendo.common.min.css
copy .\temp\2014.3.1119\styles\kendo.default.min.css .\www\styles\vendor\kendo.default.min.css
copy .\temp\2014.3.1119\styles\kendo.default.mobile.min.css .\www\styles\vendor\kendo.default.mobile.min.css

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
