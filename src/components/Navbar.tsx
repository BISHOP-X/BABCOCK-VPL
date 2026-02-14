import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isLecturer = user?.role === 'lecturer';
  const homeRoute = isLecturer ? '/lecturer' : '/student';

  const navLinks = isLecturer
    ? [
        { label: 'Dashboard', href: '/lecturer' },
        { label: 'Courses', href: '/lecturer' },
      ]
    : [
        { label: 'Dashboard', href: '/student' },
        { label: 'Courses', href: '/student' },
      ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: logo + links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to={homeRoute} className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold font-mono text-xs">{`>`}</span>
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:inline">BABCOCK VPL</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: theme toggle + user + logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-foreground leading-none">{user?.full_name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/40 to-blue-600/40 border border-border flex items-center justify-center text-[11px] font-bold text-foreground">
            {user?.full_name?.charAt(0) ?? '?'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hidden sm:flex"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-8 w-8 text-muted-foreground sm:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 space-y-1 animate-fade-in">
          <div className="text-xs text-muted-foreground mb-2 px-2">
            Signed in as <span className="text-foreground font-medium">{user?.full_name}</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
