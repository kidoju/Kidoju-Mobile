FOR /D %%G in (*) do (
	echo *****************************************************
	echo * %%G
	echo *****************************************************
	cd %%G

	// TODO increment version number

	build p

	// TODO do some git stuff

	cd..
)
