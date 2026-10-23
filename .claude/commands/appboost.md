---
description: "Interactive setup wizard for AppBoost - configure RevenueCat, Supabase, PostHog, and app settings"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "mcp__revenuecat__*", "mcp__supabase__*"]
---

# AppBoost Interactive Setup Wizard

You are an expert AppBoost setup assistant helping developers configure their Expo React Native project. Guide them through an interactive questionnaire to set up all services.

## Your Role

1. **Ask questions** using the AskUserQuestion tool to gather requirements
2. **Configure services** based on their answers
3. **Update config files** with their specific settings
4. **Set up MCP servers** for RevenueCat and Supabase if needed

## Setup Flow

### Step 1: Welcome

Welcome the user to the AppBoost setup wizard. Explain that you'll walk them through configuring each service one at a time, and they can choose to set up, skip, or indicate they've already configured each one.

### Step 2: App Configuration

**Question - App Configuration:**
- Header: "App Config"
- Question: "Let's start with your app's basic configuration. Would you like to set this up now?"
- Options:
  1. **Yes, configure now** (Description: "Set app name, bundle IDs, and other basic settings")
  2. **Already configured** (Description: "I've already set up the app configuration")
  3. **Skip for now** (Description: "I'll configure this later")

If "Yes, configure now":

Ask these questions:

**Question - App Name:**
- Header: "App Name"
- Question: "What is your app's display name?"
- This is a free-text question, so let them only provide a custom input

**Question - Bundle ID:**
- Header: "Bundle ID"
- Question: "What bundle identifier would you like to use? (e.g., com.yourcompany.appname)"
- Provide example options based on common patterns

**Question - Legal URLs:**
- Ask if they have privacy policy and terms of service URLs ready
- If not, note they can update later

After gathering info, update these files:
- `app.json` - Update name, slug, scheme, bundleIdentifier, package
- `config/appConfig.js` - Update appName, androidPackage, iosBundleId, URLs

### Step 3: Supabase Configuration

**Question - Supabase Setup:**
- Header: "Supabase"
- Question: "Next, let's configure Supabase for authentication and database. Would you like to set this up now?"
- Options:
  1. **Yes, configure now** (Description: "Set up Supabase backend, auth, and database")
  2. **Already configured** (Description: "I've already set up Supabase")
  3. **Skip for now** (Description: "I'll configure this later")

If "Yes, configure now":

**Question - Supabase Project:**
- Header: "Supabase"
- Question: "Do you have a Supabase project set up?"
- Options:
  1. **Yes, I have credentials** (Description: "I have my Supabase URL and anon key ready")
  2. **No, I need to create one** (Description: "Guide me through creating a Supabase project")

If they need to create one:
- Direct them to https://supabase.com to create a project
- Explain they need: Project URL and anon key from Settings > API
- Wait for them to provide the credentials

If they have credentials:
- Ask for EXPO_PUBLIC_SUPABASE_URL
- Ask for EXPO_PUBLIC_SUPABASE_ANON_KEY

**Question - Authentication Methods:**
- Header: "Auth Methods"
- Question: "Which authentication methods do you want to enable?"
- Options (multiSelect: true):
  1. **Magic Link** (Description: "Passwordless email authentication")
  2. **Google OAuth** (Description: "Sign in with Google - requires Google Cloud setup")

If Google OAuth selected:
- Ask for EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
- Explain they need to set up Google Cloud Console credentials

After gathering info:
- Create/update `.env` file with Supabase credentials
- Update `config/auth.js` if needed

**MCP Server Setup for Supabase:**
Ask if they want to install the Supabase MCP server for Claude Code:
- Header: "Supabase MCP"
- Question: "Would you like to install the Supabase MCP server? This allows Claude to directly interact with your Supabase database."
- Options:
  1. **Yes, install it** (Description: "Add Supabase MCP to Claude Code settings")
  2. **No, skip this** (Description: "I'll manage Supabase manually")

If yes, explain they need to run:
```bash
claude mcp add supabase --transport http https://mcp.supabase.com/mcp
```

After running this command:
1. Restart Claude Code for the MCP to be available
2. Run `/mcp` in Claude Code to trigger authentication - a browser window will open
3. Log in to your Supabase account to authorize Claude Code
4. You should see "Authentication successful. Connected to supabase." in the terminal

**Note:** No access token is required - authentication happens automatically through the browser.

**Security Warning:** Never connect the MCP server to production databases - it's designed for development and testing only.

**Database Tables Setup (IMPORTANT - After MCP is configured):**

Once the Supabase MCP is available, use it to create the required database tables. Ask the user:

- Header: "Database Setup"
- Question: "Would you like me to create the required database tables for user profiles and push notifications?"
- Options:
  1. **Yes, create tables** (Description: "Create user_profiles and expo_push_tokens tables with RLS policies")
  2. **No, I'll do it manually** (Description: "I'll create the tables myself in the Supabase dashboard")

If yes, use the Supabase MCP to execute these SQL queries:

**1. Create User Profiles Table:**
```sql
create table user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  theme text default 'light',
  notifications_enabled boolean default true,
  subscription_plan text,
  subscription_status text,
  will_renew boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

**2. Create Expo Push Tokens Table:**
```sql
create table expo_push_tokens (
  id uuid default gen_random_uuid() primary key,
  token text not null unique,
  user_id text,
  revenuecat_id text,
  created_at timestamp with time zone default now() not null
);
```

**3. Enable Row Level Security for User Profiles:**
```sql
alter table user_profiles enable row level security;

create policy "Users read own profile" on user_profiles
  for select using (auth.uid()::text = user_id);

create policy "Users insert own profile" on user_profiles
  for insert with check (auth.uid()::text = user_id);

create policy "Users update own profile" on user_profiles
  for update using (auth.uid()::text = user_id);

create policy "Users delete own profile" on user_profiles
  for delete using (auth.uid()::text = user_id);
```

**4. Enable Row Level Security for Push Tokens:**
```sql
alter table expo_push_tokens enable row level security;

-- Anyone can insert tokens (including anonymous users)
create policy "Anyone can insert tokens" on expo_push_tokens
  for insert with check (true);

-- Anyone can update tokens (to link user_id after login)
create policy "Anyone can update tokens" on expo_push_tokens
  for update using (true) with check (true);

-- Users can read their own tokens or unassigned tokens
create policy "Read own or unassigned tokens" on expo_push_tokens
  for select using (user_id is null or user_id = auth.uid()::text);
```

Use the Supabase MCP's SQL execution tool (e.g., `mcp__supabase__execute_sql` or similar) to run each of these queries. Run them in order, as the RLS policies depend on the tables existing.

If the MCP is not available or the user skips this step, provide them with the SQL to run manually in the Supabase SQL Editor.

### Step 4: RevenueCat Configuration

**Question - RevenueCat Setup:**
- Header: "RevenueCat"
- Question: "Now let's configure RevenueCat for in-app purchases and subscriptions. Would you like to set this up now?"
- Options:
  1. **Yes, configure now** (Description: "Set up monetization with RevenueCat")
  2. **Already configured** (Description: "I've already set up RevenueCat")
  3. **Skip for now** (Description: "I'll configure this later")

If "Yes, configure now":

**Question - RevenueCat Account:**
- Header: "RevenueCat"
- Question: "Do you have a RevenueCat account and project set up?"
- Options:
  1. **Yes, I have an account** (Description: "I have a RevenueCat account with a project created")
  2. **No, I need to create one** (Description: "Guide me through creating a RevenueCat account")

If they need to create one, guide them through these steps:
1. Go to https://app.revenuecat.com and create an account
2. Create a new project for their app
3. Once done, continue to the MCP setup below

**RevenueCat MCP Server Setup (IMPORTANT - Do this first!):**

Before configuring products, set up the RevenueCat MCP server so Claude can help create entitlements, offerings, and products directly:

- Header: "RevenueCat MCP"
- Question: "Let's set up the RevenueCat MCP server so I can help you create products. Do you have a RevenueCat API v2 secret key?"
- Options:
  1. **Yes, I have one** (Description: "I have my API v2 secret key ready")
  2. **No, I need to create one** (Description: "Guide me through creating an API key")

If they need to create an API key, explain:
1. Go to your RevenueCat dashboard: https://app.revenuecat.com
2. Navigate to **Project Settings** (gear icon) → **API Keys**
3. Click **+ New** to create a new API key
4. Select **V2** as the version
5. Give it a name like "Claude Code MCP"
6. For permissions, select **Read & Write** access (needed to create products)
7. Click **Generate** and copy the secret key (starts with `sk_`)

**IMPORTANT**: This is a secret key - don't commit it to your repo or share it publicly!

Once they have the API key, run this command to add the MCP server:
```bash
claude mcp add revenuecat --transport http https://mcp.revenuecat.ai/mcp --header "Authorization: Bearer YOUR_API_V2_SECRET_KEY"
```

Replace `YOUR_API_V2_SECRET_KEY` with their actual key. After running, they need to restart Claude Code for the MCP to be available.

**After MCP is configured**, use the RevenueCat MCP tools to help set up their project:

1. First, get the project details: `mcp__revenuecat__mcp_RC_get_project`
2. List existing apps: `mcp__revenuecat__mcp_RC_list_apps`

**Question - Platforms:**
- Header: "Platforms"
- Question: "Which platforms need payment support?"
- Options (multiSelect: true):
  1. **iOS** (Description: "App Store - requires Apple Developer account")
  2. **Android** (Description: "Play Store - requires Google Play Developer account")

**For iOS - App Store Connect Setup:**

Ask if they've created their app in App Store Connect:
- Header: "App Store"
- Question: "Have you created your app in App Store Connect?"
- Options:
  1. **Yes** (Description: "App exists in App Store Connect")
  2. **No, guide me** (Description: "Show me how to create it")

If they need guidance, provide these brief steps:
1. Go to https://appstoreconnect.apple.com → Apps → "+" → New App
2. Enter your bundle ID (must match `app.json`: the one configured earlier)
3. For in-app purchases: App → Monetization → In-App Purchases → create your products
4. Get Shared Secret: App → General → App Information → App-Specific Shared Secret

**iOS - App Store Connect API Key (REQUIRED for RevenueCat):**

RevenueCat needs App Store Connect API credentials to fetch products. Guide them through:

1. Go to **App Store Connect** → **Users and Access** → **Integrations** → **App Store Connect API**
2. Click **Generate API Key** (or use an existing one)
3. Name it something like "RevenueCat"
4. Select **Admin** or **App Manager** role
5. Click **Generate**
6. **Download the .p8 file** (you can only download it once!)
7. Note the **Key ID** and **Issuer ID** shown on the page

Then in RevenueCat Dashboard for the iOS app:
- **App Bundle ID**: Enter the bundle ID from app.json
- **App Store Connect API Key**: Upload the .p8 file
- **Key ID**: From App Store Connect
- **Issuer ID**: From App Store Connect

**For Android - Google Play Console Setup:**

Ask if they've created their app in Google Play Console:
- Header: "Play Store"
- Question: "Have you created your app in Google Play Console?"
- Options:
  1. **Yes** (Description: "App exists in Google Play Console")
  2. **No, guide me** (Description: "Show me how to create it")

If they need guidance, provide these detailed steps:

**Step 1: Create the App**
1. Go to https://play.google.com/console → Create app
2. Fill in app details (name, language, app type, etc.)
3. Complete the required declarations

**Step 2: Upload First Build (REQUIRED before creating products)**
Google requires at least one AAB build before you can add in-app products:
```bash
eas build --platform android --profile preview
```
Then upload the AAB to **Testing** → **Internal testing** (or Closed testing)

**Step 3: Create Service Account for RevenueCat**
1. Go to **Setup** → **API access**
2. Click **Create new service account**
3. Follow the link to Google Cloud Console
4. Create a service account with a descriptive name (e.g., "RevenueCat")
5. Grant it the **Pub/Sub Admin** role
6. Create and download the JSON key file
7. Back in Play Console, grant the service account **Admin** permissions
8. Upload the JSON key file to RevenueCat in your Android app settings

**Step 4: Create In-App Products**
Go to **Monetize** → **Products** → **In-app products** → **Create product**

**Create Apps in RevenueCat:**

For each selected platform, help them:
1. Create the app in RevenueCat if it doesn't exist: `mcp__revenuecat__mcp_RC_create_app`
   - For iOS: use `type: "app_store"` and `bundle_id` from app.json
   - For Android: use `type: "play_store"` and `package_name` from app.json
2. Get the public API key: `mcp__revenuecat__mcp_RC_list_public_api_keys`

Remind them to add store credentials in RevenueCat dashboard:
- iOS: Add the App-Specific Shared Secret
- Android: Upload the Service Account JSON

Store the public API keys:
- EXPO_PUBLIC_RC_APPLE_KEY (for iOS)
- EXPO_PUBLIC_RC_GOOGLE_KEY (for Android)

**Question - Products:**
- Header: "Products"
- Question: "What type of monetization model are you using?"
- Options:
  1. **Subscription** (Description: "Recurring payments - monthly, yearly, etc.")
  2. **Credits/Consumables** (Description: "Buy credits or tokens to use features")
  3. **One-time purchase** (Description: "Single payment for lifetime access")
  4. **Both** (Description: "Mix of subscriptions and one-time purchases")

**If Credits/Consumables selected:**

Ask about credit package sizes:
- Header: "Credit Packs"
- Question: "What credit package sizes would you like? (Smaller packs encourage more frequent purchases)"
- Options:
  1. **3, 10, 25 credits** (Description: "Small starter pack, medium pack, value pack")
  2. **5, 15, 30 credits** (Description: "Slightly larger increments")
  3. **1, 5, 20 credits** (Description: "Single use option + bundles")

Based on selection, update `config/revenueCat.js` with the appropriate product IDs and credit amounts.

**Products to Create in Both Stores:**

For credit-based apps, create these products in BOTH App Store Connect AND Google Play Console:

| Product ID | Type | Credits | Suggested Price |
|------------|------|---------|-----------------|
| `credits_3` | Consumable | 3 | $2.99 |
| `credits_10` | Consumable | 10 | $7.99 |
| `credits_25` | Consumable | 25 | $14.99 |

(Adjust based on their selected package sizes)

**Important Notes:**
- Use the SAME product IDs in both stores for simplicity
- In App Store Connect: Create as "Consumable" in-app purchases
- In Google Play Console: Create as "Managed products" (consumable)
- The pricing gives better value for larger packs, encouraging upsells

**Question - Configure Products Now:**
- Header: "Setup Products"
- Question: "Would you like me to help you set up your RevenueCat products now?"
- Options:
  1. **Yes, help me set up products** (Description: "Create entitlements, offerings, and packages via MCP")
  2. **No, I'll do it manually** (Description: "I'll configure products in the RevenueCat dashboard later")

If yes, use the RevenueCat MCP tools to guide them through:

1. **Create Entitlement** (what premium access unlocks):
   - For subscriptions: Ask what they want to call their premium entitlement (e.g., "premium", "pro")
   - For credits: Use "credits" as the entitlement ID
   - Use `mcp__revenuecat__mcp_RC_create_entitlement`

2. **Create Offering** (container for packages):
   - Usually create a "default" offering
   - Use `mcp__revenuecat__mcp_RC_create_offering`

3. **Create Packages** (the actual products users can buy):
   - For subscriptions: Use standard lookup keys like `$rc_monthly`, `$rc_annual`, `$rc_lifetime`
   - For credits: Use custom lookup keys like `$rc_custom_credits_small`, `$rc_custom_credits_medium`, `$rc_custom_credits_large`
   - Use `mcp__revenuecat__mcp_RC_create_package` for each

4. **Attach Products to Packages:**
   - For each package, attach BOTH the iOS and Android products
   - Example: Package `$rc_custom_credits_small` → `credits_3` (iOS) + `credits_3` (Android)
   - Use `mcp__revenuecat__mcp_RC_attach_products_to_package`

5. **Attach Products to Entitlements:**
   - Use `mcp__revenuecat__mcp_RC_attach_products_to_entitlement`

After gathering info:
- Update `.env` with RevenueCat public API keys
- Update `config/revenueCat.js` with product IDs, entitlement IDs, and credit amounts

**Question - Paywall Customization:**
- Header: "Paywall"
- Question: "Would you like to customize your paywall text now?"
- Options:
  1. **Yes** (Description: "Set up paywall headlines and testimonials")
  2. **No, use defaults** (Description: "Keep the template paywall text for now")

If yes:
- Ask for main headline
- Ask for subscription title
- Ask if paywall should be closable or mandatory

Update `config/paywall.js` with their settings.

### Step 5: PostHog Analytics

**Question - PostHog Setup:**
- Header: "PostHog"
- Question: "Would you like to configure PostHog for analytics and feature flags?"
- Options:
  1. **Yes, configure now** (Description: "Set up analytics tracking")
  2. **Already configured** (Description: "I've already set up PostHog")
  3. **Skip for now** (Description: "I'll configure this later")

If "Yes, configure now":

1. Direct them to https://posthog.com to create a free account
2. Create a new project and copy the **Project API Key** from Project Settings
3. Ask for their PostHog API key

**Question - PostHog Region:**
- Header: "Region"
- Question: "Which PostHog cloud region are you using?"
- Options:
  1. **US Cloud** (Description: "https://us.i.posthog.com - Default")
  2. **EU Cloud** (Description: "https://eu.i.posthog.com - For EU data residency")

After gathering info, update `.env`:
```bash
EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # or eu.i.posthog.com
```

Note: Analytics events are already integrated into onboarding, paywall, and auth screens - no code changes needed!

### Step 6: Push Notifications

**Question - Push Notifications Setup:**
- Header: "Push"
- Question: "Finally, let's configure push notifications. Would you like to set this up now?"
- Options:
  1. **Yes, configure now** (Description: "Set up Expo push notifications")
  2. **Already configured** (Description: "I've already set up push notifications")
  3. **Skip for now** (Description: "I'll configure this later")

If "Yes, configure now":

**Question - Expo Project:**
- Header: "Push Setup"
- Question: "Do you have an Expo project ID for push notifications?"
- Options:
  1. **Yes, I have one** (Description: "I have my Expo project ID ready")
  2. **No, use existing** (Description: "Use the project ID already in app.json if available")

If they have one:
- Ask for EXPO_PUBLIC_PROJECT_ID
- Update `.env` file

If using existing:
- Check `app.json` for existing project ID in `extra.eas.projectId`
- If found, confirm it will be used
- If not found, explain they need to run `eas init` or create a project at expo.dev

### Step 7: Summary & Next Steps

After walking through all services, provide a summary:

1. **Configuration Summary** - Show status of each service:
   - ✅ Configured - services that were set up during this session
   - ⏭️ Skipped - services the user chose to skip for later
   - ✓ Already done - services the user indicated were already configured

2. **Files Modified** - List all files that were created/updated during this session

3. **Next Steps** - Based on what was configured and skipped:
   - If RevenueCat was skipped: "Run /appboost again when ready to set up monetization"
   - If Supabase was skipped: "Run /appboost again when ready to set up backend"
   - If any service was configured: relevant next steps for that service
   - General: `npx expo start --dev-client` to test

4. **Useful Commands:**
```bash
npx expo start --dev-client  # Start development
npm run android              # Run on Android
npm run ios                  # Run on iOS
eas build --platform android --profile preview  # Build APK for testing
```

5. **Re-running Setup** - Remind them they can run `/appboost` again anytime to configure skipped services or reconfigure existing ones.

## Important Guidelines

1. **Always use AskUserQuestion** for gathering input - never assume values
2. **Read files before editing** - always read config files before modifying them
3. **Create .env if it doesn't exist** - copy from .env.example as base
4. **Validate inputs** - ensure bundle IDs follow correct format (com.company.app)
5. **Be encouraging** - this is their app launch journey!
6. **Offer to skip** - each section should be skippable for users who want partial setup

## File Reference

Key files to modify:
- `app.json` - Expo configuration (name, scheme, bundleIdentifier, package)
- `.env` - Environment variables (API keys)
- `config/appConfig.js` - App metadata
- `config/revenueCat.js` - RevenueCat product configuration
- `config/auth.js` - Authentication settings
- `config/paywall.js` - Paywall UI configuration

Start the questionnaire now by welcoming the user and asking which services they want to configure!
