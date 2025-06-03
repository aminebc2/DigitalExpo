import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
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
import AssociationProfile from "./component/association/AssociationProfile";
import VolunteerProfile from "./component/volunteer/VolunteerProfile";
import Associations from "./component/Association";
import { LanguageProvider } from './context/LanguageContext';
import theme from './theme/chakraTheme';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <LanguageProvider>
                            <div className="App">
                                <Navbar />
                                <AppRoutes />
                            </div>
                            <Footer />
                        </LanguageProvider>
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </ChakraProvider>
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
            <Route path="/associations" element={<Associations />} />
            {/*<Route path="/aboutus" element={<AboutUs/>}/>*/}
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
            <Route
                path="/association/profile"
                element={
                    <ProtectedRoute allowedRoles={['ASSOCIATION']}>
                        <AssociationProfile />
                    </ProtectedRoute>
                }
            />

            {/* Volunteer routes */}
            <Route
                path="/volunteer/all-associations"
                element={
                    <ProtectedRoute allowedRoles={['BENEVOLE']}>
                        <AssociationList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/volunteer/sessions"
                element={
                    <ProtectedRoute allowedRoles={['BENEVOLE']}>
                        <SessionPage volunteerId={loggedvolunteerId} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/volunteer/profile"
                element={
                    <ProtectedRoute allowedRoles={['BENEVOLE']}>
                        <VolunteerProfile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
