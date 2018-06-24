set NODE_ENV=mobile
REM without call this batch ends with grunt uglify
call grunt uglify
copy /Y .\js\vendor\jquery\jquery-3.3.1.min.js .\www\build\jquery.min.js
copy /Y .\webapp\public\build\workerlib.bundle.js .\www\build
webpack --watch
