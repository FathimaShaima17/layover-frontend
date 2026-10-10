import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  User as UserIcon,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already signed in — nothing to sign up for
  const from = (location.state as { from?: string } | null)?.from ?? '/profile';
  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = 'Please enter your name (at least 2 characters).';
    }
    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters long.';
    }
    if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match.';
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
      await register(name.trim(), email.trim(), password);
      showToast('Account Created', 'Welcome to HiddenAtlas — happy exploring!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setSubmitError(message.includes('already exists') ? 'An account with this email already exists. Try signing in.' : message);
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
            Join HiddenAtlas
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Create a free account to bookmark hidden gems and share your own discoveries.
          </p>
        </div>

        {/* Sign Up Card */}
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
            {/* Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="signup-name"
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
                Explorer Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon
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
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Jordan Reyes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle(errors.name)}
                />
              </div>
              {errors.name && (
                <p style={{ color: '#B91C1C', fontSize: '0.8125rem', marginTop: '0.4rem' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="signup-email"
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
                  id="signup-email"
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
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="signup-password"
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
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor="signup-confirm"
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
                Confirm Password
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
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle(errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#B91C1C', fontSize: '0.8125rem', marginTop: '0.4rem' }}>
                  {errors.confirmPassword}
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
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              justifyContent: 'center',
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <ShieldCheck size={15} style={{ color: 'var(--color-primary-light)' }} />
            <span>
              Already have an account?{' '}
              <Link to="/signin" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
