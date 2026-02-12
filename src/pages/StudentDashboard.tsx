
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import studentBanner from "@/assets/student-banner.jpg";
import coursePython from "@/assets/course-python.jpg";
import courseJava from "@/assets/course-java.jpg";
import courseCpp from "@/assets/course-cpp.jpg";
import { Play, Clock, CheckCircle2, Terminal } from "lucide-react";

const StudentDashboard = () => {
  const courses = [
    {
      id: "cs101",
      title: "Introduction to Python",
      progress: 75,
      image: coursePython,
      nextAssignment: "Data Structures & Lists",
      due: "2h remaining"
    },
    {
      id: "cs202",
      title: "Advanced Java Programming",
      progress: 45,
      image: courseJava,
      nextAssignment: "Object Oriented Patterns",
      due: "2 days remaining"
    },
    {
      id: "cs303",
      title: "System Programming in C++",
      progress: 12,
      image: courseCpp,
      nextAssignment: "Memory Management",
      due: "5 days remaining"
    }
  ];

  return (
    <div className="min-h-screen bg-vpl-dark text-foreground">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-vpl-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">S</div>
            <span className="font-bold">Student Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Logged in as <span className="text-white">Alex Chen</span></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 border border-white/20"></div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <header className="relative h-64 overflow-hidden">
        <div className="absolute inset-0">
          <img src={studentBanner} alt="Student Dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-vpl-dark via-vpl-dark/80 to-transparent" />
        </div>
        <div className="container relative z-10 px-6 h-full flex flex-col justify-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-xl text-muted-foreground max-w-xl">You have 3 pending assignments due this week. Your Python mastery has increased by 12%.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" />
            Active Courses
          </h2>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">View All Courses</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Link 
              key={course.id} 
              to={`/lab/${course.id}`}
              className="group relative rounded-xl overflow-hidden bg-vpl-card border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between text-xs font-medium text-white/90 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5 bg-white/20" />
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                
                <div className="mt-auto pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/80 bg-white/5 p-2 rounded border border-white/5">
                    <Play className="w-4 h-4 text-primary" />
                    <span className="truncate">{course.nextAssignment}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.due}
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
