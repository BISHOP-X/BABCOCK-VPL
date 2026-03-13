import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const DEMO_ACCOUNTS = {
  student: {
    email: 'alex.chen@babcock.edu.ng',
    password: 'Test1234!',
  },
  lecturer: {
    email: 'anderson@babcock.edu.ng',
    password: 'Test1234!',
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login, logout, isLoading, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillDemoAccount = (type: 'student' | 'lecturer') => {
    setEmail(DEMO_ACCOUNTS[type].email);
    setPassword(DEMO_ACCOUNTS[type].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const allowedEmails = [DEMO_ACCOUNTS.student.email, DEMO_ACCOUNTS.lecturer.email];
    const isAllowedDemoLogin =
      allowedEmails.includes(normalizedEmail) && password === DEMO_ACCOUNTS.student.password;

    if (!isAllowedDemoLogin) {
      toast.error('Demo mode: you must use the provided demo credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      const role = await login({ email: normalizedEmail, password });
      toast.success('Welcome back!');
      navigate(role === 'lecturer' ? '/lecturer' : '/student', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If AuthContext is still fetching initial session, show a spinner instead of form.
  if (isLoading) {
    return (
      <div className="h-dvh bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // If already logged in, give them the option to go to dashboard or sign out.
  if (isAuthenticated && user) {
    return (
      <div className="h-dvh bg-background flex flex-col items-center justify-center px-4 sm:px-6 relative">
        <div className="w-full max-w-sm space-y-5 text-center relative z-10 glass-card p-8 rounded-2xl border border-border">
          <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xl font-bold text-primary mx-auto">
            {user.full_name?.charAt(0) ?? '?'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Already signed in</h2>
            <p className="text-sm text-muted-foreground mt-1">You are logged in as <span className="text-foreground font-medium">{user.full_name}</span></p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90" onClick={() => navigate(user.role === 'lecturer' ? '/lecturer' : '/student', { replace: true })}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full h-11" onClick={async () => { await logout(); }}>
              Sign Out &amp; Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-background flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-5 sm:space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono">{`>`}</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">BUCODeL VPL</span>
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-7 space-y-4 border border-border">
          <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 dark:text-amber-300">
            Demo mode is active. You must use the demo credentials below to sign in.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs"
              onClick={() => fillDemoAccount('student')}
            >
              Use Student Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs"
              onClick={() => fillDemoAccount('lecturer')}
            >
              Use Lecturer Demo
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@babcock.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-muted/50 border-border focus:border-primary text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-muted/50 border-border focus:border-primary text-sm"
            />
          </div>

          {/* Demo credentials hint */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-[11px] text-muted-foreground font-mono leading-relaxed">
            <p className="text-primary font-semibold mb-1">Demo Accounts</p>
            <p><span className="text-foreground">Student:</span> alex.chen@babcock.edu.ng</p>
            <p><span className="text-foreground">Lecturer:</span> anderson@babcock.edu.ng</p>
            <p className="mt-0.5"><span className="text-foreground">Password:</span> Test1234!</p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Account creation is temporarily disabled in demo mode.{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;