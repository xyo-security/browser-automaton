@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set EXTENSION_PATH=.
pushd ".."
set EXTENSION_PATH=%CD%
popd

set EXTENSION_URL="http://localhost/browser-automaton/browser-automaton.php?extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3";

pushd "C:\Program Files\Google\Chrome\Application"
start chrome --disable-extensions-file-access-check --no-pings --disable-background-mode --load-extension="%EXTENSION_PATH%\source\chrome" --no-first-run --homepage "%EXTENSION_URL%";
popd

