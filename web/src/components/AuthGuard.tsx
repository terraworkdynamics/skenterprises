import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authManager } from '../utils/auth'
import type { AuthState } from '../utils/auth'
import { debugAuth } from '../utils/debug'
import { isSupabaseConfigured } from '../utils/supabase'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  useEffect(() => {
    debugAuth.logAuthState(authState)
    
    // If Supabase is not configured, allow access to all routes
    if (!isSupabaseConfigured) {
      debugAuth.log('Supabase not configured, allowing access to all routes')
      return
    }
    
    // Only proceed if not loading
    if (authState.loading) {
      debugAuth.log('Auth is still loading, waiting...')
      return
    }

    // Check if user has valid session (both user and session must exist)
    const isAuthenticated = authState.user && authState.session && !authState.error
    
    debugAuth.log(`Authentication check: isAuthenticated=${isAuthenticated}, pathname=${location.pathname}`)

    // If user is authenticated and on login page, redirect to dashboard
    if (isAuthenticated && location.pathname === '/login') {
      debugAuth.log('User is authenticated and on login page, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
    
    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && location.pathname !== '/') {
      const protectedRoutes = ['/dashboard', '/register', '/payment', '/lucky-draw', '/due-list', '/monthwise-due', '/laptop', '/inverter', '/camera']
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route))
      
      if (isProtectedRoute) {
        debugAuth.log(`User not authenticated, redirecting to login from ${location.pathname}`)
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        })
      }
    }
  }, [authState.user, authState.session, authState.loading, authState.error, location.pathname, navigate])

  // Show loading state while checking authentication
  if (authState.loading) {
    return null // Let the individual components handle their own loading states
  }

  return <>{children}</>
}
