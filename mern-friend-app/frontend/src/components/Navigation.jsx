import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../slices/userSlice';
import Button from './ui/Button';

function Navigation() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'bg-primary-700' : '';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 text-2xl font-bold">FriendSphere</span>
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/home" className={`text-gray-700 hover:bg-primary-50 px-3 py-2 rounded-md text-sm font-medium ${isActive('/home')}`}>Home</Link>
            <Link to="/profile" className={`text-gray-700 hover:bg-primary-50 px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile')}`}>Profile</Link>
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/home" className="text-gray-700 hover:bg-primary-50 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/profile" className="text-gray-700 hover:bg-primary-50 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full text-left">Logout</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;