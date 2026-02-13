import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      // redirect handled in useEffect below via auth state
    } catch {
      toast.error('Invalid email or password');
    }
  };

  // Redirect once authenticated
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    const dest = user.role === 'lecturer' ? '/lecturer' : '/student';
    navigate(dest, { replace: true });
  }

  return (
    <div className="min-h-screen bg-vpl-dark flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono text-lg">{`>`}</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">VPL.system</span>
          </Link>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6 border border-white/10">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@babcock.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
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
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>

          {/* Quick-login hint */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground font-mono">
            <p className="text-primary font-semibold mb-1">Demo accounts:</p>
            <p>Student: alex.chen@babcock.edu.ng</p>
            <p>Lecturer: anderson@babcock.edu.ng</p>
            <p className="mt-1 text-[10px]">Any password works in demo mode</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-black font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
