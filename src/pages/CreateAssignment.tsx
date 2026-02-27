import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { createAssignment } from '@/services/supabaseApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskInput {
  description: string;
  hint: string;
}

const CreateAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    week_number: 1,
    due_date: '',
    expected_output: '',
  });

  const [tasks, setTasks] = useState<TaskInput[]>([{ description: '', hint: '' }]);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

  const addTask = () => setTasks((t) => [...t, { description: '', hint: '' }]);
  const removeTask = (i: number) => setTasks((t) => t.filter((_, idx) => idx !== i));
  const updateTask = (i: number, key: keyof TaskInput, value: string) =>
    setTasks((t) => t.map((task, idx) => (idx === i ? { ...task, [key]: value } : task)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSubmitting(true);
    
    try {
      await createAssignment({
        course_id: courseId,
        title: form.title,
        description: form.description,
        week_number: Number(form.week_number),
        due_date: form.due_date,
        tasks: tasks.filter(t => t.description.trim()).map((t, i) => ({
          id: `task-${i}`,
          description: t.description,
          hint: t.hint || undefined,
        })),
        expected_output: form.expected_output || undefined,
      });
      toast.success('Assignment created successfully!');
      navigate(`/lecturer/courses/${courseId}?tab=assignments`);
    } catch (error) {
      toast.error('Failed to create assignment');
      setSubmitting(false);
    }
  };

  const valid = form.title.trim() && form.due_date && tasks.some((t) => t.description.trim());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-2xl">
        <Link
          to={`/lecturer/courses/${courseId}?tab=assignments`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold mb-1">Create Assignment</h1>
        <p className="text-sm text-muted-foreground mb-6">Add a new weekly lab assignment for students.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Week Number</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={form.week_number}
                onChange={(e) => set('week_number', parseInt(e.target.value) || 1)}
                className="mt-1.5 bg-muted/50 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => set('due_date', e.target.value)}
                className="mt-1.5 bg-muted/50 border-border"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Variables & Data Types"
              className="mt-1.5 bg-muted/50 border-border"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What students will learn..."
              rows={2}
              className="mt-1.5 w-full rounded-md bg-muted/50 border border-border text-sm text-foreground px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs text-muted-foreground">Tasks</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addTask}>
                <Plus className="w-3 h-3" /> Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="rounded-lg border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Task {i + 1}</span>
                    {tasks.length > 1 && (
                      <button type="button" onClick={() => removeTask(i)} className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    value={task.description}
                    onChange={(e) => updateTask(i, 'description', e.target.value)}
                    placeholder="Task description..."
                    className="mb-2 bg-muted/50 border-border text-xs"
                  />
                  <Input
                    value={task.hint}
                    onChange={(e) => updateTask(i, 'hint', e.target.value)}
                    placeholder="Hint (optional)"
                    className="bg-muted/50 border-border text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Expected Output (optional)</Label>
            <textarea
              value={form.expected_output}
              onChange={(e) => set('expected_output', e.target.value)}
              placeholder="What the program should print..."
              rows={2}
              className="mt-1.5 w-full rounded-md bg-muted/50 border border-border text-sm text-foreground px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link to={`/lecturer/courses/${courseId}?tab=assignments`}>
              <Button type="button" variant="ghost" className="text-xs">Cancel</Button>
            </Link>
            <Button type="submit" disabled={!valid || submitting} className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              {submitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
