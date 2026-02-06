import { createClient } from '@supabase/supabase-js';

// Live credentials provided by the user
const supabaseUrl = 'https://tgudyhbnvvrszrdykdvm.supabase.co';
const supabaseAnonKey = 'sb_publishable_6Btehf9VprAJZ1ZKDJPzwg_uh014xpx';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DATABASE SCHEMA SETUP (Run this in your Supabase SQL Editor):
 * 
 * -- 1. Profiles Table
 * create table profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   username text unique,
 *   first_name text,
 *   last_name text,
 *   role text check (role in ('guru', 'shishya')),
 *   expertise text,
 *   bio text,
 *   avatar_url text,
 *   upi_id text,
 *   rating float default 5.0,
 *   reviews int default 0,
 *   updated_at timestamp with time zone default now()
 * );
 * 
 * -- 2. Posts Table
 * create table posts (
 *   id uuid default uuid_generate_v4() primary key,
 *   creator_id uuid references profiles(id),
 *   type text check (type in ('IMAGE', 'VIDEO', 'ARTICLE')),
 *   title text,
 *   content text,
 *   media_url text,
 *   likes_count int default 0,
 *   comments_count int default 0,
 *   created_at timestamp with time zone default now()
 * );
 * 
 * -- 3. Enable RLS
 * alter table profiles enable row level security;
 * alter table posts enable row level security;
 * 
 * -- 4. Policies
 * create policy "Public profiles are viewable by everyone" on profiles for select using (true);
 * create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
 * create policy "Posts are viewable by everyone" on posts for select using (true);
 * create policy "Authenticated users can create posts" on posts for insert with check (auth.role() = 'authenticated');
 */
