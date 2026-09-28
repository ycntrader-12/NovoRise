@echo off
chcp 65001 >nul
title NovoRise — Start All Services
color 0A

echo.
echo  ================================================
echo            NovoRise - Demarrage complet        
echo     Frontend Public -^>  http://localhost:3005   
echo     Backend API     -^>  http://localhost:3006   
echo     Portail Admin   -^>  http://localhost:3007   
echo  ================================================
echo.

REM [1/5] Nettoyage des anciens processus sur les ports 3005, 3006, 3007
echo [1/5] Liberation des ports 3005, 3006, 3007...
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 3005,3006,3007 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" >nul 2>&1
timeout /t 1 /nobreak >nul

REM [2/5] Configuration des variables d'environnement
echo [2/5] Configuration des fichiers d'environnement...
powershell -Command "(Get-Content 'backend\.env') -replace 'PORT=.*', 'PORT=3006' | Set-Content 'backend\.env'"
powershell -Command "(Get-Content 'backend\.env') -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=http://localhost:3005' | Set-Content 'backend\.env'"

echo    Ports configures : Frontend=3005  Backend=3006  Admin=3007
echo.

REM [3/5] Lancement Backend sur port 3006
echo [3/5] Demarrage du Backend API (port 3006)...
start "NovoRise - Backend :3006" cmd /k "cd /d "%~dp0backend" && set PORT=3006 && npm run dev"
timeout /t 3 /nobreak >nul

REM [4/5] Lancement Frontend Public sur port 3005
echo [4/5] Demarrage du Frontend Public (port 3005)...
start "NovoRise - Frontend :3005" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul

REM [5/5] Lancement Portail Admin sur port 3007
echo [5/5] Demarrage du Portail Admin (port 3007)...
start "NovoRise - Admin Portal :3007" cmd /k "cd /d "%~dp0frontend" && npm run dev:admin"
timeout /t 3 /nobreak >nul

REM Ouverture des navigateurs
echo.
echo  Tous les services sont lances !
echo  - Application Publique : http://localhost:3005
echo  - Portail Admin        : http://localhost:3007
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3005
start http://localhost:3007

echo.
echo  -------------------------------------------------
echo   Fermez cette fenetre principale quand vous voulez.
echo   (Les serveurs continueront de tourner separement)
echo  -------------------------------------------------
echo.
pause
