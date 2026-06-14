// src/token-manager.jsx — JWT token lifecycle management

class TokenManager {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.refreshTimer = null;
    this.onTokenExpired = null;

    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = JSON.parse(sessionStorage.getItem('manju-tokens') || '{}');
      this.accessToken = stored.accessToken || null;
      this.refreshToken = stored.refreshToken || null;
      this.expiresAt = stored.expiresAt ? new Date(stored.expiresAt) : null;

      if (this.accessToken && this.expiresAt) {
        this.scheduleRefresh();
      }
    } catch (e) {
      console.warn('[TokenManager] Failed to load tokens from storage', e);
    }
  }

  store(accessToken, refreshToken, expiresAt) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = new Date(expiresAt);

    try {
      sessionStorage.setItem('manju-tokens', JSON.stringify({
        accessToken,
        refreshToken,
        expiresAt: this.expiresAt.toISOString(),
      }));
    } catch (e) {
      console.warn('[TokenManager] Failed to store tokens', e);
    }

    this.scheduleRefresh();
  }

  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    sessionStorage.removeItem('manju-tokens');
    this.clearRefreshTimer();
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  isTokenExpired() {
    if (!this.expiresAt) return true;
    return new Date() >= this.expiresAt;
  }

  isTokenExpiringSoon(minutesAhead = 5) {
    if (!this.expiresAt) return true;
    const expiryBuffer = new Date(this.expiresAt.getTime() - minutesAhead * 60000);
    return new Date() >= expiryBuffer;
  }

  async refreshAccessToken(apiBaseUrl = '') {
    if (!this.refreshToken) {
      this.onTokenExpired?.();
      return false;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clear();
          this.onTokenExpired?.();
        }
        return false;
      }

      const data = await response.json();
      // Assume 1 hour expiry if not provided
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      this.store(data.accessToken, this.refreshToken, expiresAt);
      return true;
    } catch (error) {
      console.error('[TokenManager] Refresh failed:', error);
      return false;
    }
  }

  scheduleRefresh() {
    this.clearRefreshTimer();

    if (!this.expiresAt) return;

    // Refresh 5 minutes before expiry
    const refreshTime = this.expiresAt.getTime() - 5 * 60 * 1000 - Date.now();
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(
        () => this.refreshAccessToken(''),
        refreshTime
      );
    }
  }

  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  destroy() {
    this.clearRefreshTimer();
  }
}

// Global singleton
window.tokenManager = new TokenManager();
