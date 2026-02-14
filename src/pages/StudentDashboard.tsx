
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import { getEnrollmentsForStudent, getAssignmentsWithStatus } from '@/services/mockApi';
import type { EnrollmentWithCourse, AssignmentWithStatus } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Terminal, Clock, BookOpen, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

const langColor: Record<string, string> = {
  python: 'from-yellow-500/20 to-yellow-700/10 border-yellow-500/30',
  java: 'from-orange-500/20 to-orange-700/10 border-orange-500/30',
  cpp: 'from-blue-500/20 to-blue-700/10 border-blue-500/30',
};

const langIcon: Record<string, string> = { python: 'PY', java: 'JV', cpp: 'C++' };

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<Record<string, AssignmentWithStatus[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const enr = await getEnrollmentsForStudent(user.id);
      setEnrollments(enr);

      // Load assignment statuses per course in parallel
      const pairs = await Promise.all(
        enr.map(async (e) => {
          const asgns = await getAssignmentsWithStatus(e.course.id, user.id);
          return [e.course.id, asgns] as const;
        })
      );
      setCourseAssignments(Object.fromEntries(pairs));
      setLoading(false);
    }
    load();
  }, [user]);

  const firstName = user?.full_name.split(' ')[0] ?? 'Student';

  // Aggregate stats
  const allAssignments = Object.values(courseAssignments).flat();
  const totalPending = allAssignments.filter((a) => a.status === 'not_started' || a.status === 'in_progress').length;
  const totalSubmitted = allAssignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;

  return (
    <div className="min-h-screen bg-vpl-dark text-foreground">
      <Navbar />

      {/* Welcome Header */}
      <header className="border-b border-white/10 bg-vpl-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalPending > 0
              ? `You have ${totalPending} pending assignment${totalPending > 1 ? 's' : ''}.`
              : 'All caught up — no pending assignments!'}
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-white font-medium">{enrollments.length}</span>
              <span className="text-muted-foreground">Courses</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-white font-medium">{totalPending}</span>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-white font-medium">{totalSubmitted}</span>
              <span className="text-muted-foreground">Submitted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          Active Courses
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No enrolled courses yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {enrollments.map((enrollment, idx) => {
              const course = enrollment.course;
              const asgns = courseAssignments[course.id] ?? [];
              const completed = asgns.filter((a) => a.status === 'submitted' || a.status === 'graded').length;
              const progress = asgns.length > 0 ? Math.round((completed / asgns.length) * 100) : 0;
              const nextAssignment = asgns.find((a) => a.status === 'not_started' || a.status === 'in_progress');

              return (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="group rounded-xl overflow-hidden bg-vpl-card border border-white/10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Language header */}
                  <div className={`h-24 bg-gradient-to-br ${langColor[course.language]} flex items-center justify-between px-5`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{course.code}</span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white/80">
                      {langIcon[course.language] ?? course.language.toUpperCase().slice(0, 3)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Completion</span>
                        <span className="text-white font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-white/10" />
                    </div>

                    {/* Next assignment */}
                    {nextAssignment && (
                      <div className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-lg border border-white/5 mb-3">
                        <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span className="truncate text-white/80">{nextAssignment.title}</span>
                      </div>
                    )}

                    {/* Footer stats */}
                    <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-white/5">
                      <span>{asgns.length} assignments</span>
                      <span className="flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform">
                        View Course <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
