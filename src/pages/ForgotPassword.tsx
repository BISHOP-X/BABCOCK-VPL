import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 2 this will call Supabase auth.resetPasswordForEmail()
    setSubmitted(true);
    toast.success('If that email exists, a reset link has been sent.');
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
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {submitted ? (
          <div className="glass-card rounded-2xl p-8 border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              If an account exists for <span className="text-primary">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4 border-white/10 hover:bg-white/10">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6 border border-white/10">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>

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

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-black font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            >
              Send Reset Link
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
