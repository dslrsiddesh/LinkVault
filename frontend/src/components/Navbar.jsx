import { Link } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const getDisplayName = () => {
    if (!user) return "";
    const name = user.fullName || user.full_name;
    if (name) return name.split(" ")[0];
    return user.email?.split("@")[0];
  };

  return (
    <nav className="w-full h-20 fixed top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="font-bold text-white text-lg">L</span>
          </div>
          <span className="font-bold text-xl text-text-main tracking-tight group-hover:text-primary transition-colors">
            LinkVault
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end mr-2 animate-fade-in">
                <span className="text-xs font-bold text-text-main">
                  Welcome, {getDisplayName()}
                </span>
                <Link
                  to="/dashboard"
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  View Dashboard
                </Link>
              </div>

              <Link
                to="/"
                className="p-2.5 rounded-full text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
                title="New Upload"
              >
                <span className="text-sm font-bold">New Upload</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-white text-sm font-bold text-text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-bold text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started</span>
                <FiUser className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
