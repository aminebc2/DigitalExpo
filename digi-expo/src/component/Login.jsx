import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { loginUser } from '../service/AuthService';
import './Auth.css';

// Translations object
const translations = {
    fr: {
        signIn: "Se connecter",
        email: "Email",
        password: "Mot de passe",
        enterEmail: "Entrez votre email",
        enterPassword: "Entrez votre mot de passe",
        signingIn: "Connexion en cours...",
        loginFailed: "La connexion a échoué",
        errorOccurred: "Une erreur s'est produite lors de la connexion",
        noAccount: "Vous n'avez pas de compte ?",
        signUp: "S'inscrire",
        welcomeBack: "Bienvenue !",
        welcomeMessage: "Entrez vos informations personnelles et commencez votre voyage avec nous"
    },
    en: {
        signIn: "Sign in",
        email: "Email",
        password: "Password",
        enterEmail: "Enter your email",
        enterPassword: "Enter your password",
        signingIn: "Signing in...",
        loginFailed: "Login failed",
        errorOccurred: "An error occurred during login",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        welcomeBack: "Welcome Back!",
        welcomeMessage: "Enter your personal details and start your journey with us"
    }
};

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const { language } = useLanguage();
    const navigate = useNavigate();
    const t = translations[language];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser(credentials);
            if (response.statusCode === 200) {
                login(response.data.user, response.data.token);
                navigate('/home');
            } else {
                setError(response.message || t.loginFailed);
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
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>{t.signIn}</h1>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">{t.email}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={credentials.username}
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
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                placeholder={t.enterPassword}
                            />
                        </div>
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? t.signingIn : t.signIn}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p>
                            {t.noAccount} <Link to="/register" className="auth-link">{t.signUp}</Link>
                        </p>
                    </div>
                </div>
                <div className="welcome-container">
                    <h2>{t.welcomeBack}</h2>
                    <p>{t.welcomeMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
