@echo off
title NovoRise — Start All Services
color 0A

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          NovoRise — Démarrage complet        ║
echo  ║   Frontend  →  http://localhost:3005         ║
echo  ║   Backend   →  http://localhost:3006         ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ─── Mise à jour des ports dans vite.config.ts ───────────────────────────────
echo [1/3] Configuration des ports...

:: Remplacer le port du backend dans .env
powershell -Command "(Get-Content 'backend\.env') -replace 'PORT=.*', 'PORT=3006' | Set-Content 'backend\.env'"

:: Remplacer FRONTEND_URL dans .env
powershell -Command "(Get-Content 'backend\.env') -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=http://localhost:3005' | Set-Content 'backend\.env'"

echo    Ports configurés : Frontend=3005  Backend=3006
echo.

:: ─── Lancement Backend sur port 3006 ─────────────────────────────────────────
echo [2/3] Démarrage du Backend (port 3006)...
start "NovoRise — Backend :3006" cmd /k "cd /d "%~dp0backend" && set PORT=3006 && npm run dev"
timeout /t 3 /nobreak >nul

:: ─── Lancement Frontend sur port 3005 ────────────────────────────────────────
echo [3/3] Démarrage du Frontend (port 3005)...
start "NovoRise — Frontend :3005" cmd /k "cd /d "%~dp0" && set VITE_PORT=3005 && npx vite --port 3005"
timeout /t 3 /nobreak >nul

:: ─── Ouverture du navigateur ──────────────────────────────────────────────────
echo.
echo  ✅ Services lancés !
echo  📌 Ouverture de http://localhost:3005 dans le navigateur...
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3005

echo.
echo  ─────────────────────────────────────────────────
echo   Fermez cette fenêtre pour arrêter le monitoring
echo   (Les serveurs continueront dans leurs fenêtres)
echo  ─────────────────────────────────────────────────
echo.
pause
