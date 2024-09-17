import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-white px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to FriendSphere</h1>
        <p className="text-xl mb-8">Connect, Share, and Thrive in Your Social Circle</p>
        <div className="space-x-4 mb-12">
          <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 inline-block">
            Login
          </Link>
          <Link to="/signup" className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-900 transition duration-300 inline-block">
            Sign Up
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Connect</h2>
            <p className="text-gray-100">Find and connect with friends, old and new. Expand your social network effortlessly.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Share</h2>
            <p className="text-gray-100">Share your interests, experiences, and moments with your friends in a safe environment.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Discover</h2>
            <p className="text-gray-100">Discover new connections through our smart friend recommendation system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;