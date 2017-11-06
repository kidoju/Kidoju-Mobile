cd /d %~dp0

REM ************************************************************
REM IMPORTANT!
REM Kidoju.Widgets, Kidoju.Server and Kidoju.WebApp are the original project where any modifications
REM of locked read-only files should be completed.
REM ************************************************************

REM ------------------------------------------------------------
REM Root files
REM ------------------------------------------------------------

REM copy all dot files except .dockerignore
ATTRIB -R .\.*
COPY ..\Kidoju.Webapp\.* .\ /Y
DEL .\.dockerignore
ATTRIB +R .\.*

REM build.cmd and BUILD.md
ATTRIB -R .\build.*
COPY ..\Kidoju.Webapp\build.* .\ /Y
ATTRIB +R .\build.*

REM Coverage
ATTRIB -R .\coverage.conf.cmd
COPY ..\Kidoju.Widgets\coverage.conf.cmd .\ /Y
ATTRIB +R .\coverage.conf.cmd

REM Dockerfile
REM ATTRIB -R .\Dockerfile
REM COPY ..\Kidoju.Webapp\Dockerfile .\ /Y
REM ATTRIB +R .\Dockerfile

REM gruntfile.js
REM ATTRIB -R .\gruntfile.js
REM COPY ..\Kidoju.Webapp\gruntfile.js .\ /Y
REM ATTRIB +R .\gruntfile.js

REM kidoju.server.cmd
REM ATTRIB -R .\kidoju.server.cmd
REM COPY ..\Kidoju.Webapp\kidoju.server.cmd .\ /Y
REM ATTRIB +R .\kidoju.server.cmd

REM LICENSE
REM ATTRIB -R .\LICENSE-GPLv3
REM COPY ..\Kidoju.Webapp\LICENSE-GPLv3 .\ /Y
REM ATTRIB +R .\LICENSE-GPLv3

REM postcss.config.js
ATTRIB -R .\postcss.config.js
COPY ..\Kidoju.Webapp\postcss.config.js .\ /Y
ATTRIB +R .\postcss.config.js

REM setup.cmd
ATTRIB -R .\setup.cmd
COPY ..\Kidoju.Webapp\setup.cmd .\ /Y
ATTRIB +R .\setup.cmd

REM UPDATE.md
ATTRIB -R .\UPDATE.md
COPY ..\Kidoju.Webapp\UPDATE.md .\ /Y
ATTRIB +R .\UPDATE.md

REM watch.cmd
REM ATTRIB -R .\watch.cmd
REM COPY ..\Kidoju.Webapp\watch.cmd .\ /Y
REM ATTRIB +R .\watch.cmd

REM webpack
REM ATTRIB -R .\webpack.config.js
REM COPY ..\Kidoju.Webapp\webpack.config.js .\ /Y
REM ATTRIB +R .\webpack.config.js

REM selenium
REM ATTRIB -R .\wdio.conf.js
REM COPY ..\Kidoju.Webapp\wdio.conf.js .\ /Y
REM ATTRIB +R .\wdio.conf.js

REM ------------------------------------------------------------
REM Graphics
REM ------------------------------------------------------------

REM ------------------------------------------------------------
REM Javascript files
REM ------------------------------------------------------------

REM Copy Kendo UI
XCOPY ..\Kidoju.WebApp\js\vendor\kendo\*.* .\js\vendor\kendo\ /C /E /I /R /Y
ATTRIB +R .\js\vendor\kendo\*.* /S

REM Copy localForage
XCOPY ..\Kidoju.Widgets\test\vendor\localforage*.* .\js\vendor\localForage\ /C /E /I /R /Y
ATTRIB +R .\js\vendor\localForage\*.* /S

REM copy blueimp/md5
XCOPY ..\Kidoju.Server\client\js\vendor\blueimp .\js\vendor\blueimp /C /E /I /R /Y
ATTRIB +R .\js\vendor\blueimp\*.* /S

REM Copy CodeMirror
REM XCOPY ..\Kidoju.Widgets\src\js\vendor\codemirror .\js\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\js\vendor\codemirror\*.* /S

REM Copy HighlightJS
XCOPY ..\Kidoju.Widgets\src\js\vendor\highlight .\js\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\js\vendor\highlight\*.* /S

REM Copy jQuery
XCOPY ..\Kidoju.Widgets\src\js\vendor\jquery .\js\vendor\jquery /C /E /I /R /Y
ATTRIB +R .\js\vendor\jquery\*.* /S

REM copy KateX
XCOPY ..\Kidoju.Widgets\src\js\vendor\katex .\js\vendor\katex /C /E /I /R /Y
ATTRIB +R .\js\vendor\katex\*.* /S

REM Copy Markdown-It
XCOPY ..\Kidoju.Widgets\src\js\vendor\markdown-it .\js\vendor\markdown-it /C /E /I /R /Y
ATTRIB +R .\js\vendor\markdown-it\*.* /S

REM copy MathQUill
XCOPY ..\Kidoju.Widgets\src\js\vendor\mathquill .\js\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\js\vendor\mathquill\*.* /S

REM copy valve/fingerprintjs
XCOPY ..\Kidoju.Server\client\js\vendor\valve .\js\vendor\valve /C /E /I /R /Y
ATTRIB +R .\js\vendor\valve\*.* /S

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
COPY ..\Kidoju.Server\client\js\app.rapi.mock.js .\js /Y
ATTRIB +R .\js\app.rapi.mock.js
COPY ..\Kidoju.Server\client\js\app.cache.js .\js /Y
ATTRIB +R .\js\app.cache.js
COPY ..\Kidoju.Server\client\js\app.models.js .\js /Y
ATTRIB +R .\js\app.models.js
COPY ..\Kidoju.Server\client\js\app.models.mock.js .\js /Y
ATTRIB +R .\js\app.models.mock.js

REM Kidoju webapp client API
COPY ..\Kidoju.WebApp\js\app.tts.js .\js /Y
ATTRIB +R .\js\app.tts.js

REM Copy .jshintrc
ATTRIB -R .\js\.jshintrc
COPY ..\Kidoju.WebApp\js\.jshintrc .\js /Y
ATTRIB +R .\js\.jshintrc

REM ------------------------------------------------------------
REM Styles
REM ------------------------------------------------------------

XCOPY ..\Kidoju.WebApp\styles\vendor\kendo\*.* .\styles\vendor\kendo\ /C /E /I /R /Y
ATTRIB +R .\styles\vendor\kendo\*.* /S

REM Copy Kidoju webfonts
XCOPY ..\Kidoju.WebFonts\dist\fonts\*.* .\styles\fonts\ /C /E /I /R /Y
ATTRIB +R .\styles\fonts\*.* /S

REM Copy CodeMirror - Not used in mobile app
REM XCOPY ..\Kidoju.Widgets\src\styles\vendor\codemirror .\styles\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\styles\vendor\codemirror\*.* /S

REM Copy KaTex
XCOPY ..\Kidoju.Widgets\src\styles\vendor\katex .\styles\vendor\katex /C /E /I /R /Y
ATTRIB +R .\styles\vendor\katex\*.* /S

REM Copy HighlightJS
XCOPY ..\Kidoju.Widgets\src\styles\vendor\highlight .\styles\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\styles\vendor\highlight\*.* /S
ATTRIB -R .\styles\highlightjs.custom.less
COPY ..\Kidoju.WebApp\styles\highlightjs.custom.less .\styles /Y
ATTRIB +R .\styles\highlightjs.custom.less

REM Copy MathQuill
XCOPY ..\Kidoju.Widgets\src\styles\vendor\mathquill .\styles\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\styles\vendor\mathquill\*.* /S

REM Copy Kidoju Widgets
ATTRIB -R .\styles\kidoju*.less
COPY ..\Kidoju.Widgets\src\styles\kidoju*.less .\styles /Y
ATTRIB +R .\styles\kidoju*.less


REM ------------------------------------------------------------
REM Images
REM ------------------------------------------------------------

REM Copy Kidoju Widgets
ATTRIB -R .\styles\images\*.png
COPY ..\Kidoju.WebApp\src\styles\images\handler.png .\styles\images\handler.png /Y
ATTRIB +R .\styles\images\*.png

REM ------------------------------------------------------------
REM Tests
REM ------------------------------------------------------------

REM Copy ./test/browser files
ATTRIB -R .\test\browser\app.tts.*
COPY ..\Kidoju.Webapp\test\browser\app.tts.* .\test\browser /Y
ATTRIB +R .\test\browser\app.tts.*

REM Copy ./test/selenium files
ATTRIB -R .\test\selenium\selenium.js
COPY ..\Kidoju.Webapp\test\selenium\selenium.js .\test\selenium /Y
ATTRIB +R .\test\selenium\selenium.js

REM Copy Vendor files
XCOPY ..\Kidoju.Widgets\test\vendor .\test\vendor /C /E /I /R /Y
ATTRIB +R .\test\vendor\*.* /S

REM ------------------------------------------------------------
REM Web modules (webpack)
REM ------------------------------------------------------------
XCOPY ..\Kidoju.WebApp\web_modules .\web_modules /C /E /I /R /Y
ATTRIB +R .\web_modules\*.* /S

REM Copy http.server
XCOPY ..\Kidoju.Widgets\nodejs .\nodejs /C /E /I /R /Y
ATTRIB +R .\nodejs\*.* /S

REM ------------------------------------------------------------
REM Web Application (webapp)
REM ------------------------------------------------------------

REM ./js/app.assets.js
ATTRIB -R .\js\app.assets.js
COPY ..\Kidoju.WebApp\js\app.assets.js .\js /Y
ATTRIB +R .\js\app.assets.js

REM ./js/config,jsx
ATTRIB -R .\js\app*.jsx
COPY ..\Kidoju.WebApp\js\app.config.jsx .\js /Y
ATTRIB +R .\js\app.config.jsx

REM ./js/app.i18n
ATTRIB -R .\js\app.i18n.js
COPY ..\Kidoju.WebApp\js\app.i18n.js .\js /Y
ATTRIB +R .\js\app.i18n.js

REM ./js/app.theme
ATTRIB -R .\js\app.theme.js
COPY ..\Kidoju.WebApp\js\app.theme.js .\js /Y
ATTRIB +R .\js\app.theme.js

REM ./js/app.utils
ATTRIB -R .\js\app.utils.js
COPY ..\Kidoju.WebApp\js\app.utils.js .\js /Y
ATTRIB +R .\js\app.utils.js

REM ./webapp/config
REM ATTRIB -R .\webapp\config\*.*
REM XCOPY ..\Kidoju.WebApp\webapp\config .\webapp\config /C /E /I /R /Y
REM ATTRIB +R .\webapp\config\*.*
ATTRIB -R .\webapp\config\default.json
COPY ..\Kidoju.WebApp\webapp\config\default.json .\webapp\config /Y
ATTRIB +R .\webapp\config\default.json

ATTRIB -R .\webapp\config\index.js
COPY ..\Kidoju.WebApp\webapp\config\index.js .\webapp\config /Y
ATTRIB +R .\webapp\config\index.js
