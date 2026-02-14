import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus } from 'lucide-react';
import type { ProgrammingLanguage } from '@/types';

const languages: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    code: '',
    language: 'python' as ProgrammingLanguage,
    description: '',
    semester: '2025/2026 - First Semester',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate creation (mock — no persistence)
    await new Promise((r) => setTimeout(r, 600));

    // Navigate back to dashboard
    navigate('/lecturer');
  };

  const valid = form.title.trim() && form.code.trim() && form.description.trim();

  return (
    <div className="min-h-screen bg-vpl-dark text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-2xl">
        <Link
          to="/lecturer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold mb-1">Create New Course</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Set up a programming course for your students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Course Code</Label>
              <Input
                value={form.code}
                onChange={(e) => set('code', e.target.value)}
                placeholder="e.g. CS101"
                className="mt-1.5 bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Language</Label>
              <select
                value={form.language}
                onChange={(e) => set('language', e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md bg-white/5 border border-white/10 text-sm text-white px-3"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value} className="bg-vpl-dark">{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Course Title</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Introduction to Python Programming"
              className="mt-1.5 bg-white/5 border-white/10"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief course description..."
              rows={3}
              className="mt-1.5 w-full rounded-md bg-white/5 border border-white/10 text-sm text-white px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Semester</Label>
            <Input
              value={form.semester}
              onChange={(e) => set('semester', e.target.value)}
              className="mt-1.5 bg-white/5 border-white/10"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Link to="/lecturer">
              <Button type="button" variant="ghost" className="text-xs">Cancel</Button>
            </Link>
            <Button type="submit" disabled={!valid || submitting} className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
