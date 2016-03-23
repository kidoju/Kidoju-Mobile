cd /d %~dp0

REM ************************************************************
REM IMPORTANT!
REM Kidoju.Widgets, Kidoju.Server and Kidoju.WebApp are the original project where any modifications
REM of locked read-only files should be completed.
REM ************************************************************

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

REM ------------------------------------------------------------
REM Styles
REM ------------------------------------------------------------

XCOPY ..\Kidoju.WebApp\styles\vendor\kendo\*.* .\styles\vendor\kendo\ /C /E /I /R /Y
ATTRIB +R .\styles\vendor\kendo\*