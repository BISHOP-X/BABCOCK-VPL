import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/useAuth';
import { getCoursesByLecturer, getCourseStats } from '@/services/supabaseApi';
import type { CourseWithLecturer, CourseStats } from '@/types';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, BarChart3, Plus, ChevronRight, Activity } from 'lucide-react';

const langColor: Record<string, string> = {
  python: 'from-yellow-500/20 to-yellow-700/10 border-yellow-500/30',
  java: 'from-orange-500/20 to-orange-700/10 border-orange-500/30',
  cpp: 'from-blue-500/20 to-blue-700/10 border-blue-500/30',
  c: 'from-indigo-500/20 to-indigo-700/10 border-indigo-500/30',
  html: 'from-red-500/20 to-red-700/10 border-red-500/30',
  css: 'from-blue-400/20 to-blue-600/10 border-blue-400/30',
  javascript: 'from-yellow-400/20 to-yellow-600/10 border-yellow-400/30',
  php: 'from-purple-500/20 to-purple-700/10 border-purple-500/30',
};

const langIcon: Record<string, string> = { 
  python: 'PY', 
  java: 'JV', 
  cpp: 'C++', 
  c: 'C',
  html: 'HTML', 
  css: 'CSS', 
  javascript: 'JS', 
  php: 'PHP' 
};

const LecturerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithLecturer[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, CourseStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const crs = await getCoursesByLecturer(user.id);
        setCourses(crs);

        const pairs = await Promise.all(
          crs.map(async (c) => {
            const stats = await getCourseStats(c.id);
            return [c.id, stats] as const;
          }),
        );
        setStatsMap(Object.fromEntries(pairs));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load your courses. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const firstName = user?.full_name.split(' ')[0] ?? 'Professor';

  // Aggregate stats
  const allStats = Object.values(statsMap);
  const totalStudents = allStats.reduce((s, st) => s + st.total_students, 0);
  const totalAssignments = allStats.reduce((s, st) => s + st.total_assignments, 0);
  const avgScore = allStats.length > 0
    ? Math.round(allStats.reduce((s, st) => s + st.average_score, 0) / allStats.length)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Welcome Header */}
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {firstName}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your courses, assignments, and student submissions.
              </p>
            </div>
            <Link to="/lecturer/create-course">
              <Button className="gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> New Course
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground font-medium">{courses.length}</span>
              <span className="text-muted-foreground">Courses</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
              <Users className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span className="text-foreground font-medium">{totalStudents}</span>
              <span className="text-muted-foreground">Students</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
              <Activity className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
              <span className="text-foreground font-medium">{totalAssignments}</span>
              <span className="text-muted-foreground">Assignments</span>
            </div>
            {avgScore > 0 && (
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-medium">{avgScore}%</span>
                <span className="text-muted-foreground">Avg Score</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Your Courses</h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No courses yet. Create your first course to get started.</p>
            <Link to="/lecturer/create-course">
              <Button variant="outline" className="mt-4 border-border gap-1.5">
                <Plus className="w-4 h-4" /> Create Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course, idx) => {
              const stats = statsMap[course.id];
              return (
                <Link
                  key={course.id}
                  to={`/lecturer/courses/${course.id}`}
                  className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Language header */}
                  <div className={`h-24 bg-gradient-to-br ${langColor[course.language]} flex items-center justify-between px-5`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">{course.code}</span>
                      <h3 className="text-base sm:text-lg font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-foreground/5 border border-border flex items-center justify-center text-xs font-bold text-foreground/80">
                      {langIcon[course.language] ?? course.language.toUpperCase().slice(0, 3)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground mb-3">{course.semester}</p>

                    {stats && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 rounded-lg bg-muted/50 border border-border/50">
                          <p className="text-sm font-bold text-foreground">{stats.total_students}</p>
                          <p className="text-[10px] text-muted-foreground">Students</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50 border border-border/50">
                          <p className="text-sm font-bold text-foreground">{stats.total_assignments}</p>
                          <p className="text-[10px] text-muted-foreground">Assign.</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm font-bold text-primary">{stats.average_score}%</p>
                          <p className="text-[10px] text-muted-foreground">Avg</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-end text-[11px] text-primary group-hover:translate-x-0.5 transition-transform pt-2 border-t border-border/50">
                      Manage Course <ChevronRight className="w-3 h-3 ml-0.5" />
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

export default LecturerDashboard;
