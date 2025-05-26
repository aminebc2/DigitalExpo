import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderRoleBasedLinks = () => {
        if (!currentUser?.role) return null;

        switch (currentUser.role) {
            case 'ADMIN':
                return (
                    <li className="nav-item">
                        <Link className="nav-link text-purple" to="/admin">Dashboard</Link>
                    </li>
                );
            case 'BENEVOLE':
                return (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/all-associations">Associations</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/sessions">My Sessions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/profile">Profile</Link>
                        </li>
                    </>
                );
            case 'ASSOCIATION':
                return (
                    <>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-purple"
                                to={localStorage.getItem('associationId') ? `/association/reserve/${localStorage.getItem('associationId')}` : '#'}
                            >
                                Réserver
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/sessions">Sessions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/volunteers">Volunteers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/profile">Profile</Link>
                        </li>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white">
            <div className="container">
                <Link className="navbar-brand text-purple" to="/home">
                    <img
                        src="/Digi-expo.png"
                        alt="Logo"
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    DXC CDG DIGITAL EXPO
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-purple" to="/home">Home</Link>
                                </li>
                                {renderRoleBasedLinks()}
                                <li className="nav-item">
                                    <button className="btn btn-outline-purple nav-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link btn-outline-purple" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn-purple" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;