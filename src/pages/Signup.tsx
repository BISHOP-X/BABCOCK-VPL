import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, isAuthenticated, user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');

  if (isAuthenticated && user) {
    const dest = user.role === 'lecturer' ? '/lecturer' : '/student';
    navigate(dest, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await signup({ email, password, full_name: fullName, role });
      toast.success('Account created successfully!');
    } catch {
      toast.error('Signup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-vpl-dark flex items-center justify-center p-6">
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
          <p className="text-muted-foreground">Create a new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5 border border-white/10">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Alex Chen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>

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

          {/* Role selector */}
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                  role === 'student'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('lecturer')}
                className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                  role === 'lecturer'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                }`}
              >
                Lecturer
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-black font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
