// Frontend Session Debugging Utility
// Add this to your frontend to track session issues

class SessionDebugger {
  constructor() {
    this.debugLog = [];
    this.sessionHistory = [];
    this.cookieHistory = [];
    this.requestHistory = [];
  }

  // Log debug information
  log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.debugLog.push(logEntry);
    console.log(`🔍 [${timestamp}] ${message}`, data || '');
    
    // Also log to localStorage for persistence
    try {
      localStorage.setItem('sessionDebugLog', JSON.stringify(this.debugLog));
    } catch (e) {
      console.warn('Could not save debug log to localStorage:', e);
    }
  }

  // Track session ID changes
  trackSessionId(sessionId, source = 'unknown') {
    this.sessionHistory.push({
      timestamp: new Date().toISOString(),
      sessionId,
      source,
      url: window.location.href
    });
    
    this.log(`Session ID changed: ${sessionId} (source: ${source})`, {
      previousSessionId: this.sessionHistory.length > 1 ? this.sessionHistory[this.sessionHistory.length - 2].sessionId : 'none',
      currentSessionId: sessionId,
      totalChanges: this.sessionHistory.length
    });
  }

  // Track cookie changes
  trackCookies() {
    const cookies = document.cookie;
    const sessionCookie = this.extractSessionCookie(cookies);
    
    this.cookieHistory.push({
      timestamp: new Date().toISOString(),
      allCookies: cookies,
      sessionCookie,
      url: window.location.href
    });
    
    this.log('Cookies tracked', {
      allCookies: cookies,
      sessionCookie: sessionCookie ? sessionCookie.substring(0, 20) + '...' : 'none',
      cookieCount: cookies.split(';').length
    });
  }

  // Extract session cookie
  extractSessionCookie(cookieString) {
    const match = cookieString.match(/easyearn\.sid=([^;]+)/);
    return match ? match[1] : null;
  }

  // Track API requests
  trackRequest(url, method, headers, body = null) {
    const request = {
      timestamp: new Date().toISOString(),
      url,
      method,
      headers,
      body,
      cookies: document.cookie,
      sessionCookie: this.extractSessionCookie(document.cookie)
    };
    
    this.requestHistory.push(request);
    
    this.log(`API Request: ${method} ${url}`, {
      hasCookies: !!document.cookie,
      sessionCookie: request.sessionCookie ? request.sessionCookie.substring(0, 20) + '...' : 'none',
      origin: headers?.origin || 'none',
      contentType: headers?.['content-type'] || 'none'
    });
  }

  // Track API responses
  trackResponse(url, status, data, headers) {
    const response = {
      timestamp: new Date().toISOString(),
      url,
      status,
      data,
      headers,
      cookies: document.cookie,
      sessionCookie: this.extractSessionCookie(document.cookie)
    };
    
    this.log(`API Response: ${status} ${url}`, {
      status,
      hasData: !!data,
      dataType: typeof data,
      hasCookies: !!document.cookie,
      sessionCookie: response.sessionCookie ? response.sessionCookie.substring(0, 20) + '...' : 'none',
      setCookieHeaders: headers?.['set-cookie'] || 'none'
    });
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      this.log('Checking authentication status...');
      
      const response = await fetch('http://localhost:3005/me', { // Use full backend URL
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      this.log('Auth status check result', {
        status: response.status,
        authenticated: response.status === 200,
        data: data,
        cookies: document.cookie,
        sessionCookie: this.extractSessionCookie(document.cookie)
      });
      
      return { status: response.status, data, authenticated: response.status === 200 };
    } catch (error) {
      this.log('Auth status check failed', { error: error.message });
      return { status: 'error', error: error.message, authenticated: false };
    }
  }

  // Simulate page refresh
  async simulatePageRefresh() {
    this.log('Simulating page refresh...');
    
    // Store current state
    const beforeRefresh = {
      cookies: document.cookie,
      sessionCookie: this.extractSessionCookie(document.cookie),
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    this.log('State before refresh simulation', beforeRefresh);
    
    // Wait a bit to simulate time passing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check state after "refresh"
    const afterRefresh = {
      cookies: document.cookie,
      sessionCookie: this.extractSessionCookie(document.cookie),
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    this.log('State after refresh simulation', afterRefresh);
    
    // Compare
    const sessionChanged = beforeRefresh.sessionCookie !== afterRefresh.sessionCookie;
    const cookiesChanged = beforeRefresh.cookies !== afterRefresh.cookies;
    
    this.log('Refresh simulation analysis', {
      sessionChanged,
      cookiesChanged,
      beforeSession: beforeRefresh.sessionCookie ? beforeRefresh.sessionCookie.substring(0, 20) + '...' : 'none',
      afterSession: afterRefresh.sessionCookie ? afterRefresh.sessionCookie.substring(0, 20) + '...' : 'none'
    });
    
    return { sessionChanged, cookiesChanged, beforeRefresh, afterRefresh };
  }

  // Get debug summary
  getDebugSummary() {
    const summary = {
      totalLogs: this.debugLog.length,
      totalSessions: this.sessionHistory.length,
      totalCookies: this.cookieHistory.length,
      totalRequests: this.requestHistory.length,
      sessionChanges: this.sessionHistory.length > 1 ? this.sessionHistory.length - 1 : 0,
      lastSessionId: this.sessionHistory.length > 0 ? this.sessionHistory[this.sessionHistory.length - 1].sessionId : 'none',
      lastCookie: this.cookieHistory.length > 0 ? this.cookieHistory[this.cookieHistory.length - 1].sessionCookie : 'none',
      currentUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    this.log('Debug summary generated', summary);
    return summary;
  }

  // Export debug data
  exportDebugData() {
    const debugData = {
      summary: this.getDebugSummary(),
      logs: this.debugLog,
      sessions: this.sessionHistory,
      cookies: this.cookieHistory,
      requests: this.requestHistory
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(debugData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-debug-${new Date().toISOString()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    this.log('Debug data exported', { filename: link.download });
    return debugData;
  }

  // Clear debug data
  clearDebugData() {
    this.debugLog = [];
    this.sessionHistory = [];
    this.cookieHistory = [];
    this.requestHistory = [];
    
    try {
      localStorage.removeItem('sessionDebugLog');
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    this.log('Debug data cleared');
  }
}

// Create global instance
window.sessionDebugger = new SessionDebugger();

// Auto-track cookies on page load
document.addEventListener('DOMContentLoaded', () => {
  window.sessionDebugger.log('Page loaded, starting session debugging');
  window.sessionDebugger.trackCookies();
});

// Auto-track cookies on page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    window.sessionDebugger.log('Page became visible, tracking cookies');
    window.sessionDebugger.trackCookies();
  }
});

// Export for use in other files
export default window.sessionDebugger;
