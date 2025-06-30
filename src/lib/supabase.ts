import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
export const isSupabaseConnected = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
);

let supabase: any;

// Enhanced connection test with better error handling
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConnected) {
    console.error('Supabase credentials missing or invalid');
    return false;
  }
  
  try {
    console.log('Testing connection to:', supabaseUrl);
    
    // Test basic connectivity with a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!healthResponse.ok) {
      console.error('Supabase health check failed:', healthResponse.status, healthResponse.statusText);
      return false;
    }
    
    console.log('Basic connectivity test passed');
    
    // Test a simple database query with the actual client
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database query test failed:', error);
      
      // Auth errors are expected when not logged in - connection is still working
      if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        console.log('Auth error is expected when not logged in - connection is working');
        return true;
      }
      
      return false;
    }
    
    console.log('Database connection test passed');
    return true;
    
  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    
    if (error.name === 'AbortError') {
      console.error('Connection timeout - Supabase project may be unreachable');
    } else if (error.message?.includes('Failed to fetch')) {
      console.error('Network error - Check your internet connection and Supabase project status');
    }
    
    return false;
  }
};

try {
  if (isSupabaseConnected) {
    console.log('Initializing Supabase client with URL:', supabaseUrl);
    
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    });
    
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase credentials not found or invalid. Using mock client.');
    console.warn('Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    supabase = createMockClient();
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
  supabase = createMockClient();
}

function createMockClient() {
  const mockError = { message: 'Supabase not connected. Please check your .env configuration and project status.' };
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signUp: () => Promise.resolve({ error: mockError }),
      signInWithPassword: () => Promise.resolve({ error: mockError }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          maybeSingle: () => Promise.resolve({ data: null, error: mockError }),
          order: () => ({ 
            limit: () => Promise.resolve({ data: [], error: mockError }),
            abortSignal: () => ({ 
              limit: () => Promise.resolve({ data: [], error: mockError })
            })
          }),
          abortSignal: () => Promise.resolve({ data: [], error: mockError }),
          limit: () => Promise.resolve({ data: [], error: mockError })
        }) 
      }),
      insert: () => Promise.resolve({ error: mockError }),
      update: () => ({ eq: () => Promise.resolve({ error: mockError }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: mockError }) }),
      upsert: () => Promise.resolve({ error: mockError }),
    }),
  };
}

export { supabase };