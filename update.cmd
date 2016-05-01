cd /d %~dp0

REM ************************************************************
REM IMPORTANT!
REM Kidoju.Widgets, Kidoju.Server and Kidoju.WebApp are the original project where any modifications
REM of locked read-only files should be completed.
REM ************************************************************

REM ------------------------------------------------------------
REM Root files
REM ------------------------------------------------------------

REM copy all dot files
REM ATTRIB -R .\.*
REM COPY ..\..\Kidoju\Kidoju.Webapp\.* .\ /Y
REM ATTRIB +R .\.*

REM build.cmd and BUILD.md
ATTRIB -R .\build.*
COPY ..\..\Kidoju\Kidoju.Webapp\build.* .\ /Y
ATTRIB +R .\build.*

REM TODO Coverage

REM Dockerfile
REM ATTRIB -R .\Dockerfile
REM COPY ..\..\Kidoju\Kidoju.Webapp\Dockerfile .\ /Y
REM ATTRIB +R .\Dockerfile

REM gruntfile.js
REM ATTRIB -R .\gruntfile.js
REM COPY ..\..\Kidoju\Kidoju.Webapp\gruntfile.js .\ /Y
REM ATTRIB +R .\gruntfile.js

REM LICENSE
REM ATTRIB -R .\LICENSE-GPLv3
REM COPY ..\..\Kidoju\Kidoju.Webapp\LICENSE-GPLv3 .\ /Y
REM ATTRIB +R .\LICENSE-GPLv3

REM setup.cmd
ATTRIB -R .\setup.cmd
COPY ..\..\Kidoju\Kidoju.Webapp\setup.cmd .\ /Y
ATTRIB +R .\setup.cmd

REM UPDATE.md
ATTRIB -R .\UPDATE.md
COPY ..\..\Kidoju\Kidoju.Webapp\UPDATE.md .\ /Y
ATTRIB +R .\UPDATE.md

REM watch.cmd
ATTRIB -R .\watch.cmd
COPY ..\..\Kidoju\Kidoju.Webapp\watch.cmd .\ /Y
ATTRIB +R .\watch.cmd

REM webpack
REM ATTRIB -R .\webpack.config.js
REM COPY ..\..\Kidoju\Kidoju.Webapp\webpack.config.js .\ /Y
REM ATTRIB +R .\webpack.config.js

REM ------------------------------------------------------------
REM Graphics
REM ------------------------------------------------------------

REM ------------------------------------------------------------
REM Javascript files
REM ------------------------------------------------------------

REM Copy Kendo UI
XCOPY ..\Kidoju.WebApp\js\vendor\kendo\*.* .\js\vendor\kendo\ /C /E /I /R /Y
ATTRIB +R .\js\vendor\kendo\*

REM Copy localForage
REM XCOPY ..\Kidoju.Widgets\js\vendor\kendo\*.* .\js\vendor\kendo\ /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\kendo\*

REM copy blueimp/md5
REM XCOPY ..\Kidoju.Server\client\js\vendor\blueimp .\js\vendor\blueimp /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\blueimp\*.* /S

REM Copy CodeMirror
REM XCOPY ..\Kidoju.Widgets\src\js\vendor\codemirror .\js\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\codemirror\*.* /S

REM Copy HighlightJS
REM XCOPY ..\Kidoju.Widgets\src\js\vendor\highlight .\js\vendor\highlight /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\highlight\*.* /S

REM Copy Markdown-It
REM XCOPY ..\Kidoju.Widgets\src\js\vendor\markdown-it .\js\vendor\markdown-it /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\markdown-it\*.* /S

REM copy logentries
REM XCOPY ..\Kidoju.Server\client\js\vendor\logentries .\js\vendor\logentries /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\logentries\*.* /S

REM copy valve/fingerprintjs
REM XCOPY ..\Kidoju.Server\client\js\vendor\valve .\js\vendor\valve /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\valve\*.* /S

REM Copy Kidoju Widgets
ATTRIB -R .\js\kidoju*.js
ATTRIB -R .\js\window*.js
COPY ..\Kidoju.Widgets\src\js\*.js .\js /Y
ATTRIB +R .\js\kidoju*.js
ATTRIB +R .\js\window*.js

ATTRIB -R .\js\messages\kidoju*.js
COPY ..\Kidoju.Widgets\src\js\messages\kidoju*.js .\js\messages /Y
ATTRIB +R .\js\messages\kidoju*.js

REM Kidoju server client API
ATTRIB -R .\js\app*.js
COPY ..\Kidoju.Server\client\js\app.logger.js .\js /Y
ATTRIB +R .\js\app.logger.js
COPY ..\Kidoju.Server\client\js\app.rapi.js .\js /Y
ATTRIB +R .\js\app.rapi.js
COPY ..\Kidoju.Server\client\js\app.cache.js .\js /Y
ATTRIB +R .\js\app.cache.js
COPY ..\Kidoju.Server\client\js\app.models.js .\js /Y
ATTRIB +R .\js\app.models.js
COPY ..\Kidoju.Server\client\js\app.models.mock.js .\js /Y
ATTRIB +R .\js\app.models.mock.js

REM ------------------------------------------------------------
REM Styles
REM ------------------------------------------------------------

XCOPY ..\Kidoju.WebApp\styles\vendor\kendo\*.* .\styles\vendor\kendo\ /C /E /I /R /Y
ATTRIB +R .\styles\vendor\kendo\*

REM Copy Kidoju webfonts
REM XCOPY ..\Kidoju.WebFonts\dist\fonts\*.* .\styles\fonts\ /C /E /I /R /Y
REM ATTRIB +R .\styles\fonts\*

REM Copy CodeMirror
REM XCOPY ..\Kidoju.Widgets\src\styles\vendor\codemirror .\styles\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\styles\vendor\codemirror\*.* /S

REM Copy Kidoju Widgets
ATTRIB -R .\styles\kidoju*.less
COPY ..\Kidoju.Widgets\src\styles\kidoju*.less .\styles /Y
ATTRIB +R .\styles\kidoju*.less

REM ------------------------------------------------------------
REM Tests
REM ------------------------------------------------------------

REM Copy Vendor files
XCOPY ..\Kidoju.Widgets\test\vendor .\test\vendor /C /E /I /R /Y
ATTRIB +R .\test\vendor\*.* /S

REM ------------------------------------------------------------
REM Web modules (webpack)
REM ------------------------------------------------------------

REM ------------------------------------------------------------
REM Web Application (webapp)
REM ------------------------------------------------------------


