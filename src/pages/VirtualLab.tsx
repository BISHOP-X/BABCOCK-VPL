
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Send, ChevronLeft, Terminal as TerminalIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useAuth } from "@/context/useAuth";
import { getAssignmentById, getCourseById, submitCode as mockSubmit, getSubmissionByStudentAndAssignment } from "@/services/mockApi";
import type { Assignment, CourseWithLecturer, Submission } from "@/types";
import { toast } from "sonner";

const langMap: Record<string, string> = { python: 'python', java: 'java', cpp: 'cpp' };

const starterCode: Record<string, string> = {
  python: '# Write your solution here\n\n',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
};

const VirtualLab = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<CourseWithLecturer | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<{ text: string; type: 'system' | 'stdout' | 'stderr' }[]>([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingSub, setExistingSub] = useState<Submission | null>(null);

  // Load assignment + course data
  useEffect(() => {
    async function load() {
      if (!assignmentId || !courseId || !user) return;
      const [asg, crs, sub] = await Promise.all([
        getAssignmentById(assignmentId),
        getCourseById(courseId),
        getSubmissionByStudentAndAssignment(user.id, assignmentId),
      ]);
      setAssignment(asg);
      setCourse(crs);
      if (sub) {
        setExistingSub(sub);
        setCode(sub.code);
        setSubmitted(true);
        setOutput([{ text: '> Previously submitted code loaded', type: 'system' }]);
      } else {
        setCode(starterCode[crs?.language ?? 'python'] || starterCode.python);
        setOutput([{ text: `> ${(crs?.language ?? 'python').toUpperCase()} environment ready`, type: 'system' }]);
      }
    }
    load();
  }, [assignmentId, courseId, user]);

  const lang = course?.language ?? 'python';
  const monacoLang = langMap[lang] ?? 'python';

  // Mock Run
  const handleRun = useCallback(async () => {
    if (running || !code.trim()) return;
    setRunning(true);
    setOutput((p) => [...p, { text: '> Compiling...', type: 'system' }]);
    await new Promise((r) => setTimeout(r, 800));
    setOutput((p) => [...p, { text: '> Running...', type: 'system' }]);
    await new Promise((r) => setTimeout(r, 600));

    // Simulated output based on expected + language
    if (assignment?.expected_output) {
      const lines = assignment.expected_output.split('\n');
      setOutput((p) => [...p, ...lines.map((l) => ({ text: l, type: 'stdout' as const }))]);
    } else {
      setOutput((p) => [...p, { text: 'Hello World!', type: 'stdout' }]);
    }
    setOutput((p) => [...p, { text: `> Execution finished in 0.04s`, type: 'system' }]);
    setRunning(false);
  }, [running, code, assignment]);

  // Submit
  const handleSubmit = useCallback(async () => {
    if (submitting || submitted || !user || !assignmentId) return;
    const confirmed = window.confirm(
      'Submit your code? This creates an immutable snapshot that will be sent to your lecturer.'
    );
    if (!confirmed) return;
    setSubmitting(true);
    await mockSubmit(assignmentId, user.id, code, lang, output.filter(o => o.type === 'stdout').map(o => o.text).join('\n'));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Code submitted successfully!');
  }, [submitting, submitted, user, assignmentId, code, lang, output]);

  const fileName = lang === 'python' ? 'main.py' : lang === 'java' ? 'Solution.java' : 'main.cpp';

  return (
    <div className="h-dvh w-full bg-vpl-dark text-foreground flex flex-col overflow-hidden">
      {/* IDE Header */}
      <header className="h-12 border-b border-white/10 bg-vpl-card flex items-center justify-between px-3 sm:px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/student/courses/${courseId}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/5 text-muted-foreground">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              {fileName}
              {submitted && (
                <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20 ml-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Submitted
                </span>
              )}
            </h1>
            <p className="text-[10px] text-muted-foreground truncate">{assignment?.title ?? 'Loading...'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="h-7 bg-green-600 hover:bg-green-700 text-white gap-1.5 font-medium px-3 text-xs border-none"
            onClick={handleRun}
            disabled={running || !code.trim()}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
            Run
          </Button>
          <Button
            size="sm"
            className="h-7 bg-primary hover:bg-primary/90 text-black gap-1.5 font-medium px-3 text-xs shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            onClick={handleSubmit}
            disabled={submitting || submitted || !code.trim()}
          >
            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            {submitted ? 'Submitted' : 'Submit'}
          </Button>
        </div>
      </header>

      {/* Main IDE Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Instructions Panel */}
          <ResizablePanel defaultSize={22} minSize={15} maxSize={35} className="bg-vpl-card border-r border-white/10 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="px-3 py-2 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Instructions
              </div>
              <ScrollArea className="flex-1 p-3">
                {assignment ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-primary font-mono uppercase">{course?.code} &middot; Week {assignment.week_number}</p>
                      <h2 className="text-sm font-bold text-foreground mt-0.5">{assignment.title}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{assignment.description}</p>

                    <div className="space-y-2">
                      {assignment.tasks.map((task, i) => (
                        <div key={task.id} className="p-2 rounded bg-black/20 border border-white/5">
                          <h3 className="text-xs text-foreground font-medium mb-0.5">Task {i + 1}</h3>
                          <p className="text-[11px] text-muted-foreground">{task.description}</p>
                          {task.hint && <p className="text-[10px] text-primary/60 mt-1 italic">Hint: {task.hint}</p>}
                        </div>
                      ))}
                    </div>

                    {assignment.expected_output && (
                      <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
                        <h3 className="text-xs text-green-400 font-medium mb-1">Expected Output</h3>
                        <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap font-mono">{assignment.expected_output}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Loading assignment...</div>
                )}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-white/10 w-[1px] hidden md:flex" />

          {/* Code Editor + Terminal */}
          <ResizablePanel defaultSize={78}>
            <ResizablePanelGroup direction="vertical">
              {/* Monaco Editor */}
              <ResizablePanel defaultSize={70} className="bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={monacoLang}
                  value={code}
                  onChange={(v) => !submitted && setCode(v ?? '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    lineNumbersMinChars: 3,
                    readOnly: submitted,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </ResizablePanel>

              <ResizableHandle className="bg-white/10 h-[1px]" />

              {/* Terminal */}
              <ResizablePanel defaultSize={30} minSize={10} className="bg-black/40">
                <div className="h-full flex flex-col">
                  <div className="h-7 border-b border-white/10 flex items-center justify-between px-3 bg-vpl-card shrink-0">
                    <div className="flex items-center gap-1.5">
                      <TerminalIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Output</span>
                    </div>
                    <button
                      onClick={() => setOutput([])}
                      className="text-[10px] text-muted-foreground hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <ScrollArea className="flex-1 px-3 py-2 font-mono text-xs">
                    {output.map((line, i) => (
                      <div
                        key={i}
                        className={`mb-0.5 ${
                          line.type === 'system' ? 'text-blue-400' :
                          line.type === 'stderr' ? 'text-red-400' :
                          'text-foreground'
                        }`}
                      >
                        {line.text}
                      </div>
                    ))}
                    {running && <div className="animate-pulse text-primary">_</div>}
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default VirtualLab;
