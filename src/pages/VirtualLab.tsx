
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Save, Settings, ChevronLeft, Terminal as TerminalIcon } from "lucide-react";
import { useState } from "react";

const VirtualLab = () => {
  const { courseId } = useParams();
  const [output, setOutput] = useState([
    "> Initializing virtual environment...",
    "> Python 3.9.2 detected",
    "> Waiting for execution..."
  ]);

  const runCode = () => {
    setOutput(prev => [...prev, "> Executing script...", "Hello World!", "> Execution finished in 0.02s"]);
  };

  return (
    <div className="h-screen w-full bg-vpl-dark text-foreground flex flex-col overflow-hidden">
      {/* IDE Header */}
      <header className="h-14 border-b border-white/10 bg-vpl-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/student">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-muted-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {courseId === "cs101" ? "main.py" : "Assignment_1.cpp"}
            </h1>
            <p className="text-xs text-muted-foreground">Last saved 2 mins ago</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 hover:bg-white/5 text-muted-foreground gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button size="sm" variant="ghost" className="h-8 hover:bg-white/5 text-muted-foreground gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Button 
            size="sm" 
            className="h-8 bg-green-600 hover:bg-green-700 text-white gap-2 font-medium ml-2 px-4 shadow-[0_0_10px_rgba(22,163,74,0.4)] border-none"
            onClick={runCode}
          >
            <Play className="h-3 w-3 fill-current" /> Run Code
          </Button>
        </div>
      </header>

      {/* Main IDE Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          
          {/* File Explorer / Instructions Side */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-vpl-card border-r border-white/10 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground">Instructions</div>
              <ScrollArea className="flex-1 p-4">
                <h2 className="text-lg font-bold text-foreground mb-2">Variables & Data Types</h2>
                <p className="text-sm text-muted-foreground mb-4">Create a program that declares variables of different types and prints them.</p>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="p-3 rounded bg-black/20 border border-white/5">
                    <h3 className="text-foreground font-medium mb-1">Task 1</h3>
                    <p>Declare an integer variable named <code className="text-vpl-gold">age</code> and output it.</p>
                  </div>
                  <div className="p-3 rounded bg-black/20 border border-white/5">
                    <h3 className="text-foreground font-medium mb-1">Task 2</h3>
                    <p>Declare a string variable named <code className="text-green-400">name</code> and output it.</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-white/10 w-[1px]" />

          {/* Code Editor Side */}
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              
              {/* Editor */}
              <ResizablePanel defaultSize={70} className="bg-vpl-dark/50">
                <div className="h-full relative font-mono text-sm p-4">
                  {/* Line Numbers Simulation */}
                  <div className="absolute left-0 top-4 bottom-0 w-12 flex flex-col items-end pr-4 text-muted-foreground/50 select-none">
                    <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div>
                  </div>
                  {/* Editor Area */}
                  <div className="ml-12 h-full text-foreground/90 outline-none" contentEditable spellCheck={false}>
                    <span className="text-vpl-purple">def</span> <span className="text-blue-400">main</span>():<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted-foreground/70"># Your code here</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-vpl-gold">print</span>(<span className="text-green-400">"Hello World!"</span>)<br/>
                    <br/>
                    <span className="text-vpl-purple">if</span> __name__ == <span className="text-green-400">"__main__"</span>:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;main()
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-white/10 h-[1px]" />

              {/* Terminal */}
              <ResizablePanel defaultSize={30} minSize={10} className="bg-black/40">
                <div className="h-full flex flex-col">
                  <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2 bg-vpl-card">
                    <TerminalIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Terminal</span>
                  </div>
                  <ScrollArea className="flex-1 p-4 font-mono text-sm">
                    {output.map((line, i) => (
                      <div key={i} className={`${line.startsWith('>') ? 'text-blue-400' : 'text-foreground'} mb-1`}>{line}</div>
                    ))}
                    <div className="animate-pulse text-primary">_</div>
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
