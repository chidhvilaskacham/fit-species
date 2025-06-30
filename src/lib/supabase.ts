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

// Test connection function with better error handling
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConnected) return false;
  
  try {
    // Use a simple query with timeout to test connection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);
    
    clearTimeout(timeoutId);
    
    // If there's no error or it's just an auth error (which means connection works), return true
    return !error || error.message.includes('JWT') || error.message.includes('auth');
  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    
    // Check for specific network errors
    if (error.name === 'AbortError') {
      console.error('Connection timeout - Supabase may be unreachable');
    } else if (error.message?.includes('Failed to fetch')) {
      console.error('Network error - Check your internet connection and Supabase project status');
    }
    
    return false;
  }
};

try {
  if (isSupabaseConnected) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
        fetch: (url, options = {}) => {
          // Add timeout to all requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => {
            clearTimeout(timeoutId);
          });
        },
      },
    });
  } else {
    console.warn('Supabase credentials not found or invalid. Using mock client.');
    // Create a mock client that immediately resolves
    supabase = createMockClient();
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
  // Fallback to mock client
  supabase = createMockClient();
}

function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Immediately call callback with signed out state
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signUp: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Please connect to Supabase first' } }),
          order: () => ({ 
            limit: () => Promise.resolve({ data: [], error: { message: 'Please connect to Supabase first' } }),
            abortSignal: () => ({ 
              limit: () => Promise.resolve({ data: [], error: { message: 'Please connect to Supabase first' } })
            })
          }),
          abortSignal: () => Promise.resolve({ data: [], error: { message: 'Please connect to Supabase first' } }),
          limit: () => Promise.resolve({ data: [], error: { message: 'Please connect to Supabase first' } })
        }) 
      }),
      insert: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }),
      update: () => ({ eq: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }) }),
      upsert: () => Promise.resolve({ error: { message: 'Please connect to Supabase first' } }),
    }),
  };
}

export { supabase };