
import { Link, useNavigate } from 'react-router-dom';
import { Film, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';

interface NavbarProps {
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = true }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-white border-b-4 border-black px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-1 md:space-x-2 text-xl md:text-2xl font-black text-black hover:text-primary-500 transition-colors"
        >
          <Film className="w-6 h-6 md:w-8 md:h-8" />
          <span>MARVALZOD</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-black focus:outline-none">
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-6 z-50">
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-black focus:outline-none">
            <X className="w-8 h-8" />
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/movies"
                className="text-black text-2xl font-semibold hover:text-primary-500 transition-colors"
                onClick={toggleMobileMenu}
              >
                Movies
              </Link>
              <span className="text-gray-600 text-xl">Welcome, {user?.username}</span>
              <button
                onClick={() => { handleLogout(); toggleMobileMenu(); }}
                className="flex items-center space-x-2 text-black text-2xl hover:text-red-500 font-semibold transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </>
          ) : showAuthButtons ? (
            <>
              <Link
                to="/login"
                className="btn-outline text-2xl px-6 py-3"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/movies"
                className="btn-primary text-2xl px-6 py-3"
                onClick={toggleMobileMenu}
              >
                Start Now
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-2xl px-6 py-3"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
