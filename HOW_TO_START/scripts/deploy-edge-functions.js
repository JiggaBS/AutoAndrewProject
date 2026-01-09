#!/usr/bin/env node
/**
 * ============================================
 * DEPLOY ALL EDGE FUNCTIONS SCRIPT (Cross-Platform)
 * ============================================
 * This script deploys all edge functions to Supabase
 * Works on Windows, Mac, and Linux
 * Make sure you're logged in and project is linked first!
 * ============================================
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: join(__dirname, '../..'), // Project root
      shell: true 
    });
    return true;
  } catch (error) {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkCommandExists(command) {
  try {
    if (process.platform === 'win32') {
      execSync(`where ${command}`, { stdio: 'ignore' });
    } else {
      execSync(`which ${command}`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

function checkSupabaseLogin() {
  try {
    execSync('supabase projects list', { 
      stdio: 'pipe',
      shell: true 
    });
    return true;
  } catch {
    return false;
  }
}

// Main execution
log('🚀 Deploying Edge Functions to Supabase...', 'cyan');
console.log('');

// Check if supabase CLI is installed
if (!checkCommandExists('supabase')) {
  log('❌ Supabase CLI not found. Install it with: npm install -g supabase', 'red');
  process.exit(1);
}

// Check if logged in
if (!checkSupabaseLogin()) {
  log('❌ Not logged in to Supabase. Run: supabase login', 'red');
  process.exit(1);
}

// List of functions to deploy
const functions = [
  'fetch-vehicles',
  'submit-valuation',
  'notify-admin',
  'notify-client',
  'public-config',
];

// Deploy each function
let allSuccess = true;
for (const func of functions) {
  log(`📦 Deploying ${func}...`, 'yellow');
  const success = execCommand(
    `supabase functions deploy ${func}`,
    `Failed to deploy ${func}`
  );
  
  if (!success) {
    allSuccess = false;
    break;
  }
}

if (!allSuccess) {
  process.exit(1);
}

console.log('');
log('✅ All edge functions deployed successfully!', 'green');
log('🔍 Verify in Supabase Dashboard → Edge Functions', 'cyan');
