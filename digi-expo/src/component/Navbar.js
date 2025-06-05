import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
    const { language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const renderRoleBasedLinks = () => {
        if (!currentUser?.role) return null;

        switch (currentUser.role) {
            case 'ADMIN':
                return (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/associations" onClick={closeMenu}>
                                {language === 'fr' ? 'Associations' : 'Associations'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/admin" onClick={closeMenu}>
                                {language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                            </Link>
                        </li>
                    </>
                );
            case 'BENEVOLE':
                return (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/all-associations" onClick={closeMenu}>
                                {language === 'fr' ? 'Associations' : 'Associations'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/sessions" onClick={closeMenu}>
                                {language === 'fr' ? 'Mes Sessions' : 'My Sessions'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/volunteer/profile" onClick={closeMenu}>
                                {language === 'fr' ? 'Profil' : 'Profile'}
                            </Link>
                        </li>
                    </>
                );
            case 'ASSOCIATION':
                return (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/associations" onClick={closeMenu}>
                                {language === 'fr' ? 'Associations' : 'Associations'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link text-purple"
                                to={currentUser?.id ? `/association/reserve/${currentUser.id}` : '#'}
                                onClick={closeMenu}
                            >
                                {language === 'fr' ? 'Réserver' : 'Book'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/sessions" onClick={closeMenu}>
                                {language === 'fr' ? 'Sessions' : 'Sessions'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/volunteers" onClick={closeMenu}>
                                {language === 'fr' ? 'Bénévoles' : 'Volunteers'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-purple" to="/association/profile" onClick={closeMenu}>
                                {language === 'fr' ? 'Profil' : 'Profile'}
                            </Link>
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
                <Link className="navbar-brand text-purple" to="/home" onClick={closeMenu}>
                    <img
                        src="/Digi-expo.png"
                        alt="Logo"
                        className="navbar-logo"
                    />
                    <span className="brand-text">DXC CDG DIGITAL EXPO</span>
                </Link>
                <button
                    className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`}
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-purple" to="/home" onClick={closeMenu}>
                                        {language === 'fr' ? 'Accueil' : 'Home'}
                                    </Link>
                                </li>
                                {renderRoleBasedLinks()}
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-purple nav-link"
                                        onClick={() => {
                                            handleLogout();
                                            closeMenu();
                                        }}
                                    >
                                        {language === 'fr' ? 'Déconnexion' : 'Logout'}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link btn-outline-purple" to="/home" onClick={closeMenu}>
                                        {language === 'fr' ? 'Accueil' : 'Home'}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn-outline-purple" to="/associations" onClick={closeMenu}>
                                        {language === 'fr' ? 'Associations' : 'Associations'}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn-outline-purple" to="/login" onClick={closeMenu}>
                                        {language === 'fr' ? 'Connexion' : 'Login'}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn-purple" to="/register" onClick={closeMenu}>
                                        {language === 'fr' ? "S'inscrire" : 'Register'}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <button
                                className="btn btn-outline-purple nav-link language-switcher"
                                onClick={() => {
                                    toggleLanguage();
                                    closeMenu();
                                }}
                            >
                                {language === 'fr' ? 'EN' : 'FR'}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
