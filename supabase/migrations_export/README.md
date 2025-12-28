# AutoAndrew Database Migrations

This folder contains all SQL migrations needed to set up the database for the AutoAndrew vehicle valuation platform.

## Quick Start

Run these migrations **in order** in your Supabase SQL editor:

1. `001_enums.sql` - Create custom enum types
2. `002_tables.sql` - Create all tables
3. `003_indexes.sql` - Create performance indexes
4. `004_functions.sql` - Create database functions
5. `005_triggers.sql` - Create triggers (for auto-creating user profiles)
6. `006_rls_policies.sql` - Create Row Level Security policies
7. `007_realtime.sql` - Enable realtime for key tables
8. `008_seed_data.sql` - (Optional) Insert default settings

## Database Schema Overview

### Tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | Extended user info (name, surname, phone) |
| `user_roles` | Maps users to roles (admin/user) |
| `app_settings` | Key-value store for app configuration |
| `saved_vehicles` | User's favorited vehicles |
| `valuation_requests` | Vehicle valuation submissions |
| `valuation_messages` | Messages in valuation threads |
| `activity_log` | Admin activity audit log |

### Enums

| Enum | Values |
|------|--------|
| `app_role` | `admin`, `user` |

### Key Functions

| Function | Description |
|----------|-------------|
| `has_role(user_id, role)` | Check if user has a specific role |
| `get_user_role(user_id)` | Get user's role |
| `user_owns_valuation_request(request_id)` | Check ownership of request |
| `send_valuation_message(request_id, body, attachments)` | Send message in thread |
| `mark_thread_read(request_id)` | Mark messages as read |
| `insert_system_message(request_id, body)` | Insert system message (admin) |
| `handle_new_user()` | Trigger: auto-create profile on signup |

## Security Model

### Row Level Security (RLS)

All tables have RLS enabled with these patterns:

- **Admin-only tables**: `activity_log`, `app_settings`
- **User owns own data**: `saved_vehicles`, `user_profiles`
- **Mixed access**: `valuation_requests`, `valuation_messages`

### Message Security

Messages can ONLY be inserted via the `send_valuation_message` function, which:
- Validates user authentication
- Checks ownership/permissions
- Prevents users from messaging on closed requests
- Auto-updates unread counts

## Environment Variables

The app expects these environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

## Edge Functions

The app uses these edge functions (deploy separately):

| Function | Purpose |
|----------|---------|
| `fetch-vehicles` | Fetch vehicle listings from external API |
| `notify-admin` | Send email to admin on new requests |
| `notify-client` | Send email to client on updates |
| `submit-valuation` | Handle valuation form submission |
| `public-config` | Return public configuration |

## Creating an Admin User

1. Register a user through the normal signup flow
2. Find their user ID:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'admin@example.com';
   ```
3. Update their role:
   ```sql
   UPDATE public.user_roles 
   SET role = 'admin' 
   WHERE user_id = '<user-uuid>';
   ```

## Troubleshooting

### "new row violates row-level security policy"
- Ensure the user is authenticated
- Check that `user_id` column matches `auth.uid()`
- For admin operations, verify user has `admin` role

### Messages not appearing
- Messages must be sent via `send_valuation_message` function
- Direct INSERTs are blocked by RLS

### Realtime not working
- Ensure tables are added to `supabase_realtime` publication
- Check that `REPLICA IDENTITY FULL` is set

## Full Migration (Single File)

For convenience, `full_migration.sql` combines all migrations into a single file.
