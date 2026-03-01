
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
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono text-sm">{`>`}</span>
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg tracking-tight leading-none block">BUCODeL VPL</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-none hidden xs:block truncate">Babcock University Centre of Open &amp; Distance eLearning</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted h-9 px-3 sm:px-4">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 text-sm h-9 px-3 sm:px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Virtual Programming Lab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-foreground/5" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 sm:px-6 text-center">
          <div className="animate-fade-in space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20 text-primary/80 text-xs sm:text-sm font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Beta â€” Now Live
            </div>

            {/* Institution name */}
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary/70 mb-3">
                Babcock University
              </p>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight px-2">
                Centre of Open and Distance eLearning
                <br className="hidden sm:block" />
                <span className="text-gradient-primary"> Virtual Laboratory</span>
              </h1>
            </div>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Write, run, and submit code â€” all from your browser.
              Cloud-based compilation, instant feedback, and lecturer grading â€” purpose-built for BUCODeL students and faculty.
            </p>

            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/signup" className="w-full xs:w-auto">
                <Button size="lg" className="w-full xs:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Account
                </Button>
              </Link>
              <Link to="/login" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="w-full xs:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base glass-card border-border hover:bg-muted hover:text-foreground">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-background relative z-10">
        <div className="container px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need, in one place</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              BUCODeL VPL brings the full software development workflow into your browser â€” no installations required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
              <div className="p-5 sm:p-6 relative">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Pro-Grade IDE</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Monaco-powered editor with syntax highlighting, autocomplete, and support for 8 languages â€” Python, Java, C++, C, JavaScript, PHP, HTML &amp; CSS.</p>
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
              <div className="p-5 sm:p-6 relative">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Cloud Compilation</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Run code instantly via cloud-based compilers. See output in real time, right in your browser â€” no software to install.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl overflow-hidden border border-border bg-card sm:col-span-2 md:col-span-1 hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={featureAnalytics}
                  alt="Lecturer Analytics"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-5 sm:p-6 relative">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">Submission &amp; Grading</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Students submit code per assignment. Lecturers review, grade, and leave feedback â€” all in one streamlined BUCODeL workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 sm:py-8">
        <div className="container px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Â© {new Date().getFullYear()} Babcock University Centre of Open and Distance eLearning (BUCODeL). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

