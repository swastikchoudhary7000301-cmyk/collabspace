import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface AuthViewProps {
  mode: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode }) => {
  const { navigate, currentWorkspace, showToast, login, register } = useWorkspace();

  const [email, setEmail] = useState('swastik@collabspace.internal');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('Swastik K.');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, name });
      }
      navigate(`/workspaces/${currentWorkspace.id}`);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('swastik@collabspace.internal', 'password123');
      navigate(`/workspaces/${currentWorkspace.id}`);
    } catch {
      showToast('Signed in with Demo profile');
      navigate(`/workspaces/${currentWorkspace.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotPasswordOpen(false);
    showToast(`Password recovery link sent to ${forgotEmail}`);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandLogo size="lg" onClick={() => navigate('/')} />
        </div>

        <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
          {mode === 'login' ? 'Sign in to workstation' : 'Create your CollabSpace account'}
        </h2>
        <p className="mt-1 text-xs text-[#57534E]">
          {mode === 'login' ? (
            <>
              Don't have an account yet?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold text-[#18181B] hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-[#18181B] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-6 px-6 sm:px-8 rounded-lg border border-[#E2DFD7] shadow-2xs">
          {/* Quick Demo Bypass */}
          <div className="mb-4 p-2.5 bg-[#FAF9F7] border border-[#E2DFD7] rounded flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#18181B]">Demo Workspace Access</div>
              <div className="text-[11px] text-[#57534E]">Authenticated as Lead Architect</div>
            </div>
            <Button
              variant="primary"
              size="xs"
              onClick={handleDemoLogin}
            >
              Demo Login
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swastik K."
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#18181B] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.internal"
                className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#18181B]">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] text-[#57534E] hover:text-[#18181B] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>
            )}

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#57534E]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-1.5"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E2DFD7]">
            <div className="text-[10px] text-center text-[#8A857D] uppercase font-bold tracking-wider mb-2.5">
              Enterprise SSO
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  showToast('Google Workspace SSO verified');
                  navigate(`/workspaces/${currentWorkspace.id}`);
                }}
                className="p-1.5 border border-[#E2DFD7] rounded text-[#18181B] hover:bg-[#F6F5F2] font-medium text-center cursor-pointer transition-colors"
              >
                Google Workspace
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('GitHub Org SSO verified');
                  navigate(`/workspaces/${currentWorkspace.id}`);
                }}
                className="p-1.5 border border-[#E2DFD7] rounded text-[#18181B] hover:bg-[#F6F5F2] font-medium text-center cursor-pointer transition-colors"
              >
                GitHub Org
              </button>
            </div>
          </div>
        </div>
      </div>

      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-2xs">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 border border-[#E2DFD7] shadow-xl">
            <h3 className="text-sm font-bold text-[#18181B]">Reset Password</h3>
            <p className="text-xs text-[#57534E] mt-1">
              Enter your work email and we will send a recovery token.
            </p>
            <form onSubmit={handleForgotPassword} className="mt-3 space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.internal"
                className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="xs" type="button" onClick={() => setForgotPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="xs" type="submit">
                  Send Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
