import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

/**
 * Demo accounts seeded on the backend — all share the password `demo1234`.
 */
const DEMO_ACCOUNTS = [
  {
    label: 'Elena Rostova',
    hint: 'Alpine Guide',
    email: 'elena.rostova@explorer.org',
  },
  {
    label: 'Mateo Silva',
    hint: 'Coastal Scout',
    email: 'mateo.silva@wanderlust.net',
  },
  {
    label: 'Amina Kassam',
    hint: 'Heritage Chronicler',
    email: 'amina.k@atlasvoyager.io',
  },
] as const;

interface FormErrors {
  email?: string;
  password?: string;
}

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already signed in — send the user where they intended to go
  const from = (location.state as { from?: string } | null)?.from ?? '/profile';
  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!password) {
      next.password = 'Password is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast('Welcome Back', 'Signed in to your explorer account.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed.';
      setSubmitError(message.includes('401') ? 'Invalid email or password.' : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Quick-login with one of the seeded demo explorer accounts. */
  const handleDemoLogin = async (demoEmail: string) => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await login(demoEmail, 'demo1234');
      showToast('Demo Account', `Signed in as ${demoEmail}`, 'info');
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    borderRadius: 'var(--radius-md)',
    border: `1.5px solid ${hasError ? '#B91C1C' : 'var(--color-border)'}`,
    backgroundColor: 'var(--bg-app)',
    fontSize: '0.95rem',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  });

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Compass size={28} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Welcome Back, Explorer
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Sign in to save hidden gems, submit discoveries, and manage your atlas.
          </p>
        </div>

        {/* Sign In Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: '2.25rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {submitError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                backgroundColor: 'var(--color-error-bg)',
                border: '1px solid #FECACA',
                color: 'var(--color-error)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
              role="alert"
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="signin-email"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle(errors.email)}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#B91C1C', fontSize: '0.8125rem', marginTop: '0.4rem' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor="signin-password"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle(errors.password)}
                />
              </div>
              {errors.password && (
                <p style={{ color: '#B91C1C', fontSize: '0.8125rem', marginTop: '0.4rem' }}>
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              disabled={isSubmitting}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            New to HiddenAtlas?{' '}
            <Link
              to="/signup"
              style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Demo accounts */}
        <div
          style={{
            marginTop: '2rem',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
              marginBottom: '1rem',
            }}
          >
            <KeyRound size={14} />
            <span>Try a Demo Account</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => void handleDemoLogin(demo.email)}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--bg-surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
                }}
              >
                <span>
                  <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {demo.label}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {demo.hint} · {demo.email}
                  </span>
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-light)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Sparkles size={13} />
                  Sign in
                </span>
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            All demo accounts use the password <code style={{ fontWeight: 700 }}>demo1234</code>.
            Accounts are created automatically on the backend on first launch.
          </p>
        </div>
      </div>
    </div>
  );
};
