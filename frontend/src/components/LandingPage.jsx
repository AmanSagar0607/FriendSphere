import { Link } from 'react-router-dom';
import { Meteors } from './magicui/Meteors';
import { FaUserFriends, FaShare, FaCompass } from 'react-icons/fa';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
      <Meteors number={20} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 animate-fade-in-up">
            Welcome to <span className="text-primary-400">FriendSphere</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 md:mb-8 text-gray-300 animate-fade-in-up animation-delay-200">
            Connect, Share, and Thrive in Your Social Circle
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
            <Link to="/login" className="w-full sm:w-auto inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition duration-300 transform hover:scale-105 text-sm sm:text-base">
              Login
            </Link>
            <Link to="/signup" className="w-full sm:w-auto inline-block bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition duration-300 transform hover:scale-105 text-sm sm:text-base">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16">
          {[ 
            { icon: FaUserFriends, title: 'Connect', description: 'Find and connect with friends, old and new. Expand your social network effortlessly.' },
            { icon: FaShare, title: 'Share', description: 'Share your interests, experiences, and moments with your friends in a safe environment.' },
            { icon: FaCompass, title: 'Discover', description: 'Discover new connections through our smart friend recommendation system.' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 p-4 sm:p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${600 + index * 200}ms` }}>
              <feature.icon className="text-primary-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{feature.title}</h2>
              <p className="text-gray-300 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-0 w-full text-center py-2 sm:py-4 text-gray-400 text-xs sm:text-sm">
        <p>&copy; 2024 FriendSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;