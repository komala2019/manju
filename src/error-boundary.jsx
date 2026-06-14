// src/error-boundary.jsx — React Error Boundary to catch crashes

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error Info:', errorInfo);

    // Optional: Send to error tracking service
    // trackErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--ink)',
          padding: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            padding: '40px',
            background: 'var(--surface)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h2 style={{ color: '#D92D20', marginTop: 0 }}>⚠️ Something went wrong</h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              The app encountered an unexpected error. Please try refreshing the page.
            </p>
            <details style={{
              marginTop: '20px',
              padding: '12px',
              background: '#fef3f2',
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#D92D20' }}>
                Error Details (for debugging)
              </summary>
              <pre style={{
                marginTop: '12px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px',
                color: '#666'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = window.location.origin;
                }}
                style={{
                  padding: '10px 20px',
                  background: 'var(--surface-2)',
                  color: 'var(--ink)',
                  border: '1px solid var(--rule)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Clear & Start Fresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
