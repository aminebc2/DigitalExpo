import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { registerUser } from '../../service/AuthService';
import './Auth.css';

// Translations object
const translations = {
    fr: {
        welcome: "Bienvenue !",
        welcomeMessage: "Pour rester connecté avec nous, veuillez vous connecter avec vos informations personnelles",
        createAccount: "Créer un compte",
        username: "Nom d'utilisateur",
        email: "Email",
        password: "Mot de passe",
        chooseUsername: "Choisissez un nom d'utilisateur",
        enterEmail: "Entrez votre email",
        createPassword: "Créez un mot de passe",
        registerAs: "Je souhaite m'inscrire en tant que",
        volunteer: "Bénévole",
        association: "Association",
        creatingAccount: "Création du compte...",
        signUp: "S'inscrire",
        haveAccount: "Vous avez déjà un compte ?",
        signIn: "Se connecter",
        registrationFailed: "L'inscription a échoué",
        errorOccurred: "Une erreur s'est produite lors de l'inscription",
        registrationSuccess: "Inscription réussie. Veuillez vous connecter."
    },
    en: {
        welcome: "Welcome!",
        welcomeMessage: "To keep connected with us please login with your personal info",
        createAccount: "Create Account",
        username: "Username",
        email: "Email",
        password: "Password",
        chooseUsername: "Choose a username",
        enterEmail: "Enter your email",
        createPassword: "Create a password",
        registerAs: "I want to register as",
        volunteer: "Volunteer",
        association: "Association",
        creatingAccount: "Creating Account...",
        signUp: "Sign up",
        haveAccount: "Already have an account?",
        signIn: "Sign in",
        registrationFailed: "Registration failed",
        errorOccurred: "An error occurred during registration",
        registrationSuccess: "Registration successful. Please login."
    }
};

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'BENEVOLE'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await registerUser(formData);
            if (response.statusCode === 201) {
                navigate('/login', { state: { message: t.registrationSuccess } });
            } else {
                setError(response.message || t.registrationFailed);
            }
        } catch (err) {
            setError(err.message || t.errorOccurred);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="welcome-container">
                    <h2>{t.welcome}</h2>
                    <p>{t.welcomeMessage}</p>
                </div>
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>{t.createAccount}</h1>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">{t.username}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder={t.chooseUsername}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">{t.email}</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder={t.enterEmail}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">{t.password}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder={t.createPassword}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role" className="form-label">{t.registerAs}</label>
                            <select
                                className="form-select"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="BENEVOLE">{t.volunteer}</option>
                                <option value="ASSOCIATION">{t.association}</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? t.creatingAccount : t.signUp}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p>
                            {t.haveAccount} <Link to="/login" className="auth-link">{t.signIn}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
