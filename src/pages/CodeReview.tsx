import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { getSubmissionById, gradeSubmission } from '@/services/mockApi';
import type { SubmissionWithDetails, Grade } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, CheckCircle2, Clock, Star, FileText, Send,
} from 'lucide-react';

const langMap: Record<string, string> = { python: 'python', java: 'java', cpp: 'cpp' };

const CodeReview = () => {
  const { submissionId } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [data, setData] = useState<SubmissionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [savedGrade, setSavedGrade] = useState<Grade | null>(null);

  useEffect(() => {
    async function load() {
      if (!submissionId) return;
      const sub = await getSubmissionById(submissionId);
      setData(sub);
      if (sub?.grade) {
        setScore(sub.grade.score.toString());
        setFeedback(sub.grade.feedback);
        setSavedGrade(sub.grade);
      }
      setLoading(false);
    }
    load();
  }, [submissionId]);

  const handleGrade = async () => {
    if (!data || !user) return;
    const numScore = parseInt(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) return;

    setGrading(true);
    const grade = await gradeSubmission(data.id, numScore, feedback.trim(), user.id);
    setSavedGrade(grade);
    setGrading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <FileText className="w-10 h-10 mb-3 opacity-40" />
          <p>Submission not found</p>
          <Link to="/lecturer">
            <Button variant="outline" className="mt-4 border-border">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const alreadyGraded = !!savedGrade;
  const validScore = score !== '' && !isNaN(parseInt(score)) && parseInt(score) >= 0 && parseInt(score) <= 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <Link
            to={`/lecturer/courses/${data.assignment.course_id}?tab=submissions`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Submissions
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Code Review</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.student.full_name} &middot; {data.assignment.title} &middot; Week {data.assignment.week_number}
              </p>
            </div>

            {alreadyGraded ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Graded — {savedGrade!.score}/100
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> Ungraded
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-card/50 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Student Code</span>
                <span className="text-[10px] font-mono text-primary">{data.language}</span>
              </div>
              <Editor
                height="420px"
                language={langMap[data.language] ?? data.language}
                value={data.code}
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  padding: { top: 12 },
                  domReadOnly: true,
                }}
              />
            </div>

            {/* Output */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2 bg-card/50 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Program Output</span>
              </div>
              <div className="vpl-terminal-bg p-4 font-mono text-xs text-foreground/80 whitespace-pre-wrap min-h-[60px]">
                {data.output || '(No output)'}
              </div>
            </div>
          </div>

          {/* Sidebar — Assignment Info + Grading */}
          <div className="space-y-4">
            {/* Student Info */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Student</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {data.student.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{data.student.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">{data.student.matric_number}</p>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Assignment Tasks</h3>
              <div className="space-y-2">
                {data.assignment.tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{task.description}</span>
                  </div>
                ))}
              </div>
              {data.assignment.expected_output && (
                <div className="mt-3 p-2 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1 font-medium">Expected Output</p>
                  <p className="text-xs font-mono text-foreground/70">{data.assignment.expected_output}</p>
                </div>
              )}
            </div>

            {/* Grading Form */}
            <div className={`rounded-xl border p-4 ${alreadyGraded ? 'border-green-500/20 bg-green-500/5' : 'border-primary/20 bg-primary/5'}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                style={{ color: alreadyGraded ? '#4ade80' : 'hsl(var(--primary))' }}>
                <Star className="w-3.5 h-3.5" /> {alreadyGraded ? 'Grade Assigned' : 'Assign Grade'}
              </h3>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Score (0–100)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    disabled={alreadyGraded}
                    className="mt-1.5 bg-muted/50 border-border"
                    placeholder="e.g. 85"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Feedback</Label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={alreadyGraded}
                    rows={3}
                    placeholder="Write feedback for the student..."
                    className="mt-1.5 w-full rounded-md bg-muted/50 border border-border text-sm text-foreground px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                  />
                </div>

                {!alreadyGraded && (
                  <Button
                    onClick={handleGrade}
                    disabled={!validScore || grading}
                    className="w-full gap-1.5 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {grading ? 'Submitting...' : 'Submit Grade'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReview;
