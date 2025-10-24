// Debug utilities for authentication troubleshooting
export const debugAuth = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[AUTH DEBUG] ${message}`, data || '')
    }
  },
  
  logAuthState: (authState: any) => {
    if (import.meta.env.DEV) {
      console.log('[AUTH DEBUG] Current Auth State:', {
        hasUser: !!authState.user,
        hasSession: !!authState.session,
        hasError: !!authState.error,
        loading: authState.loading,
        isAuthenticated: authState.user && authState.session && !authState.error
      })
    }
  },
  
  logSessionDetails: (session: any) => {
    if (import.meta.env.DEV && session) {
      console.log('[AUTH DEBUG] Session Details:', {
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        isExpired: session.expires_at ? session.expires_at < Math.floor(Date.now() / 1000) : 'unknown'
      })
    }
  }
}
