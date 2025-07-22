#!/usr/bin/env python3
"""
Supabase Keep Alive Script
This script makes dummy entries to prevent the Supabase database from pausing after 7 days of inactivity.
Run this script daily via cronjob to keep your database active.
"""

import os
import requests
from datetime import datetime

# Supabase configuration
# Get values from environment variables (for GitHub Actions) or use defaults for local development
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Headers for Supabase API
headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

def make_dummy_todo_entry():
    """Make a dummy entry to the todo table (id and created are auto-generated)"""
    try:
        # Insert empty object into todo table (id and created will be auto-generated)
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/todo",
            headers=headers,
            json={}  # Empty object since id and created are auto-generated
        )
        
        if response.status_code == 201:
            print(f"✅ Successfully created dummy todo entry at {datetime.now()}")
            return True
        else:
            print(f"❌ Failed to create todo entry: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating todo entry: {str(e)}")
        return False

def cleanup_old_entries():
    """Clean up old dummy entries (keep only last 30 days)"""
    try:
        # Delete old todo entries (older than 30 days)
        thirty_days_ago = (datetime.now() - datetime.timedelta(days=30)).isoformat()
        
        response = requests.delete(
            f"{SUPABASE_URL}/rest/v1/todo",
            headers=headers,
            params={
                "created": f"lt.{thirty_days_ago}"
            }
        )
        
        if response.status_code == 200:
            print(f"✅ Cleaned up old todo entries")
            
    except Exception as e:
        print(f"❌ Error cleaning up old entries: {str(e)}")

def main():
    """Main function to run the keep alive script"""
    print(f"🚀 Starting Supabase Keep Alive Script at {datetime.now()}")
    print(f"📊 Supabase URL: {SUPABASE_URL}")
    
    # Check if Supabase credentials are configured
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
        print("   For local development, update the default values in the script")
        return
    
    # Make dummy entry
    todo_success = make_dummy_todo_entry()
    
    # Clean up old entries (run once a week)
    if datetime.now().weekday() == 0:  # Monday
        cleanup_old_entries()
    
    # Summary
    if todo_success:
        print(f"✅ Keep alive script completed successfully at {datetime.now()}")
    else:
        print(f"⚠️  Keep alive script completed with errors at {datetime.now()}")

if __name__ == "__main__":
    main()