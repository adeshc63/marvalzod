import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = true }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white border-b-4 border-black px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-black text-black hover:text-primary-500 transition-colors"
        >
          <Film className="w-8 h-8" />
          <span>MARVALZOD</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/movies"
                className="text-black hover:text-primary-500 font-semibold transition-colors"
              >
                Movies
              </Link>
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-black hover:text-red-500 font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : showAuthButtons ? (
            <>
              <Link
                to="/login"
                className="btn-outline"
              >
                Login
              </Link>
              <Link
                to="/movies"
                className="btn-primary"
              >
                Start Now
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;