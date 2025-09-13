import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { registerAssociation, registerVolunteer } from '../../service/AuthService';
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
        registrationSuccess: "Inscription réussie. Veuillez vous connecter.",
        name: "Nom",
        enterName: "Entrez le nom de l'association",
        enterVille: "Entrez la ville",
        ville: "Ville",
        responsableName: "Nom du responsable",
        enterResponsablePhone: "Entrez le numero de téléphone du responsable",
        responsablePhone: "Téléphone du responsable",
        enterResponsableName: "Entrez le nom du responsable",
        phoneNumber: "Numéro de téléphone",
        enterPhoneNumber: "Entrez votre numero de téléphone",
        fullName: "Nom complet",
        enterFullName: "Entrez votre nom complet",
        availableDays: "Jours disponibles",
        monday: "Lundi",
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi",
        saturday: "Samedi",
        sunday: "Dimanche"
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
        registrationSuccess: "Registration successful. Please login.",
        // New translations
        name: "Name",
        enterName: "Enter your association name",
        ville: "City",
        enterVille: "Enter your city",
        responsableName: "Responsible Person Name",
        enterResponsableName: "Enter your responsable name",
        responsablePhone: "Responsible Person Phone",
        enterResponsablePhone: "Enter your responsable phone",
        phoneNumber: "Phone Number",
        enterPhoneNumber: "Enter your phone number",
        enterFullName: "Enter your fullname",
        fullName: "Full Name",
        availableDays: "Available Days",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
    }
};

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'BENEVOLE',
        // Association fields
        name: '',
        ville: '',
        responsableName: '',
        responsablePhone: '',
        // Volunteer fields
        phoneNumber: '',
        fullName: '',
        availableDays: []
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

    const handleDayChange = (day) => {
        const updatedDays = formData.availableDays.includes(day)
            ? formData.availableDays.filter(d => d !== day)
            : [...formData.availableDays, day];
        setFormData({
            ...formData,
            availableDays: updatedDays
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const registerData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            if (formData.role === 'ASSOCIATION') {
                registerData.name = formData.name;
                registerData.ville = formData.ville;
                registerData.responsableName = formData.responsableName;
                registerData.responsablePhone = formData.responsablePhone;
                await registerAssociation(registerData);
            } else {
                registerData.phoneNumber = formData.phoneNumber;
                registerData.fullName = formData.fullName;
                registerData.availableDays = formData.availableDays;
                await registerVolunteer(registerData);
            }

            navigate('/login', { state: { message: t.registrationSuccess } });
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

                        {formData.role === 'ASSOCIATION' ? (
                            // Association specific fields
                            <>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">{t.name}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ville" className="form-label">{t.ville}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ville"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterVille}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="responsableName" className="form-label">{t.responsableName}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="responsableName"
                                        name="responsableName"
                                        value={formData.responsableName}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterResponsableName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="responsablePhone" className="form-label">{t.responsablePhone}</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="responsablePhone"
                                        name="responsablePhone"
                                        value={formData.responsablePhone}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterResponsablePhone}
                                    />
                                </div>
                            </>
                        ) : (
                            // Volunteer specific fields
                            <>
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">{t.fullName}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterFullName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber" className="form-label">{t.phoneNumber}</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.enterPhoneNumber}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t.availableDays}</label>
                                    <div className="days-checkboxes">
                                        {DAYS_OF_WEEK.map(day => (
                                            <div key={day} className="day-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={day}
                                                    checked={formData.availableDays.includes(day)}
                                                    onChange={() => handleDayChange(day)}
                                                />
                                                <label htmlFor={day}>{t[day.toLowerCase()]}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

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