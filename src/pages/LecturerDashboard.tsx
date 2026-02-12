
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lecturerBanner from "@/assets/lecturer-banner.jpg";
import { Activity, Users, CheckCircle, AlertCircle, Search, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";

const LecturerDashboard = () => {
  const students = [
    { id: 1, name: "Emma Wilson", id_num: "A00123", status: "submitted", grade: "98/100", time: "2m ago" },
    { id: 2, name: "Liam Johnson", id_num: "A00124", status: "submitted", grade: "85/100", time: "15m ago" },
    { id: 3, name: "Noah Brown", id_num: "A00125", status: "in_progress", grade: "-", time: "Active now" },
    { id: 4, name: "Olivia Davis", id_num: "A00126", status: "late", grade: "-", time: "Overdue" },
    { id: 5, name: "William Miller", id_num: "A00127", status: "submitted", grade: "92/100", time: "1h ago" },
  ];

  return (
    <div className="min-h-screen bg-vpl-dark text-foreground">
      {/* Top Nav */}
      <nav className="border-b border-white/10 bg-vpl-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">L</div>
            <span className="font-bold">Lecturer Console</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Prof. Anderson</div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50"></div>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="relative h-64 overflow-hidden">
        <div className="absolute inset-0">
          <img src={lecturerBanner} alt="Lecturer Dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-vpl-dark via-vpl-dark/60 to-transparent" />
        </div>
        <div className="container relative z-10 px-6 h-full flex flex-col justify-center animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">CS101: INTRO TO PYTHON</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Class Overview</h1>
          <p className="text-xl text-muted-foreground">Assignment 4: Data Structures • Due in 2 days</p>
        </div>
      </header>

      <main className="container px-6 py-8 space-y-8">
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-delayed">
          <Card className="bg-vpl-card border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground mt-1">+4% from last semester</p>
            </CardContent>
          </Card>
          <Card className="bg-vpl-card border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Submission Rate</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">126/142 submitted</p>
            </CardContent>
          </Card>
          <Card className="bg-vpl-card border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Grade</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.4</div>
              <p className="text-xs text-muted-foreground mt-1">+2.1 vs class average</p>
            </CardContent>
          </Card>
          <Card className="bg-vpl-card border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Students below 50%</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Submissions</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-8 bg-black/20 border-white/10 focus:border-primary/50" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-vpl-card/50">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Student</TableHead>
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                  <TableHead className="text-gray-400">Grade</TableHead>
                  <TableHead className="text-right text-gray-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{student.id_num}</TableCell>
                    <TableCell>
                      {student.status === 'submitted' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><CheckCircle className="w-3 h-3" /> Submitted</span>}
                      {student.status === 'in_progress' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><Activity className="w-3 h-3 animate-pulse" /> Coding Now</span>}
                      {student.status === 'late' && <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><AlertCircle className="w-3 h-3" /> Late</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.time}</TableCell>
                    <TableCell className="font-mono">{student.grade}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20 hover:text-primary">Review Code</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;
