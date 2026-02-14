import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Navbar from '@/components/Navbar';
import { getSubmissionById } from '@/services/mockApi';
import type { SubmissionWithDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Star, FileText } from 'lucide-react';

const langMap: Record<string, string> = { python: 'python', java: 'java', cpp: 'cpp' };

const SubmissionView = () => {
  const { submissionId } = useParams();
  const [data, setData] = useState<SubmissionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!submissionId) return;
      const sub = await getSubmissionById(submissionId);
      setData(sub);
      setLoading(false);
    }
    load();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-vpl-dark">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-vpl-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <FileText className="w-10 h-10 mb-3 opacity-40" />
          <p>Submission not found</p>
          <Link to="/student"><Button variant="outline" className="mt-4 border-white/10">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const graded = !!data.grade;
  const submitDate = new Date(data.submitted_at);

  return (
    <div className="min-h-screen bg-vpl-dark text-foreground">
      <Navbar />

      {/* Header */}
      <header className="border-b border-white/10 bg-vpl-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <Link
            to={`/student/courses/${data.assignment.course_id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assignments
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{data.assignment.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Week {data.assignment.week_number} &middot; Submitted {submitDate.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            {graded ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{data.grade!.score}<span className="text-sm text-muted-foreground">/100</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> Awaiting Grade
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-vpl-card/50 border-b border-white/10">
                <span className="text-xs font-medium text-muted-foreground">Submitted Code</span>
                <span className="text-[10px] font-mono text-primary">{data.language}</span>
              </div>
              <Editor
                height="400px"
                language={langMap[data.language] ?? data.language}
                value={data.code}
                theme="vs-dark"
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
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-2 bg-vpl-card/50 border-b border-white/10">
                <span className="text-xs font-medium text-muted-foreground">Program Output</span>
              </div>
              <div className="bg-black/40 p-4 font-mono text-xs text-white/80 whitespace-pre-wrap min-h-[80px]">
                {data.output || '(No output)'}
              </div>
            </div>
          </div>

          {/* Sidebar — Grade Details */}
          <div className="space-y-4">
            {/* Assignment Info */}
            <div className="rounded-xl border border-white/10 bg-vpl-card/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Assignment Details</h3>
              <p className="text-sm text-white/80 mb-3">{data.assignment.description}</p>
              <div className="space-y-2">
                {data.assignment.tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{task.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Card */}
            {graded && data.grade && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-3 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Grade
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-green-400">{data.grade.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                {data.grade.feedback && (
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Feedback</p>
                    <p className="text-sm text-white/80">{data.grade.feedback}</p>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Graded {new Date(data.grade.graded_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                </p>
              </div>
            )}

            {!graded && (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-yellow-400">Pending Review</p>
                <p className="text-xs text-muted-foreground mt-1">Your lecturer will review and grade your submission.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionView;
