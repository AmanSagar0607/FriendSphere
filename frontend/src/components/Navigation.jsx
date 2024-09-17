import  { useState } from 'react';
// import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setProfileModalOpen } from '../slices/userSlice';
import Button from './ui/Button';
import { FiUser } from "react-icons/fi";

function Navigation() {
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleOpenProfileModal = () => {
    dispatch(setProfileModalOpen(true));
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'bg-primary-900 text-primary-100' : '';

  const ProfileAvatar = () => (
    <div className="relative">
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center focus:outline-none"
      >
        <FiUser className="h-6 w-6 text-gray-100" />
      </button>
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={handleOpenProfileModal}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <span className="text-primary-400 text-2xl font-bold">FriendSphere</span>
            </Link>
          </div>
          {isAuthenticated && (
            <>
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link to="/home" className={`text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/home')}`}>Home</Link>
                <Link to="/posts" className={`text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/posts')}`}>Posts</Link>
                <ProfileAvatar />
              </div>
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500">
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
            </>
          )}
        </div>
      </div>
      {isAuthenticated && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/home" className={`text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${isActive('/home')}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/posts" className={`text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${isActive('/posts')}`} onClick={() => setIsMenuOpen(false)}>Posts</Link>
            <button
              onClick={handleOpenProfileModal}
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Profile
            </button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full text-left">Logout</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

Navigation.propTypes = {
  // Add any props if the component receives any in the future
};

export default Navigation;