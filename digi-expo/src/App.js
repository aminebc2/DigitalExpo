import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Navbar from './component/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from './component/admin/AdminDashboard';
import Home from './component/Home';
import Unauthorized from './component/Unauthorized';
import Footer from './component/common/Footer';
import AssociationDashboard from './component/association/AssociationDashboard';
import ReserveSessionsPage from './component/association/ReserveSessionsPage';
import SessionListPage from './component/association/SessionListPage';
import VolunteerListPage from './component/association/VolunteersListPage';
import AvailableDays from "./component/volunteer/AvailableDays";
import SessionPage from "./component/volunteer/SessionsPage";
import AssociationList from "./component/volunteer/AssociationList";

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

    const loggedAssociationId = localStorage.getItem('associationId');
    const loggedvolunteerId = localStorage.getItem('volunteerId');

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

            {/* Association routes */}
            <Route
                path="/association"
                element={
                    <ProtectedRoute allowedRoles={['ASSOCIATION']}>
                        <AssociationDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/association/reserve/:id"
                element={
                    <ProtectedRoute allowedRoles={['ASSOCIATION']}>
                        <ReserveSessionsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/association/sessions"
                element={
                    <ProtectedRoute allowedRoles={['ASSOCIATION']}>
                        <SessionListPage associationId={loggedAssociationId} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/association/volunteers"
                element={
                    <ProtectedRoute allowedRoles={['ASSOCIATION']}>
                        <VolunteerListPage associationId={loggedAssociationId} />
                    </ProtectedRoute>
                }
            />

            {/* Volunteer routes */}
            <Route
                path="/volunteer/all-associations"
                element={
                <ProtectedRoute allowedRoles={['BENEVOLE']}>
                    <AssociationList/>
                </ProtectedRoute>
                }
            />
            <Route
                path="/volunteer/available-days"
                element={
                <ProtectedRoute allowedRoles={['BENEVOLE']}>
                    <AvailableDays volunteerId={loggedvolunteerId}/>
                </ProtectedRoute>
                }
            />
            <Route
                path="/volunteer/sessions"
                element={
                    <ProtectedRoute allowedRoles={['BENEVOLE']}>
                        <SessionPage volunteerId={loggedvolunteerId}/>
                    </ProtectedRoute>
                }
            />


        </Routes>
    );
}

export default App;
