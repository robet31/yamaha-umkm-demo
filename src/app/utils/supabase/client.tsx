import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Demo-mode support: if `VITE_USE_DEMO_DATA` is true, return an in-memory shim
const useDemo = import.meta.env.VITE_USE_DEMO_DATA === 'true';

// Lightweight in-memory demo data (kept in separate file for clarity)
let demoStore: any = null;
let demoAuthListeners: Array<(event: string, session: any) => void> = [];
try {
  // dynamically import to avoid bundling in production builds
  if (useDemo) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    demoStore = require('../../demo/demoData').demoStore;
  }
} catch (e) {
  // ignore
}

// True singleton instance
let supabaseInstance: SupabaseClient | null = null;
let initializationPromise: Promise<SupabaseClient> | null = null;

// Store the URL for debugging
export const supabaseUrl = `https://${projectId}.supabase.co`;

export function createClient(): SupabaseClient {
  // If demo mode requested, return a shim implementing a tiny subset of Supabase API
  if (useDemo) {
    if (supabaseInstance) return supabaseInstance;

    console.log('🔧 Creating Demo Supabase client (in-memory)');

    // Minimal chainable query builder for `from(table).select(...).maybeSingle()` etc.
    const makeQuery = (table: string) => {
      let _rows = demoStore[table] || [];
      const builder: any = {
        select(_cols?: string) {
          return Promise.resolve({ data: _rows, error: null });
        },
        maybeSingle() {
          return Promise.resolve({ data: _rows[0] ?? null, error: null });
        },
        eq(col: string, val: any) {
          _rows = (_rows || []).filter((r: any) => r[col] === val);
          return builder;
        },
        in(col: string, vals: any[]) {
          _rows = (_rows || []).filter((r: any) => vals.includes(r[col]));
          return builder;
        },
        like(col: string, pattern: string) {
          const prefix = pattern.replace(/%$/, '');
          _rows = (_rows || []).filter((r: any) => String(r[col] ?? '').startsWith(prefix));
          return builder;
        },
        order() { return builder; },
        limit() { return builder; },
        insert(rows: any | any[]) {
          const arr = Array.isArray(rows) ? rows : [rows];
          arr.forEach((row: any) => {
            // assign basic id if missing
            if (!row.id) row.id = (Math.max(0, ...(_rows.map((x: any) => x.id || 0))) + 1);
            _rows.push(row);
          });
          demoStore[table] = _rows;
          return Promise.resolve({ data: arr, error: null });
        },
        update(values: any) {
          _rows = (_rows || []).map((r: any) => ({ ...r, ...values }));
          demoStore[table] = _rows;
          return Promise.resolve({ data: _rows, error: null });
        },
        delete() {
          demoStore[table] = [];
          _rows = [];
          return Promise.resolve({ data: [], error: null });
        }
      };
      return builder;
    };

    // Basic auth shim
    const authShim = {
      async signInWithPassword({ email }: { email: string; password?: string }) {
        const user = demoStore.users.find((u: any) => u.email === email) || null;

        if (user) {
          demoStore.currentUser = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            user_metadata: {
              full_name: user.full_name,
              role: user.role,
            },
          };

          const session = { user: demoStore.currentUser };
          demoAuthListeners.forEach((listener) => listener('SIGNED_IN', session));
          return { data: { user: demoStore.currentUser, session }, error: null };
        }

        return { data: { user: null, session: null }, error: { message: 'User not found' } };
      },
      async signUp({ email, options }: { email: string; options?: any }) {
        const fullName = options?.data?.full_name || email.split('@')[0];
        const role = options?.data?.role || 'customer';
        const user = {
          id: `u_${Date.now()}`,
          email,
          full_name: fullName,
          role,
          user_metadata: { full_name: fullName, role },
        };
        demoStore.users.push(user);
        demoStore.currentUser = user;
        const session = { user };
        demoAuthListeners.forEach((listener) => listener('SIGNED_IN', session));
        return { data: { user, session }, error: null };
      },
      async signOut() {
        demoStore.currentUser = null;
        demoAuthListeners.forEach((listener) => listener('SIGNED_OUT', null));
        return { error: null };
      },
      async getUser() {
        return { data: { user: demoStore.currentUser ?? null }, error: null };
      },
      async getSession() {
        return { data: { session: demoStore.currentUser ? { user: demoStore.currentUser } : null }, error: null };
      },
      onAuthStateChange(cb: any) {
        demoAuthListeners.push(cb);
        return {
          data: {
            subscription: {
              unsubscribe() {
                demoAuthListeners = demoAuthListeners.filter((listener) => listener !== cb);
              }
            }
          }
        };
      }
    };

    const demoClient: any = {
      from: (table: string) => makeQuery(table),
      auth: authShim,
      // convenience helpers used by some code paths
      rpc: async (_name: string, _args?: any) => ({ data: null, error: null }),
      storage: {
        from: () => ({ upload: async () => ({ data: null, error: null }) })
      }
    };

    // Expose as supabaseInstance (loose typing)
    supabaseInstance = demoClient as any;
    return supabaseInstance;
  }

  // Return existing instance immediately if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If initialization is in progress, return a promise (though we make it sync)
  if (initializationPromise) {
    throw new Error('Supabase client is being initialized');
  }

  console.log('🔧 Creating Supabase client...');
  console.log('🔗 Supabase URL:', supabaseUrl);
  console.log('🔑 Anon Key:', publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : 'MISSING');
  
  // Create client with optimized settings to prevent AbortError
  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      storageKey: 'sunest-auto-auth-v1',
    },
    global: {
      headers: {
        'X-Client-Info': 'sunest-auto@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  console.log('✅ Supabase client created successfully');
  return supabaseInstance;
}

// Get existing instance without creating new one
export function getClient(): SupabaseClient | null {
  return supabaseInstance;
}

// Reset instance (for testing or hot reload)
export function resetClient() {
  if (supabaseInstance) {
    // Clean up existing instance
    try {
      // Supabase doesn't have a formal cleanup method, but we can nullify
      supabaseInstance = null;
    } catch (error) {
      // Silent cleanup
    }
  }
  initializationPromise = null;
}