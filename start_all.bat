@echo off
title NovoRise — Start All Services
color 0A

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          NovoRise — Démarrage complet        ║
echo  ║   Frontend Public →  http://localhost:3005   ║
echo  ║   Backend API     →  http://localhost:3006   ║
echo  ║   Portail Admin   →  http://localhost:3007   ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ─── Nettoyage des anciens processus sur les ports 3005, 3006, 3007 ──────────
echo [1/5] Libération des ports 3005, 3006, 3007...
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 3005,3006,3007 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" >nul 2>&1
timeout /t 1 /nobreak >nul

:: ─── Mise à jour des ports dans .env ─────────────────────────────────────────
echo [2/5] Configuration des fichiers d'environnement...

:: Remplacer le port du backend dans .env
powershell -Command "(Get-Content 'backend\.env') -replace 'PORT=.*', 'PORT=3006' | Set-Content 'backend\.env'"

:: Remplacer FRONTEND_URL dans .env
powershell -Command "(Get-Content 'backend\.env') -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=http://localhost:3005' | Set-Content 'backend\.env'"

echo    Ports configurés : Frontend=3005  Backend=3006  Admin=3007
echo.

:: ─── Lancement Backend sur port 3006 ─────────────────────────────────────────
echo [3/5] Démarrage du Backend API (port 3006)...
start "NovoRise — Backend :3006" cmd /k "cd /d "%~dp0backend" && set PORT=3006 && npm run dev"
timeout /t 3 /nobreak >nul

:: ─── Lancement Frontend Public sur port 3005 ─────────────────────────────────
echo [4/5] Démarrage du Frontend Public (port 3005)...
start "NovoRise — Frontend :3005" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 3 /nobreak >nul

:: ─── Lancement Portail Admin sur port 3007 ────────────────────────────────────
echo [5/5] Démarrage du Portail Admin (port 3007)...
start "NovoRise — Admin Portal :3007" cmd /k "cd /d "%~dp0" && npm run dev:admin"
timeout /t 3 /nobreak >nul

:: ─── Ouverture des navigateurs ───────────────────────────────────────────────
echo.
echo  ✅ Tous les services sont lancés !
echo  📌 Application Publique : http://localhost:3005
echo  🔐 Portail Admin       : http://localhost:3007
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3005
start http://localhost:3007

echo.
echo  ─────────────────────────────────────────────────
echo   Fermez cette fenêtre principale quand vous voulez.
echo   (Les serveurs continueront de tourner séparément)
echo  ─────────────────────────────────────────────────
echo.
pause
