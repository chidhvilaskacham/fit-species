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

// Enhanced connection test with detailed diagnostics
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConnected) {
    console.error('Supabase credentials missing or invalid');
    return false;
  }
  
  try {
    console.log('Testing connection to:', supabaseUrl);
    
    // First, test basic connectivity to Supabase
    const healthCheckUrl = `${supabaseUrl}/rest/v1/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const healthResponse = await fetch(healthCheckUrl, {
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
      
      if (healthResponse.status === 401) {
        console.error('Authentication failed - check your VITE_SUPABASE_ANON_KEY');
      } else if (healthResponse.status === 404) {
        console.error('Project not found - check your VITE_SUPABASE_URL');
      } else if (healthResponse.status === 403) {
        console.error('Access forbidden - your project might be paused or have restrictions');
      }
      
      return false;
    }
    
    console.log('Basic connectivity test passed');
    
    // Now test a simple database query
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database query test failed:', error);
      
      if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        console.log('Auth error is expected when not logged in - connection is working');
        return true;
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('Database schema issue - tables may not exist');
        return false;
      } else {
        console.error('Unexpected database error:', error.message);
        return false;
      }
    }
    
    console.log('Database connection test passed');
    return true;
    
  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    
    if (error.name === 'AbortError') {
      console.error('Connection timeout - Supabase project may be unreachable or slow');
    } else if (error.message?.includes('Failed to fetch')) {
      console.error('Network error - Check your internet connection and Supabase project status');
    } else if (error.message?.includes('CORS')) {
      console.error('CORS error - Check your Supabase project settings');
    } else if (error.message?.includes('NetworkError')) {
      console.error('Network error - Unable to reach Supabase servers');
    }
    
    return false;
  }
};

// Enhanced fetch function with better error handling and retry logic
const customFetch = async (url: string, options: any = {}) => {
  const maxRetries = 2;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout
    
    try {
      console.log(`Fetch attempt ${attempt}/${maxRetries} to:`, url);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
        
        if (response.status === 401) {
          throw new Error('Authentication failed - please check your Supabase API key');
        } else if (response.status === 403) {
          throw new Error('Access forbidden - your Supabase project may be paused or restricted');
        } else if (response.status === 404) {
          throw new Error('Resource not found - please check your Supabase project URL');
        } else if (response.status >= 500) {
          throw new Error('Supabase server error - please try again later');
        }
      }
      
      return response;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;
      
      console.error(`Fetch attempt ${attempt} failed:`, error.message);
      
      if (error.name === 'AbortError') {
        lastError = new Error('Request timeout - Supabase may be unreachable. Please check your project status.');
      } else if (error.message?.includes('Failed to fetch')) {
        lastError = new Error('Network error - Unable to reach Supabase. Please check your internet connection and project URL.');
      } else if (error.message?.includes('CORS')) {
        lastError = new Error('CORS error - Please check your Supabase project settings and allowed origins.');
      }
      
      // Don't retry on authentication or configuration errors
      if (error.message?.includes('Authentication') || 
          error.message?.includes('API key') ||
          error.message?.includes('project URL') ||
          error.message?.includes('CORS')) {
        break;
      }
      
      // Wait before retry (except on last attempt)
      if (attempt < maxRetries) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  
  throw lastError;
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
        fetch: customFetch,
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