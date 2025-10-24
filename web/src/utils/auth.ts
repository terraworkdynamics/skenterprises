import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    session: null,
    loading: true,
    error: null
  }
  private listeners: ((state: AuthState) => void)[] = []
  private sessionTimeout: number | null = null
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map()
  private readonly maxLoginAttempts = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5')
  private readonly lockoutDuration = parseInt(import.meta.env.VITE_LOCKOUT_DURATION || '900000') // 15 minutes
  private readonly sessionTimeoutDuration = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000') // 1 hour

  private constructor() {
    this.initializeAuth()
    this.setupVisibilityChangeListener()
    this.setupBeforeUnloadListener()
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  private async initializeAuth() {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        this.updateAuthState({ 
          error: 'Supabase configuration missing. Please set up your environment variables.', 
          loading: false 
        })
        return
      }

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        this.updateAuthState({ error: error.message, loading: false })
        return
      }

      // Validate session exists and is not expired
      if (session && session.expires_at) {
        const now = Math.floor(Date.now() / 1000)
        if (session.expires_at < now) {
          // Session expired, sign out
          await supabase.auth.signOut()
          this.updateAuthState({ 
            user: null, 
            session: null, 
            loading: false,
            error: 'Session expired. Please log in again.' 
          })
          return
        }
      }

      this.updateAuthState({ 
        user: session?.user || null, 
        session, 
        loading: false 
      })

      if (session) {
        this.startSessionTimeout()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          this.clearSessionTimeout()
          this.updateAuthState({ 
            user: null, 
            session: null, 
            loading: false,
            error: null 
          })
        } else if (event === 'SIGNED_IN' && session) {
          this.startSessionTimeout()
          this.updateAuthState({ 
            user: session.user, 
            session, 
            loading: false,
            error: null 
          })
        }
      })
    } catch (error) {
      this.updateAuthState({ 
        error: 'Authentication initialization failed', 
        loading: false 
      })
    }
  }

  private setupVisibilityChangeListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // User switched tabs or minimized window
        this.handleVisibilityChange()
      }
    })
  }

  private setupBeforeUnloadListener() {
    window.addEventListener('beforeunload', () => {
      this.handleWindowClose()
    })

    window.addEventListener('unload', () => {
      this.handleWindowClose()
    })
  }

  private handleVisibilityChange() {
    // Optional: Add additional security measures when user switches tabs
    // For now, we'll just log it
    console.log('User switched tabs - session remains active')
  }

  private handleWindowClose() {
    // Force logout when window is closed
    this.signOut()
  }

  private startSessionTimeout() {
    this.clearSessionTimeout()
    this.sessionTimeout = setTimeout(() => {
      this.signOut('Session expired due to inactivity')
    }, this.sessionTimeoutDuration)
  }

  private clearSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout)
      this.sessionTimeout = null
    }
  }

  private updateAuthState(updates: Partial<AuthState>) {
    this.authState = { ...this.authState, ...updates }
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState))
  }

  public subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  public getAuthState(): AuthState {
    return { ...this.authState }
  }

  public async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return {
          success: false,
          error: 'Supabase configuration missing. Please set up your environment variables.'
        }
      }

      // Check for brute force protection
      const clientId = this.getClientIdentifier()
      const attemptData = this.loginAttempts.get(clientId)
      
      if (attemptData) {
        const timeSinceLastAttempt = Date.now() - attemptData.lastAttempt
        if (attemptData.count >= this.maxLoginAttempts && timeSinceLastAttempt < this.lockoutDuration) {
          const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLastAttempt) / 60000)
          return {
            success: false,
            error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`
          }
        }
        
        // Reset attempts if lockout period has passed
        if (timeSinceLastAttempt >= this.lockoutDuration) {
          this.loginAttempts.delete(clientId)
        }
      }

      this.updateAuthState({ loading: true, error: null })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        // Record failed attempt
        this.recordFailedAttempt(clientId)
        this.updateAuthState({ 
          loading: false, 
          error: this.sanitizeErrorMessage(error.message) 
        })
        return { success: false, error: this.sanitizeErrorMessage(error.message) }
      }

      // Clear failed attempts on successful login
      this.loginAttempts.delete(clientId)
      
      this.updateAuthState({ 
        user: data.user, 
        session: data.session, 
        loading: false,
        error: null 
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      this.updateAuthState({ loading: false, error: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  public async signOut(reason?: string) {
    try {
      this.clearSessionTimeout()
      await supabase.auth.signOut()
      
      // Clear all stored data
      localStorage.removeItem('rememberEmail')
      sessionStorage.clear()
      
      this.updateAuthState({ 
        user: null, 
        session: null, 
        loading: false,
        error: reason || null 
      })
    } catch (error) {
      console.error('Sign out error:', error)
      // Force clear state even if signOut fails
      this.updateAuthState({ 
        user: null, 
        session: null, 
        loading: false,
        error: null 
      })
    }
  }

  public isAuthenticated(): boolean {
    return !!this.authState.user && !!this.authState.session && !this.authState.error
  }

  public getCurrentUser(): User | null {
    return this.authState.user
  }

  public getCurrentSession(): Session | null {
    return this.authState.session
  }

  private recordFailedAttempt(clientId: string) {
    const attemptData = this.loginAttempts.get(clientId) || { count: 0, lastAttempt: 0 }
    attemptData.count += 1
    attemptData.lastAttempt = Date.now()
    this.loginAttempts.set(clientId, attemptData)
  }

  private getClientIdentifier(): string {
    // Use a combination of user agent and screen resolution as client identifier
    const userAgent = navigator.userAgent
    const screenRes = `${screen.width}x${screen.height}`
    return btoa(userAgent + screenRes).slice(0, 16)
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove sensitive information from error messages
    return message
      .replace(/password/gi, 'credentials')
      .replace(/email/gi, 'account')
      .replace(/user/gi, 'account')
  }

  public resetSessionTimeout() {
    if (this.isAuthenticated()) {
      this.startSessionTimeout()
    }
  }

  public async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        this.signOut('Session refresh failed')
        return false
      }
      
      if (data.session) {
        this.startSessionTimeout()
        this.updateAuthState({ 
          user: data.user, 
          session: data.session,
          error: null 
        })
        return true
      }
      
      return false
    } catch (error) {
      this.signOut('Session refresh failed')
      return false
    }
  }

  public async validateSession(): Promise<boolean> {
    try {
      if (!this.authState.session) {
        return false
      }

      // Check if session is expired
      if (this.authState.session.expires_at) {
        const now = Math.floor(Date.now() / 1000)
        if (this.authState.session.expires_at < now) {
          this.signOut('Session expired')
          return false
        }
      }

      // Try to get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        this.signOut('Invalid session')
        return false
      }

      return true
    } catch (error) {
      this.signOut('Session validation failed')
      return false
    }
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance()
