@ECHO ON
CD /d %~dp0

FOR /D %%G in (*) do (
	echo *****************************************************
	echo * %%G
	echo *****************************************************

	REM Goto directory
	CD %%G

    REM Update packages
    CALL npm update

    REM Build for production
	CALL build p

    REM Commit changes
    git add .
    git commit -m "New production build"

    REM Update code on PGB
    curl https://build.phonegap.com/apps/2391592/push



	cd..
)
