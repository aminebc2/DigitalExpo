import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Navbar from './component/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from "./component/admin/AdminDashboard";
import Home from './component/Home';
import Unauthorized from './component/Unauthorized';
import Footer from "./component/common/Footer";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <div className="container mt-4">
                        <AppRoutes />
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

function AppRoutes() {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;


    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin-only routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            {/*<Route
                path="/admin/volunteer-requests"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <VolunteerRequests />
                    </ProtectedRoute>
                }
            />*/}

        </Routes>
    );
}

export default App;
