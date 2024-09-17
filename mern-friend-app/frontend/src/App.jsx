import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadUser } from "./slices/userSlice";
import Profile from "./components/Profile";
import LandingPage from "./components/LandingPage";
import './index.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(state => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'exists' : 'not found');
    if (token) {
      dispatch(loadUser()).unwrap()
        .then(() => console.log('User loaded successfully'))
        .catch(err => console.error('Failed to load user:', err));
    } else {
      console.log('No token found, skipping user load');
    }
  }, [dispatch]);

  console.log('App render - isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Navigation />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;