@echo off
rem LUMAN OS v2 launcher for Windows.
rem Double-click this file to open the interactive menu, or run `luman home`
rem (etc.) from Command Prompt / PowerShell.
setlocal
set "HERE=%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py "%HERE%luman.py" %*
) else (
  python "%HERE%luman.py" %*
)
rem When double-clicked with no arguments, keep the window open afterward.
if "%~1"=="" pause
endlocal
