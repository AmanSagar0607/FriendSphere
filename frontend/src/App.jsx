import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { initializeAuth } from "./slices/userSlice";
import LandingPage from "./components/LandingPage";
import Posts from "./components/Posts";
import ErrorBoundary from "./components/ErrorBoundary";
import './index.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          {isAuthenticated && <Navigation />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
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