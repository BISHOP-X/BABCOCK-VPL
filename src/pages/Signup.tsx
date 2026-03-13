import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
  const { signup, logout, isLoading, isAuthenticated, user } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [matricNumber, setMatricNumber] = useState('');
  const [staffId, setStaffId] = useState('');
  const [level, setLevel] = useState<StudentLevel>('100');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fullName = [firstName, middleName, lastName]
        .map((name) => name.trim())
        .filter(Boolean)
        .join(' ');

      const roleFromSignup = await signup({
        email,
        password,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        full_name: fullName,
        role,
        department: 'Computer Science',
        ...(role === 'student' ? { matric_number: matricNumber, level } : { staff_id: staffId }),
      });
      toast.success('Account created successfully!');
      navigate(roleFromSignup === 'lecturer' ? '/lecturer' : '/student', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed. Try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-dvh bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

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
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-5 sm:space-y-6">
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono">{`>`}</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">BUCODeL VPL</span>
          </Link>
          <p className="text-sm text-muted-foreground">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-7 space-y-5 border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-muted/50 border-border text-sm h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="middleName" className="text-xs">Middle Name</Label>
              <Input id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="bg-muted/50 border-border text-sm h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="bg-muted/50 border-border text-sm h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-muted/50 border-border text-sm h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">I am a</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`relative flex items-center justify-center px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${role === 'student' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted text-muted-foreground'}`}>
                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="sr-only" />
                <span className="text-sm font-medium">Student</span>
              </label>
              <label className={`relative flex items-center justify-center px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${role === 'lecturer' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted text-muted-foreground'}`}>
                <input type="radio" name="role" value="lecturer" checked={role === 'lecturer'} onChange={() => setRole('lecturer')} className="sr-only" />
                <span className="text-sm font-medium">Lecturer</span>
              </label>
            </div>
          </div>

          {role === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <Label htmlFor="matric" className="text-xs">Matric Number</Label>
                <Input id="matric" placeholder="20/0001" value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} required className="bg-muted/50 border-border text-sm h-10" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="level" className="text-xs">Level</Label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value as StudentLevel)} className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  {STUDENT_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value} className="bg-background text-foreground">{lvl.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <Label htmlFor="staffId" className="text-xs">Staff ID</Label>
              <Input id="staffId" placeholder="BU/1234" value={staffId} onChange={(e) => setStaffId(e.target.value)} required className="bg-muted/50 border-border text-sm h-10" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="bg-muted/50 border-border text-sm h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs">Confirm Password</Label>
              <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="bg-muted/50 border-border text-sm h-10" />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20">
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;