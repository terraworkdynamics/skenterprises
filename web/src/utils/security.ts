// Security utilities for production deployment
export class SecurityManager {
  private static instance: SecurityManager
  private readonly isProduction = import.meta.env.VITE_APP_ENV === 'production'

  private constructor() {
    this.setupSecurityHeaders()
    this.setupCSP()
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  private setupSecurityHeaders() {
    if (typeof window !== 'undefined' && this.isProduction) {
      // Add security headers via meta tags
      const metaTags = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' }
      ]

      metaTags.forEach(tag => {
        if (!document.querySelector(`meta[name="${tag.name}"]`)) {
          const meta = document.createElement('meta')
          meta.name = tag.name
          meta.content = tag.content
          document.head.appendChild(meta)
        }
      })
    }
  }

  private setupCSP() {
    if (typeof window !== 'undefined' && this.isProduction) {
      // Mirror index.html CSP, allowing Google Fonts
      const csp = "default-src 'self'; script-src 'self' 'unsafe-eval' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data: https://fonts.gstatic.com blob:; object-src 'none'; base-uri 'self'; upgrade-insecure-requests";

      const existing = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement | null
      if (existing) {
        existing.content = csp
      } else {
        const meta = document.createElement('meta')
        meta.httpEquiv = 'Content-Security-Policy'
        meta.content = csp
        document.head.appendChild(meta)
      }
    }
  }

  public sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .slice(0, 1000) // Limit length
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  public validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  public generateSecureToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  public hashPassword(password: string): Promise<string> {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
      })
  }

  public isSecureContext(): boolean {
    return window.isSecureContext
  }

  public getSecurityInfo() {
    return {
      isProduction: this.isProduction,
      isSecureContext: this.isSecureContext(),
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }
  }
}

export const securityManager = SecurityManager.getInstance()
