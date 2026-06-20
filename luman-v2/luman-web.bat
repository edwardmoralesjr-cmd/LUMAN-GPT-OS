@echo off
rem LUMAN OS v2 web launcher for Windows.
rem Double-click to start the local server and open LUMAN in your browser.
setlocal
set "HERE=%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py "%HERE%web\server.py" %*
) else (
  python "%HERE%web\server.py" %*
)
pause
endlocal
