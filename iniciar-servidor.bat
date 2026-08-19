@echo off
REM Inicia o servidor local da landing e abre no navegador.
REM Basta dar dois cliques neste arquivo.
cd /d "%~dp0"

set "PY="
where py >nul 2>&1 && set "PY=py"
if not defined PY (where python >nul 2>&1 && set "PY=python")
if not defined PY (if exist "C:\Python314\python.exe" set "PY=C:\Python314\python.exe")

if not defined PY (
  echo.
  echo Python nao encontrado. Instale em https://www.python.org/downloads/
  echo e marque "Add Python to PATH" durante a instalacao.
  echo.
  pause
  exit /b 1
)

echo.
echo   Landing Nathalia Siqueira
echo   http://localhost:5173
echo.
echo   Deixe esta janela aberta enquanto estiver usando o site.
echo   Para parar, feche a janela ou aperte Ctrl+C.
echo.

start "" http://localhost:5173
"%PY%" server.py
pause
