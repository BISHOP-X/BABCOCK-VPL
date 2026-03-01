import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';
import type { StudentLevel } from '@/types';

const STUDENT_LEVELS: { value: StudentLevel; label: string }[] = [
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' },
  { value: '500', label: '500 Level' },
  { value: 'phd', label: 'PhD' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, isAuthenticated, user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [matricNumber, setMatricNumber] = useState('');
  const [staffId, setStaffId] = useState('');
  const [level, setLevel] = useState<StudentLevel>('100');

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'lecturer' ? '/lecturer' : '/student', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await signup({
        email,
        password,
        full_name: fullName,
        role,
        department: 'Computer Science',
        ...(role === 'student'
          ? { matric_number: matricNumber || undefined, level }
          : { staff_id: staffId || undefined }),
      });
      toast.success('Account created successfully!');
    } catch {
      toast.error('Signup failed. Try again.');
    }
  };

  return (
    <div className="h-dvh bg-background flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-4 sm:space-y-5">
        {/* Logo */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono">{`>`}</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">BUCODeL VPL</span>
          </Link>
          <p className="text-sm text-muted-foreground">Create a new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-7 space-y-3.5 border border-border">
          {/* Name & Email row on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Alex Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
              />
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
                className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <Label className="text-xs">I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                  role === 'student'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-border'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('lecturer')}
                className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                  role === 'lecturer'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-border'
                }`}
              >
                Lecturer
              </button>
            </div>
          </div>

          {/* Role-specific fields */}
          {role === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="matricNumber" className="text-xs">Matric Number</Label>
                <Input
                  id="matricNumber"
                  placeholder="20/0001"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="level" className="text-xs">Level</Label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as StudentLevel)}
                  className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {STUDENT_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="staffId" className="text-xs">Staff ID</Label>
              <Input
                id="staffId"
                placeholder="STAFF-001"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
              />
            </div>
          )}

          {/* Password row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-10 bg-muted/50 border-border focus:border-primary text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
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
