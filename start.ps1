# ================================================================
#  start.ps1  —  VM Labs Portfolio — Iniciar tudo com 1 comando
#  Uso:  powershell -ExecutionPolicy Bypass -File .\start.ps1
# ================================================================

$ErrorActionPreference = "Continue"
$ROOT     = Split-Path -Parent $MyInvocation.MyCommand.Definition
$MONGOD   = "C:\Users\MASTER\mongodb\mongodb-win32-x86_64-windows-7.0.21\bin\mongod.exe"
$MONGODAT = "C:\Users\MASTER\mongodb-data"
$BACKEND  = Join-Path $ROOT "backend"
$FRONTEND = Join-Path $ROOT "frontend"

function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "  [$n/3] $msg" -ForegroundColor Cyan
}

function Wait-Port($port, $secs) {
    $ok = $false
    for ($i = 0; $i -lt $secs; $i++) {
        Start-Sleep -Seconds 1
        try {
            $t = New-Object Net.Sockets.TcpClient
            $t.Connect("127.0.0.1", $port)
            $t.Close()
            $ok = $true
            break
        } catch {}
    }
    return $ok
}

Clear-Host
Write-Host "================================================" -ForegroundColor Green
Write-Host "   VM Labs Portfolio — Iniciando servicos...   " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# ── 1. MONGODB ──────────────────────────────────────────────
Write-Step 1 "MongoDB (porta 27017)"

$mongoUp = Wait-Port 27017 1
if ($mongoUp) {
    Write-Host "     Ja esta rodando." -ForegroundColor Green
} else {
    if (-not (Test-Path $MONGOD)) {
        Write-Host "     ERRO: mongod.exe nao encontrado em:" -ForegroundColor Red
        Write-Host "     $MONGOD" -ForegroundColor Yellow
        Write-Host "     Siga o README para baixar o MongoDB portable." -ForegroundColor Yellow
        Read-Host "     Pressione Enter para sair"
        exit 1
    }
    New-Item -ItemType Directory -Path $MONGODAT -Force | Out-Null
    Start-Process `
        -FilePath $MONGOD `
        -ArgumentList "--dbpath `"$MONGODAT`" --port 27017 --bind_ip 127.0.0.1" `
        -WindowStyle Minimized

    $mongoUp = Wait-Port 27017 20
    if ($mongoUp) {
        Write-Host "     Iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "     ERRO: MongoDB nao respondeu em 20s." -ForegroundColor Red
        Read-Host "     Pressione Enter para sair"
        exit 1
    }
}

# ── 2. BACKEND ──────────────────────────────────────────────
Write-Step 2 "Backend FastAPI (porta 8001)"

$backendUp = Wait-Port 8001 1
if ($backendUp) {
    Write-Host "     Ja esta rodando." -ForegroundColor Green
} else {
    # Usa o venv se existir, senao usa o python do sistema
    $venvPy = Join-Path $BACKEND "venv\Scripts\python.exe"
    $python = if (Test-Path $venvPy) { $venvPy } else { "python" }

    Start-Process `
        -FilePath $python `
        -ArgumentList "-m uvicorn server:app --host 0.0.0.0 --port 8001 --reload" `
        -WorkingDirectory $BACKEND `
        -WindowStyle Normal

    $backendUp = Wait-Port 8001 25
    if ($backendUp) {
        Write-Host "     Iniciado em http://localhost:8001" -ForegroundColor Green
        # Sincroniza senha admin e limpa lockouts de login
        $venvPy = Join-Path $BACKEND "venv\Scripts\python.exe"
        $python = if (Test-Path $venvPy) { $venvPy } else { "python" }
        & $python (Join-Path $BACKEND "clear_lockout.py") 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "     Admin sincronizado (senha do .env + lockouts limpos)." -ForegroundColor Green
        }
    } else {
        Write-Host "     AVISO: Backend demorou mais que 25s." -ForegroundColor Yellow
        Write-Host "     Verifique a janela do terminal do backend." -ForegroundColor Yellow
    }
}

# ── 3. FRONTEND ─────────────────────────────────────────────
Write-Step 3 "Frontend React (porta 3000)"

$frontendUp = Wait-Port 3000 1
if ($frontendUp) {
    Write-Host "     Ja esta rodando." -ForegroundColor Green
} else {
    Start-Process `
        -FilePath "cmd.exe" `
        -ArgumentList "/c npm start" `
        -WorkingDirectory $FRONTEND `
        -WindowStyle Normal

    Write-Host "     Compilando... aguarde ~30 segundos." -ForegroundColor Yellow
    $frontendUp = Wait-Port 3000 60
    if ($frontendUp) {
        Write-Host "     Pronto em http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "     AVISO: Frontend demorou. Verifique a janela do npm." -ForegroundColor Yellow
    }
}

# ── RESULTADO ───────────────────────────────────────────────
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Tudo pronto!" -ForegroundColor Green
Write-Host ""
Write-Host "   Site:    http://localhost:3000" -ForegroundColor White
Write-Host "   API:     http://localhost:8001/api/" -ForegroundColor White
Write-Host "   Admin:   http://localhost:3000/admin" -ForegroundColor White
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Senha:   (definida em backend\.env)" -ForegroundColor White
Write-Host ""
Write-Host "   DADOS SALVOS EM:" -ForegroundColor Cyan
Write-Host "   - MongoDB (banco principal)" -ForegroundColor White
Write-Host "   - backend\saves\ (backups JSON)" -ForegroundColor White
Write-Host ""
Write-Host "   Para parar: feche as janelas do backend e frontend." -ForegroundColor DarkGray
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Abre o navegador automaticamente
Start-Process "http://localhost:3000"
