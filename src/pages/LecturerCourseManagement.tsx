import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import {
  getCourseById,
  getAssignmentsForCourse,
  getStudentsForCourse,
  getSubmissionsForAssignment,
  getCourseStats,
} from '@/services/supabaseApi';
import type { CourseWithLecturer, Assignment, User, SubmissionWithDetails, CourseStats } from '@/types';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, BookOpen, Users, FileText, BarChart3,
  Plus, ChevronRight, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';

type Tab = 'assignments' | 'students' | 'submissions';

const LecturerCourseManagement = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'assignments';
  const setTab = (t: Tab) => setSearchParams({ tab: t });

  const [course, setCourse] = useState<CourseWithLecturer | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      try {
        const [crs, asgns, studs, cStats] = await Promise.all([
          getCourseById(courseId),
          getAssignmentsForCourse(courseId),
          getStudentsForCourse(courseId),
          getCourseStats(courseId),
        ]);
        setCourse(crs);
        setAssignments(asgns);
        setStudents(studs);
        setStats(cStats);
      } catch (err) {
        console.error('Failed to load course management:', err);
        setError('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  // Load submissions when assignment selected
  useEffect(() => {
    async function loadSubs() {
      if (!selectedAssignment) return;
      try {
        const subs = await getSubmissionsForAssignment(selectedAssignment);
        setSubmissions(subs);
      } catch (err) {
        console.error('Failed to load submissions:', err);
      }
    }
    loadSubs();
  }, [selectedAssignment]);

  // Auto-select first assignment for submissions tab
  useEffect(() => {
    if (activeTab === 'submissions' && !selectedAssignment && assignments.length > 0) {
      setSelectedAssignment(assignments[0].id);
    }
  }, [activeTab, assignments, selectedAssignment]);

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
          <Link to="/lecturer"><Button variant="outline" className="mt-4 border-border">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: 'assignments', label: 'Assignments', icon: FileText },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'submissions', label: 'Submissions', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <Link
            to="/lecturer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/10">
                  {course.language}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{course.code}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">{course.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{course.semester}</p>
            </div>

            {/* Quick Stats */}
            {stats && (
              <div className="flex items-center gap-3 text-xs">
                <div className="text-center px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                  <p className="text-lg font-bold text-foreground">{stats.total_students}</p>
                  <p className="text-muted-foreground">Students</p>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                  <p className="text-lg font-bold text-foreground">{stats.total_assignments}</p>
                  <p className="text-muted-foreground">Assignments</p>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-lg font-bold text-primary">{stats.average_score}%</p>
                  <p className="text-muted-foreground">Avg Score</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 -mb-px">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-t-lg border border-b-0 transition-colors ${
                    isActive
                      ? 'bg-background border-border text-foreground'
                      : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* =========== ASSIGNMENTS TAB =========== */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
              </h2>
              <Link to={`/lecturer/create-assignment/${courseId}`}>
                <Button size="sm" className="h-8 text-xs gap-1">
                  <Plus className="w-3.5 h-3.5" /> New Assignment
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => {
                const dueDate = new Date(asg.due_date);
                const isPast = dueDate < new Date();
                return (
                  <div
                    key={asg.id}
                    className="rounded-xl border border-border bg-card/50 p-4 flex items-center gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-muted/50 border border-border flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase text-muted-foreground leading-none">Wk</span>
                      <span className="text-sm font-bold text-foreground">{asg.week_number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{asg.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {asg.tasks.length} tasks &middot; Due {dueDate.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    {isPast ? (
                      <span className="text-[10px] text-red-500 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Past Due</span>
                    ) : (
                      <span className="text-[10px] text-green-500 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========== STUDENTS TAB =========== */}
        {activeTab === 'students' && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {students.length} Enrolled Student{students.length !== 1 ? 's' : ''}
            </h2>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card/50 text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left p-3">Student</th>
                    <th className="text-left p-3 hidden sm:table-cell">Matric No.</th>
                    <th className="text-left p-3 hidden md:table-cell">Department</th>
                    <th className="text-right p-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {s.full_name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-foreground font-medium">{s.full_name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell font-mono text-xs">{s.matric_number ?? '—'}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{s.department}</td>
                      <td className="p-3 text-right text-muted-foreground text-xs">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========== SUBMISSIONS TAB =========== */}
        {activeTab === 'submissions' && (
          <div>
            {/* Assignment selector */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground">Filter by:</span>
              {assignments.map((asg) => (
                <button
                  key={asg.id}
                  onClick={() => setSelectedAssignment(asg.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedAssignment === asg.id
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Wk {asg.week_number}
                </button>
              ))}
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No submissions for this assignment yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const graded = !!sub.grade;
                  return (
                    <div
                      key={sub.id}
                      className="rounded-xl border border-border bg-card/50 p-4 flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {sub.student.full_name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{sub.student.full_name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Submitted {new Date(sub.submitted_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      {graded ? (
                        <span className="text-sm font-bold text-green-500 dark:text-green-400">{sub.grade!.score}/100</span>
                      ) : (
                        <span className="text-[10px] text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Ungraded
                        </span>
                      )}
                      <Link to={`/lecturer/review/${sub.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                          Review <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LecturerCourseManagement;
