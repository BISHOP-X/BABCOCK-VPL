import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import { getCourseById, getAssignmentsWithStatus } from '@/services/mockApi';
import type { CourseWithLecturer, AssignmentWithStatus } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, Play, FileText, ChevronRight, ArrowLeft } from 'lucide-react';

const statusConfig = {
  not_started: { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted/50 border-border', icon: FileText },
  in_progress: { label: 'In Progress', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Play },
  submitted:   { label: 'Submitted',   color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  graded:      { label: 'Graded',      color: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
  overdue:     { label: 'Overdue',     color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertCircle },
};

const langColor: Record<string, string> = {
  python: 'text-yellow-500 dark:text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  java: 'text-orange-500 dark:text-orange-400 bg-orange-400/10 border-orange-400/20',
  cpp: 'text-blue-500 dark:text-blue-400 bg-blue-400/10 border-blue-400/20',
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseWithLecturer | null>(null);
  const [assignments, setAssignments] = useState<AssignmentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!courseId || !user) return;
      const [crs, asgns] = await Promise.all([
        getCourseById(courseId),
        getAssignmentsWithStatus(courseId, user.id),
      ]);
      setCourse(crs);
      setAssignments(asgns);
      setLoading(false);
    }
    load();
  }, [courseId, user]);

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

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <p>Course not found</p>
          <Link to="/student"><Button variant="outline" className="mt-4 border-border">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const graded = assignments.filter((a) => a.status === 'graded');
  const avgGrade = graded.length > 0
    ? Math.round(graded.reduce((s, a) => s + (a.grade?.score ?? 0), 0) / graded.length)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Course Header */}
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <Link to="/student" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${langColor[course.language]}`}>
                  {course.language}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{course.code}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">{course.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {course.lecturer.full_name} &middot; {course.semester}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                <p className="text-lg font-bold text-foreground">{assignments.length}</p>
                <p className="text-muted-foreground">Assignments</p>
              </div>
              <div className="text-center px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                <p className="text-lg font-bold text-foreground">{graded.length}</p>
                <p className="text-muted-foreground">Graded</p>
              </div>
              {avgGrade !== null && (
                <div className="text-center px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-lg font-bold text-primary">{avgGrade}%</p>
                  <p className="text-muted-foreground">Average</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Assignments List */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Weekly Assignments</h2>

        <div className="space-y-3">
          {assignments.map((asg) => {
            const cfg = statusConfig[asg.status] ?? statusConfig.not_started;
            const StatusIcon = cfg.icon;
            const dueDate = new Date(asg.due_date);
            const isGraded = asg.status === 'graded';

            return (
              <div
                key={asg.id}
                className="group rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  {/* Week badge */}
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted/50 border border-border flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase text-muted-foreground leading-none">Week</span>
                    <span className="text-sm sm:text-base font-bold text-foreground">{asg.week_number}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{asg.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      <span>{asg.tasks.length} tasks</span>
                      <span>&middot;</span>
                      <span>Due {dueDate.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Status + Grade */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {isGraded && asg.grade && (
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-green-500 dark:text-green-400">{asg.grade.score}/100</p>
                      </div>
                    )}
                    <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">{cfg.label}</span>
                    </span>

                    {/* Action */}
                    {isGraded && asg.submission ? (
                      <Link to={`/student/submission/${asg.submission.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                          View <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </Link>
                    ) : asg.status === 'submitted' && asg.submission ? (
                      <Link to={`/student/submission/${asg.submission.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                          View <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/lab/${courseId}/${asg.id}`}>
                        <Button size="sm" className="h-7 px-3 text-xs bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                          Open Lab
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Expanded grade feedback for graded items */}
                {isGraded && asg.grade?.feedback && (
                  <div className="px-4 pb-3 pt-0">
                    <div className="ml-14 p-2 rounded-lg bg-green-500/5 border border-green-500/10 text-xs text-muted-foreground">
                      <span className="text-green-500 dark:text-green-400 font-medium">Feedback:</span> {asg.grade.feedback}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
