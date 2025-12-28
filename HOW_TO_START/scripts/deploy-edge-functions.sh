#!/bin/bash
# ============================================
# DEPLOY ALL EDGE FUNCTIONS SCRIPT
# ============================================
# This script deploys all edge functions to Supabase
# Make sure you're logged in and project is linked first!
# ============================================

echo "🚀 Deploying Edge Functions to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with: npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Run: supabase login"
    exit 1
fi

echo "📦 Deploying fetch-vehicles..."
supabase functions deploy fetch-vehicles
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy fetch-vehicles"
    exit 1
fi

echo "📦 Deploying submit-valuation..."
supabase functions deploy submit-valuation
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy submit-valuation"
    exit 1
fi

echo "📦 Deploying notify-admin..."
supabase functions deploy notify-admin
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy notify-admin"
    exit 1
fi

echo "📦 Deploying notify-client..."
supabase functions deploy notify-client
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy notify-client"
    exit 1
fi

echo "📦 Deploying public-config..."
supabase functions deploy public-config
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy public-config"
    exit 1
fi

echo ""
echo "✅ All edge functions deployed successfully!"
echo "🔍 Verify in Supabase Dashboard → Edge Functions"
