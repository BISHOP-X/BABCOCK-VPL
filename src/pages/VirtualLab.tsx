
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Send, ChevronLeft, Terminal as TerminalIcon, CheckCircle2, Loader2, FileText, Code2, Monitor } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useAuth } from "@/context/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { getAssignmentById, getCourseById, submitCode as mockSubmit, getSubmissionByStudentAndAssignment } from "@/services/mockApi";
import type { Assignment, CourseWithLecturer, Submission } from "@/types";
import { toast } from "sonner";

const langMap: Record<string, string> = { python: 'python', java: 'java', cpp: 'cpp' };

const starterCode: Record<string, string> = {
  python: '# Write your solution here\n\n',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
};

type MobileTab = 'instructions' | 'editor' | 'output';

const VirtualLab = () => {
  const { courseId, assignmentId } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<CourseWithLecturer | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<{ text: string; type: 'system' | 'stdout' | 'stderr' }[]>([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingSub, setExistingSub] = useState<Submission | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');

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
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  // Mock Run
  const handleRun = useCallback(async () => {
    if (running || !code.trim()) return;
    setRunning(true);
    setMobileTab('output');
    setOutput((p) => [...p, { text: '> Compiling...', type: 'system' }]);
    await new Promise((r) => setTimeout(r, 800));
    setOutput((p) => [...p, { text: '> Running...', type: 'system' }]);
    await new Promise((r) => setTimeout(r, 600));

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

  const mobileTabs: { key: MobileTab; label: string; icon: typeof Code2 }[] = [
    { key: 'instructions', label: 'Tasks', icon: FileText },
    { key: 'editor', label: 'Code', icon: Code2 },
    { key: 'output', label: 'Output', icon: Monitor },
  ];

  /* ====== Shared sub-components ====== */

  const InstructionsPanel = () => (
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
              <div key={task.id} className="p-2 rounded bg-muted/50 border border-border">
                <h3 className="text-xs text-foreground font-medium mb-0.5">Task {i + 1}</h3>
                <p className="text-[11px] text-muted-foreground">{task.description}</p>
                {task.hint && <p className="text-[10px] text-primary/60 mt-1 italic">Hint: {task.hint}</p>}
              </div>
            ))}
          </div>
          {assignment.expected_output && (
            <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
              <h3 className="text-xs text-green-500 dark:text-green-400 font-medium mb-1">Expected Output</h3>
              <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap font-mono">{assignment.expected_output}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Loading assignment...</div>
      )}
    </ScrollArea>
  );

  const TerminalPanel = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col ${className}`}>
      <div className="h-7 border-b border-border flex items-center justify-between px-3 bg-card shrink-0">
        <div className="flex items-center gap-1.5">
          <TerminalIcon className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Output</span>
        </div>
        <button onClick={() => setOutput([])} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          Clear
        </button>
      </div>
      <ScrollArea className="flex-1 px-3 py-2 font-mono text-xs vpl-terminal-bg">
        {output.map((line, i) => (
          <div
            key={i}
            className={`mb-0.5 ${
              line.type === 'system' ? 'text-blue-500 dark:text-blue-400' :
              line.type === 'stderr' ? 'text-red-500 dark:text-red-400' :
              'text-foreground'
            }`}
          >
            {line.text}
          </div>
        ))}
        {running && <div className="animate-pulse text-primary">_</div>}
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-dvh w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* IDE Header */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-3 sm:px-4 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to={`/student/courses/${courseId}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-muted text-muted-foreground shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="truncate">{fileName}</span>
              {submitted && (
                <span className="inline-flex items-center gap-1 text-[10px] text-green-500 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20 ml-1 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Submitted
                </span>
              )}
            </h1>
            <p className="text-[10px] text-muted-foreground truncate">{assignment?.title ?? 'Loading...'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            className="h-7 bg-green-600 hover:bg-green-700 text-white gap-1 font-medium px-2 sm:px-3 text-xs border-none"
            onClick={handleRun}
            disabled={running || !code.trim()}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
            <span className="hidden xs:inline">Run</span>
          </Button>
          <Button
            size="sm"
            className="h-7 bg-primary hover:bg-primary/90 text-primary-foreground gap-1 font-medium px-2 sm:px-3 text-xs shadow-sm"
            onClick={handleSubmit}
            disabled={submitting || submitted || !code.trim()}
          >
            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            <span className="hidden xs:inline">{submitted ? 'Submitted' : 'Submit'}</span>
          </Button>
        </div>
      </header>

      {/* ====== MOBILE LAYOUT (< md) ====== */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden">
        {/* Mobile tab bar */}
        <div className="flex border-b border-border bg-card shrink-0">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const active = mobileTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.key === 'output' && output.length > 1 && (
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center">
                    {output.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'instructions' && (
            <div className="h-full flex flex-col bg-card">
              <InstructionsPanel />
            </div>
          )}
          {mobileTab === 'editor' && (
            <div className="h-full vpl-code-bg">
              <Editor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(v) => !submitted && setCode(v ?? '')}
                theme={monacoTheme}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 8 },
                  lineNumbersMinChars: 3,
                  readOnly: submitted,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                  overviewRulerBorder: false,
                  folding: false,
                  glyphMargin: false,
                }}
                loading={
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading editor...
                  </div>
                }
              />
            </div>
          )}
          {mobileTab === 'output' && (
            <TerminalPanel className="h-full" />
          )}
        </div>
      </div>

      {/* ====== DESKTOP LAYOUT (>= md) ====== */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Instructions Sidebar */}
        <div className="w-[280px] lg:w-[320px] shrink-0 border-r border-border bg-card flex flex-col">
          <div className="px-3 py-2 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Instructions
          </div>
          <InstructionsPanel />
        </div>

        {/* Editor + Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 min-h-0 vpl-code-bg">
            <Editor
              height="100%"
              language={monacoLang}
              value={code}
              onChange={(v) => !submitted && setCode(v ?? '')}
              theme={monacoTheme}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                lineNumbersMinChars: 3,
                readOnly: submitted,
                wordWrap: 'on',
                automaticLayout: true,
              }}
              loading={
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading editor...
                </div>
              }
            />
          </div>

          {/* Terminal */}
          <div className="h-[180px] shrink-0 border-t border-border">
            <TerminalPanel className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
