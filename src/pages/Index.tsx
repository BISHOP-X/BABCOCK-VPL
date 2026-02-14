
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import featureIde from "@/assets/feature-ide.jpg";
import featureAnalytics from "@/assets/feature-analytics.jpg";
import featureCompile from "@/assets/feature-compile.jpg";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono">{`>`}</span>
            </div>
            <span className="font-bold text-xl tracking-tight">BABCOCK VPL</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 text-sm px-5 h-10">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Virtual Programming Lab Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-foreground/5" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-6 text-center">
          <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20 text-primary/80 text-sm font-mono mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Beta — Now Live
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              The Next Evolution of <br />
              <span className="text-gradient-primary">Computer Science Education</span>
            </h1>
            
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Write, run, and submit code — all from your browser. 
              Cloud-based compilation, instant output, and lecturer grading for Babcock University.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg glass-card border-border hover:bg-muted hover:text-foreground w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background relative z-10">
        <div className="container px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={featureIde} 
                  alt="In-Browser IDE" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Pro-Grade IDE</h3>
                <p className="text-muted-foreground">Monaco-powered editor with syntax highlighting, autocomplete, and support for Python, Java, and C++.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={featureCompile} 
                  alt="Instant Compilation" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Cloud Compilation</h3>
                <p className="text-muted-foreground">Run Python, Java, and C++ code instantly via cloud-based compilers. See output in real time, right in your browser.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={featureAnalytics} 
                  alt="Lecturer Analytics" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Submission & Grading</h3>
                <p className="text-muted-foreground">Students submit code per assignment. Lecturers review, grade, and leave feedback — all in one streamlined workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
