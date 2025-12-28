# ============================================
# DEPLOY ALL EDGE FUNCTIONS SCRIPT (PowerShell)
# ============================================
# This script deploys all edge functions to Supabase
# Make sure you're logged in and project is linked first!
# ============================================

Write-Host "🚀 Deploying Edge Functions to Supabase..." -ForegroundColor Cyan
Write-Host ""

# Check if supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Host "❌ Supabase CLI not found. Install it with: npm install -g supabase" -ForegroundColor Red
    exit 1
}

# Check if logged in
try {
    $null = supabase projects list 2>&1
} catch {
    Write-Host "❌ Not logged in to Supabase. Run: supabase login" -ForegroundColor Red
    exit 1
}

$functions = @(
    "fetch-vehicles",
    "submit-valuation",
    "notify-admin",
    "notify-client",
    "public-config"
)

foreach ($func in $functions) {
    Write-Host "📦 Deploying $func..." -ForegroundColor Yellow
    supabase functions deploy $func
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to deploy $func" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ All edge functions deployed successfully!" -ForegroundColor Green
Write-Host "🔍 Verify in Supabase Dashboard → Edge Functions" -ForegroundColor Cyan
