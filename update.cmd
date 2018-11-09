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
XCOPY ..\Kidoju.Widgets\src\js\vendor\kendo .\src\js\vendor\kendo /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\kendo\*.* /S

REM Copy localForage
XCOPY ..\Kidoju.Widgets\src\js\vendor\localforage .\src\js\vendor\localforage\ /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\localforage\*.* /S

REM copy blueimp/md5
XCOPY ..\Kidoju.Server\client\js\vendor\blueimp .\src\js\vendor\blueimp /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\blueimp\*.* /S

REM Copy CodeMirror
REM XCOPY ..\Kidoju.Widgets\src\js\vendor\codemirror .\src\js\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\src\js\vendor\codemirror\*.* /S

REM Copy HighlightJS
XCOPY ..\Kidoju.Widgets\src\js\vendor\highlight .\src\js\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\highlight\*.* /S

REM Copy Underscore
XCOPY ..\Kidoju.Widgets\src\js\vendor\jashkenas .\src\js\vendor\jashkenas /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\jashkenas\*.* /S

REM Copy jQuery
XCOPY ..\Kidoju.Widgets\src\js\vendor\jquery .\src\js\vendor\jquery /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\jquery\*.* /S

REM copy KateX
XCOPY ..\Kidoju.Widgets\src\js\vendor\khan .\src\js\vendor\khan /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\khan\*.* /S

REM Copy Markdown-It
XCOPY ..\Kidoju.Widgets\src\js\vendor\markdown-it .\src\js\vendor\markdown-it /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\markdown-it\*.* /S

REM copy MathQuill
XCOPY ..\Kidoju.Widgets\src\js\vendor\mathquill .\src\js\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\mathquill\*.* /S

REM copy Pako
XCOPY ..\Kidoju.Widgets\src\js\vendor\nodeca .\src\js\vendor\nodeca /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\nodeca\*.* /S

REM copy valve/fingerprintjs
XCOPY ..\Kidoju.Server\client\js\vendor\valve .\src\js\vendor\valve /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\valve\*.* /S

REM Copy Kidoju Widgets
ATTRIB -R .\src\js\kidoju*.js
ATTRIB -R .\src\js\window*.js
ATTRIB -R .\src\js\window*.es6
COPY ..\Kidoju.Widgets\src\js\*.es6 .\src\js /Y
COPY ..\Kidoju.Widgets\src\js\*.js .\src\js /Y
ATTRIB +R .\src\js\kidoju*.js
ATTRIB +R .\src\js\window*.js
ATTRIB +R .\src\js\window*.es6
ATTRIB -R .\src\js\window.pongodb.js

REM Kidoju server client API
ATTRIB -R .\src\js\app*.js
COPY ..\Kidoju.Server\client\js\app.logger.js .\src\js /Y
ATTRIB +R .\src\js\app.logger.js
COPY ..\Kidoju.Server\client\js\app.rapi.js .\src\js /Y
ATTRIB +R .\src\js\app.rapi.js
COPY ..\Kidoju.Server\client\js\app.rapi.mock.js .\src\js /Y
ATTRIB +R .\src\js\app.rapi.mock.js
COPY ..\Kidoju.Server\client\js\app.cache.js .\src\js /Y
ATTRIB +R .\src\js\app.cache.js
COPY ..\Kidoju.Server\client\js\app.models.js .\src\js /Y
ATTRIB +R .\src\js\app.models.js
COPY ..\Kidoju.Server\client\js\app.models.mock.js .\src\js /Y
ATTRIB +R .\src\js\app.models.mock.js

REM Copy .\src\js\app\*
REM ATTRIB -R .\src\js\app\*.es6
REM COPY ..\Kidoju.WebApp\src\js\app\*.es6 .\src\js\app /Y
REM ATTRIB +R .\src\js\app\*.es6

REM Copy .\src\js\common\*
ATTRIB -R .\src\js\common\*.es6
COPY ..\Kidoju.Widgets\src\js\common\*.es6 .\src\js\common /Y
ATTRIB +R .\src\js\common\*.es6

REM Copy .\src\js\cultures\*
ATTRIB -R .\src\js\cultures\*.es6
COPY ..\Kidoju.Widgets\src\js\messages\widgets.*.es6 .\src\js\messages /Y
ATTRIB +R .\src\js\messages\widgets.*.es6

REM Copy .\src\js\data\*
ATTRIB -R .\src\js\data\*.es6
COPY ..\Kidoju.Widgets\src\js\data\*.es6 .\src\js\data /Y
COPY ..\Kidoju.Server\src\js\data\*.es6 .\src\js\data /Y
ATTRIB +R .\src\js\data\*.es6

REM Copy .\src\js\dialogs\*
ATTRIB -R .\src\js\dialogs\*.es6
COPY ..\Kidoju.Widgets\src\js\dialogs\dialogs.alert.es6 .\src\js\dialogs /Y
COPY ..\Kidoju.Widgets\src\js\dialogs\dialogs.assetmanager.es6 .\src\js\dialogs /Y
COPY ..\Kidoju.Widgets\src\js\dialogs\widgets.basedialog.es6 .\src\js\dialogs /Y
ATTRIB +R .\src\js\dialogs\*.es6

REM Copy .\src\js\rapi\*
ATTRIB -R .\src\js\rapi\*.es6
COPY ..\Kidoju.Server\src\js\rapi\*.es6 .\src\js\rapi /Y
ATTRIB +R .\src\js\rapi\*.es6

REM Copy .\src\js\common\*
ATTRIB -R .\src\js\common\*.es6
COPY ..\Kidoju.Widgets\src\js\common\*.es6 .\src\js\common /Y
ATTRIB +R .\src\js\common\*.es6

REM Copy .\src\js\tools\*
ATTRIB -R .\src\js\tools\*.es6
COPY ..\Kidoju.Widgets\src\js\tools\*.es6 .\src\js\tools /Y
ATTRIB +R .\src\js\tools\*.es6

REM Copy .\src\js\widgets\*
ATTRIB -R .\src\js\widgets\*.es6
COPY ..\Kidoju.Widgets\src\js\widgets\*.es6 .\src\js\widgets /Y
ATTRIB +R .\src\js\widgets\*.es6

REM Copy .jshintrc
ATTRIB -R .\src\js\.jshintrc
COPY ..\Kidoju.WebApp\js\.jshintrc .\src\js /Y
ATTRIB +R .\src\js\.jshintrc

REM ------------------------------------------------------------
REM Styles
REM ------------------------------------------------------------

XCOPY ..\Kidoju.Widgets\src\styles\vendor\kendo .\src\styles\vendor\kendo /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\kendo\*.* /S

REM Copy Kidoju webfonts
XCOPY ..\Kidoju.WebFonts\dist\fonts\*.* .\src\styles\fonts\ /C /E /I /R /Y
ATTRIB +R .\src\styles\fonts\*.* /S

REM Copy CodeMirror - Not used in mobile app
REM XCOPY ..\Kidoju.Widgets\src\styles\vendor\codemirror .\src\styles\vendor\codemirror /C /E /I /R /Y
REM ATTRIB +R .\src\styles\vendor\codemirror\*.* /S

REM Copy KaTex
XCOPY ..\Kidoju.Widgets\src\styles\vendor\khan .\src\styles\vendor\khan /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\khan\*.* /S

REM Copy HighlightJS
XCOPY ..\Kidoju.Widgets\src\styles\vendor\highlight .\src\styles\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\highlight\*.* /S
ATTRIB -R .\src\styles\highlightjs.custom.less
COPY ..\Kidoju.WebApp\styles\highlightjs.custom.less .\src\styles /Y
ATTRIB +R .\src\styles\highlightjs.custom.less

REM Copy MathQuill
XCOPY ..\Kidoju.Widgets\src\styles\vendor\mathquill .\src\styles\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\mathquill\*.* /S

REM Copy Kidoju Widgets
ATTRIB -R .\src\styles\kidoju*.less
COPY ..\Kidoju.Widgets\src\styles\kidoju*.less .\src\styles /Y
ATTRIB +R .\src\styles\kidoju*.less

ATTRIB -R .\src\styles\dialogs\*.less
COPY ..\Kidoju.Widgets\src\styles\dialogs\*.less .\src\styles\dialogs /Y
ATTRIB +R .\src\styles\dialogs\*.less


REM ------------------------------------------------------------
REM Images
REM ------------------------------------------------------------

REM Copy Kidoju Widgets
ATTRIB -R .\src\styles\images\*.png
COPY ..\Kidoju.WebApp\src\styles\images\handler.png .\src\styles\images\handler.png /Y
ATTRIB +R .\src\styles\images\*.png

REM ------------------------------------------------------------
REM Tests
REM ------------------------------------------------------------

REM Copy ./test/browser files
REM ATTRIB -R .\test\browser\*
REM COPY ..\Kidoju.Webapp\test\browser\* .\test\browser /Y
REM ATTRIB +R .\test\browser\*

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
ATTRIB -R .\src\js\app.assets.js
COPY ..\Kidoju.WebApp\js\app.assets.js .\src\js /Y
ATTRIB +R .\src\js\app.assets.js

REM ./js/config,jsx
ATTRIB -R .\src\js\app*.jsx
COPY ..\Kidoju.WebApp\js\app.config.jsx .\src\js /Y
ATTRIB +R .\src\js\app.config.jsx

REM ./js/app.i18n
ATTRIB -R .\src\js\app.i18n.js
COPY ..\Kidoju.WebApp\js\app.i18n.js .\src\js /Y
ATTRIB +R .\src\js\app.i18n.js

REM ./js/app.theme
ATTRIB -R .\src\js\app.theme.js
COPY ..\Kidoju.WebApp\js\app.theme.js .\src\js /Y
ATTRIB +R .\src\js\app.theme.js

REM ./js/app.utils
ATTRIB -R .\src\js\app.utils.js
COPY ..\Kidoju.WebApp\js\app.utils.js .\src\js /Y
ATTRIB +R .\src\js\app.utils.js

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
