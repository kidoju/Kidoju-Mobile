cd /d %~dp0

REM ************************************************************
REM IMPORTANT!
REM Memba.Widgets, Memba.Server and Memba.WebApp are the original project where any modifications
REM of locked read-only files should be completed.
REM ************************************************************

REM ------------------------------------------------------------
REM Root files
REM ------------------------------------------------------------

REM copy all dot files except .dockerignore
ATTRIB -R .\.*
COPY ..\Memba.Webapp\.* .\ /Y
DEL .\.dockerignore
ATTRIB +R .\.*

REM build.cmd and BUILD.md
ATTRIB -R .\build.*
COPY ..\Memba.Webapp\build.* .\ /Y
ATTRIB +R .\build.*

REM Coverage
ATTRIB -R .\coverage.conf.cmd
COPY ..\Memba.Widgets\coverage.conf.cmd .\ /Y
ATTRIB +R .\coverage.conf.cmd

REM Dockerfile
REM ATTRIB -R .\Dockerfile
REM COPY ..\Memba.Webapp\Dockerfile .\ /Y
REM ATTRIB +R .\Dockerfile

REM gruntfile.js
REM ATTRIB -R .\gruntfile.js
REM COPY ..\Memba.Webapp\gruntfile.js .\ /Y
REM ATTRIB +R .\gruntfile.js

REM kidoju.server.cmd
REM ATTRIB -R .\kidoju.server.cmd
REM COPY ..\Memba.Webapp\kidoju.server.cmd .\ /Y
REM ATTRIB +R .\kidoju.server.cmd

REM LICENSE
REM ATTRIB -R .\LICENSE-GPLv3
REM COPY ..\Memba.Webapp\LICENSE-GPLv3 .\ /Y
REM ATTRIB +R .\LICENSE-GPLv3

REM postcss.config.js
ATTRIB -R .\postcss.config.js
COPY ..\Memba.Webapp\postcss.config.js .\ /Y
ATTRIB +R .\postcss.config.js

REM setup.cmd
ATTRIB -R .\setup.cmd
COPY ..\Memba.Webapp\setup.cmd .\ /Y
ATTRIB +R .\setup.cmd

REM UPDATE.md
ATTRIB -R .\UPDATE.md
COPY ..\Memba.Webapp\UPDATE.md .\ /Y
ATTRIB +R .\UPDATE.md

REM watch.cmd
REM ATTRIB -R .\watch.cmd
REM COPY ..\Memba.Webapp\watch.cmd .\ /Y
REM ATTRIB +R .\watch.cmd

REM webpack
REM ATTRIB -R .\webpack.config.js
REM COPY ..\Memba.Webapp\webpack.config.js .\ /Y
REM ATTRIB +R .\webpack.config.js

REM selenium
REM ATTRIB -R .\wdio.conf.js
REM COPY ..\Memba.Webapp\wdio.conf.js .\ /Y
REM ATTRIB +R .\wdio.conf.js

REM ------------------------------------------------------------
REM Graphics
REM ------------------------------------------------------------

REM ------------------------------------------------------------
REM Javascript files
REM ------------------------------------------------------------

REM Copy ./src/js/.eslintrc
ATTRIB -R .\src\js\.eslintrc
COPY ..\Memba.WebApp\src\js\.eslintrc .\src\js /Y
ATTRIB +R .\src\js\.eslintrc

REM Copy ./src/js/.jshintrc
ATTRIB -R .\src\js\.jshintrc
COPY ..\Memba.WebApp\src\js\.jshintrc .\src\js /Y
ATTRIB +R .\src\js\.jshintrc

REM BEGIN TODO Review --------------------------------------------------

REM ./src/js/*
ATTRIB -R .\src\js\*.js
COPY ..\Memba.WebApp\src\js\app.assets.js .\src\js /Y
ATTRIB +R .\src\js\app.assets.js
COPY ..\Memba.Server\src\js\app.cache.js .\src\js /Y
ATTRIB +R .\src\js\app.cache.js
COPY ..\Memba.Server\src\js\app.models.js .\src\js /Y
ATTRIB +R .\src\js\app.models.js
COPY ..\Memba.Server\src\js\app.models.mock.js .\src\js /Y
ATTRIB +R .\src\js\app.models.mock.js
COPY ..\Memba.Server\src\js\app.rapi.js .\src\js /Y
ATTRIB +R .\src\js\app.rapi.js
COPY ..\Memba.Server\src\js\app.rapi.mock.js .\src\js /Y
ATTRIB +R .\src\js\app.rapi.mock.js
COPY ..\Memba.WebApp\src\js\app.utils.js .\src\js /Y
ATTRIB +R .\src\js\app.utils.js
COPY ..\Memba.WebApp\src\js\kidoju.data.js .\src\js /Y
ATTRIB +R .\src\js\kidoju.data.js
COPY ..\Memba.WebApp\src\js\kidoju.data.workerlib.js .\src\js /Y
ATTRIB +R .\src\js\kidoju.data.workerlib.js
COPY ..\Memba.WebApp\src\js\kidoju.image.js .\src\js /Y
ATTRIB +R .\src\js\kidoju.image.js
COPY ..\Memba.WebApp\src\js\kidoju.tools.js .\src\js /Y
ATTRIB +R .\src\js\kidoju.tools.js
COPY ..\Memba.WebApp\src\js\kidoju.util.js .\src\js /Y
ATTRIB +R .\src\js\kidoju.util.js

REM END TODO Review --------------------------------------------------

REM ./src/js/app/config,jsx
ATTRIB -R .\src\js\app\app.config.jsx
COPY ..\Memba.WebApp\src\js\app\app.config.jsx .\src\js\app /Y
ATTRIB +R .\src\js\app\app.config.jsx

REM Copy ./src/js/app/*
ATTRIB -R .\src\js\app\*.es6
COPY ..\Memba.WebApp\src\js\app\app.assets.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.assets.es6
COPY ..\Memba.WebApp\src\js\app\app.db.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.db.es6
COPY ..\Memba.WebApp\src\js\app\app.i18n.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.i18n.es6
COPY ..\Memba.WebApp\src\js\app\app.logger.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.logger.es6
COPY ..\Memba.WebApp\src\js\app\app.network.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.network.es6
COPY ..\Memba.WebApp\src\js\app\app.notification.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.notification.es6
COPY ..\Memba.WebApp\src\js\app\app.partitions.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.partitions.es6
COPY ..\Memba.WebApp\src\js\app\app.themer.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.themer.es6
COPY ..\Memba.WebApp\src\js\app\app.uris.es6 .\src\js\app /Y
ATTRIB +R .\src\js\app\app.uris.es6

REM Copy .\src\js\common\*
ATTRIB -R .\src\js\common\*.es6
COPY ..\Memba.Widgets\src\js\common\jquery.*.es6 .\src\js\common /Y
COPY ..\Memba.Widgets\src\js\common\window.*.es6 .\src\js\common /Y
COPY ..\Memba.Server\src\js\common\pongodb.*.es6 .\src\js\common /Y
ATTRIB +R .\src\js\common\*.es6

REM Copy .\src\js\cultures\*
ATTRIB -R .\src\js\cultures\*.es6
COPY ..\Memba.Widgets\src\js\messages\widgets.*.es6 .\src\js\messages /Y
ATTRIB +R .\src\js\messages\widgets.*.es6

REM Copy .\src\js\data\*
ATTRIB -R .\src\js\data\*.es6
COPY ..\Memba.Widgets\src\js\data\*.es6 .\src\js\data /Y
COPY ..\Memba.Server\src\js\data\*.es6 .\src\js\data /Y
ATTRIB +R .\src\js\data\*.es6

REM Copy .\src\js\dialogs\*
ATTRIB -R .\src\js\dialogs\*.es6
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.alert.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.assetmanager.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.chargrid.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.codeeditor.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.property.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.spreadsheet.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\dialogs.styleeditor.es6 .\src\js\dialogs /Y
COPY ..\Memba.Widgets\src\js\dialogs\widgets.basedialog.es6 .\src\js\dialogs /Y
ATTRIB +R .\src\js\dialogs\*.es6

REM Copy .\src\js\data\*
ATTRIB -R .\src\js\editors\*.es6
COPY ..\Memba.Widgets\src\js\editors\*.es6 .\src\js\editors /Y
ATTRIB +R .\src\js\editors\*.es6

REM Copy .\src\js\rapi\*
ATTRIB -R .\src\js\rapi\*.es6
COPY ..\Memba.Server\src\js\rapi\*.es6 .\src\js\rapi /Y
ATTRIB +R .\src\js\rapi\*.es6

REM Copy .\src\js\tools\*
ATTRIB -R .\src\js\tools\*.es6
COPY ..\Memba.Widgets\src\js\tools\*.es6 .\src\js\tools /Y
ATTRIB +R .\src\js\tools\*.es6

REM Copy .\src\js\vendor\*
XCOPY ..\Memba.Widgets\src\js\vendor\arnog .\src\js\vendor\arnog /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\arnog\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\blueimp .\src\js\vendor\blueimp /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\blueimp\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\codemirror .\src\js\vendor\codemirror /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\codemirror\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\highlight .\src\js\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\highlight\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\jashkenas .\src\js\vendor\jashkenas /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\jashkenas\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\josdejong .\src\js\vendor\josdejong /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\josdejong\*.*
XCOPY ..\Memba.Widgets\src\js\vendor\jquery .\src\js\vendor\jquery /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\jquery\*.*
XCOPY ..\Memba.Widgets\src\js\vendor\kendo .\src\js\vendor\kendo /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\kendo\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\khan .\src\js\vendor\khan /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\khan\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\localforage .\src\js\vendor\localforage\ /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\localforage\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\markdown-it .\src\js\vendor\markdown-it /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\markdown-it\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\mathquill .\src\js\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\mathquill\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\nodeca .\src\js\vendor\nodeca /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\nodeca\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\pieroxy .\src\js\vendor\pieroxy /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\pieroxy\*.* /S
XCOPY ..\Memba.Widgets\src\js\vendor\valve .\src\js\vendor\valve /C /E /I /R /Y
ATTRIB +R .\src\js\vendor\valve\*.* /S

REM Copy .\src\js\widgets\*
ATTRIB -R .\src\js\widgets\*.es6
COPY ..\Memba.Widgets\src\js\widgets\*.es6 .\src\js\widgets /Y
ATTRIB +R .\src\js\widgets\*.es6

REM Copy .\src\js\workers\*
ATTRIB -R .\src\js\workers\*.*
COPY ..\Memba.Widgets\src\js\workers\*.* .\src\js\workers /Y
ATTRIB +R .\src\js\workers\*.*

REM ------------------------------------------------------------
REM Styles
REM ------------------------------------------------------------

REM Copy ./src/styles/dependencies/*
XCOPY ..\Memba.Widgets\src\styles\dependencies\*.scss .\src\styles\dependencies /C /E /I /R /Y
ATTRIB +R .\src\styles\dependencies\*.scss /S

REM Copy ./src/styles/dialogs/*
XCOPY ..\Memba.Widgets\src\styles\dialogs\*.scss .\src\styles\dialogs /C /E /I /R /Y
ATTRIB +R .\src\styles\dialogs\*.scss /S

REM Copy ./src/styles/fonts/*
XCOPY ..\Memba.WebFonts\dist\fonts\*.* .\src\styles\fonts /C /E /I /R /Y
ATTRIB +R .\src\styles\fonts\*.* /S

REM Copy ./src/styles/images/* --> What for? ????????????????????????????
ATTRIB -R .\src\styles\images\*.png
COPY ..\Memba.WebApp\src\styles\images\handler.png .\src\styles\images\handler.png /Y
ATTRIB +R .\src\styles\images\*.png

REM Copy ./src/styles/themes/*
REM

REM Copy ./src/styles/vendor/*
XCOPY ..\Memba.Widgets\src\styles\vendor\arnog .\src\styles\vendor\arnog /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\arnog\*.* /S
XCOPY ..\Memba.Widgets\src\styles\vendor\codemirror .\src\styles\vendor\codemirror /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\codemirror\*.* /S
XCOPY ..\Memba.Widgets\src\styles\vendor\highlight .\src\styles\vendor\highlight /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\highlight\*.* /S
XCOPY ..\Memba.Widgets\src\styles\vendor\kendo .\src\styles\vendor\kendo /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\kendo\*.* /S
XCOPY ..\Memba.Widgets\src\styles\vendor\khan .\src\styles\vendor\khan /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\khan\*.* /S
XCOPY ..\Memba.Widgets\src\styles\vendor\mathquill .\src\styles\vendor\mathquill /C /E /I /R /Y
ATTRIB +R .\src\styles\vendor\mathquill\*.* /S

REM Copy ./src/styles/widgets/*
XCOPY ..\Memba.Widgets\src\styles\widgets\*.less .\src\styles\widgets /C /E /I /R /Y
XCOPY ..\Memba.Widgets\src\styles\widgets\*.scss .\src\styles\widgets /C /E /I /R /Y
ATTRIB +R .\src\styles\widgets\*.* /S

REM ------------------------------------------------------------
REM Tests
REM ------------------------------------------------------------

REM Copy ./test/browser files
REM ATTRIB -R .\test\browser\*
REM COPY ..\Memba.Webapp\test\browser\* .\test\browser /Y
REM ATTRIB +R .\test\browser\*

REM Copy ./test/selenium/_misc files
ATTRIB -R .\test\selenium\_misc\selenium.util.es6
COPY ..\Memba.Webapp\test\selenium\_misc\selenium.util.es6 .\test\selenium\_misc /Y
ATTRIB +R .\test\selenium\_misc\selenium.util.es6

REM Copy Vendor files
XCOPY ..\Memba.Widgets\test\vendor .\test\vendor /C /E /I /R /Y
ATTRIB +R .\test\vendor\*.* /S

REM ------------------------------------------------------------
REM Web modules (webpack)
REM ------------------------------------------------------------
XCOPY ..\Memba.WebApp\web_modules .\web_modules /C /E /I /R /Y
ATTRIB +R .\web_modules\*.* /S

REM Copy http.server
XCOPY ..\Memba.Widgets\nodejs\http.server.js .\nodejs /C /E /I /R /Y
ATTRIB +R .\nodejs\http.server.js /S

REM ------------------------------------------------------------
REM Web Application (webapp)
REM ------------------------------------------------------------

REM ./webapp/config
ATTRIB -R .\webapp\config\*.*
XCOPY ..\Memba.WebApp\webapp\config .\webapp\config /C /E /I /R /Y
ATTRIB +R .\webapp\config\*.*

REM ./webapp/locales
ATTRIB -R .\webapp\locales\*.*
XCOPY ..\Memba.WebApp\webapp\locales .\webapp\locales /C /E /I /R /Y
ATTRIB +R .\webapp\locales\*.*

REM TODO favicon.ico
