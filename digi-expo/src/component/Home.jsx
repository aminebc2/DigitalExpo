import React, { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaArrowLeft,
    FaArrowRight,
    FaHandsHelping,
    FaHeart, FaPhone,
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import GuestService from '../service/GuestService';
import './HomePage.css';

// Translations object
const translations = {
    fr: {
        welcome: "Bienvenue à Digital Explorers",
        connectingCommunities: "Connecter les Communautés par le Service",
        platformDescription: "Notre plateforme réunit associations et bénévoles, créant des liens significatifs et des changements positifs dans les communautés. Nous facilitons la gestion des activités pour les associations et permettons aux bénévoles de trouver des opportunités pour faire la différence.",
        easyCoordination: "Coordination Facile",
        coordinationDesc: "Gestion simplifiée des sessions et affectation des bénévoles",
        communityImpact: "Impact Communautaire",
        impactDesc: "Faites une réelle différence dans votre communauté locale",
        featuredAssociations: "Associations en Vedette",
        city: "Ville",
        phone: "Téléphone"
    },
    en: {
        welcome: "Welcome to Digital Explorers",
        connectingCommunities: "Connecting Communities Through Service",
        platformDescription: "Our platform brings together associations and volunteers, creating meaningful connections and positive change in communities. We make it easy for associations to manage their activities and for volunteers to find opportunities to make a difference.",
        easyCoordination: "Easy Coordination",
        coordinationDesc: "Streamlined session management and volunteer assignment",
        communityImpact: "Community Impact",
        impactDesc: "Make a real difference in your local community",
        featuredAssociations: "Featured Associations",
        city: "City",
        phone: "Phone"
    }
};

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [associations, setAssociations] = useState([]);
    const { language } = useLanguage();
    const t = translations[language];

    const platformImages = [
        '/images/1.jpg',
        '/images/2.webp',
        '/images/3.avif',
        '/images/4.jpg'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await GuestService.getAllAssociations();
                if (response.statusCode === 200) {
                    setAssociations(response.associations || []);
                } else {
                    setError(response.message || "Failed to load associations");
                }
                setError(null);
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % associations.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + associations.length) % associations.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [associations.length]);

    return (
        <div className="home-container">
            {/* Platform Description Section */}
            <section className="platform-description">
                <h1>{t.welcome}</h1>
                <div className="description-content">
                    <div className="description-text">
                        <h2>{t.connectingCommunities}</h2>
                        <p>{t.platformDescription}</p>
                        <div className="key-features">
                            <div className="feature">
                                <FaHandsHelping />
                                <h3>{t.easyCoordination}</h3>
                                <p>{t.coordinationDesc}</p>
                            </div>
                            <div className="feature">
                                <FaHeart />
                                <h3>{t.communityImpact}</h3>
                                <p>{t.impactDesc}</p>
                            </div>
                        </div>
                    </div>
                    <div className="platform-images">
                        {platformImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Platform showcase ${index + 1}`}
                                className="platform-image"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Associations Slideshow */}
            <section className="associations-slideshow">
                <h2>{t.featuredAssociations}</h2>
                <div className="slideshow-container">
                    <button className="slide-arrow prev" onClick={prevSlide}>
                        <FaArrowLeft />
                    </button>
                    <div className="slide-content">
                        {associations.length > 0 && (
                            <div className="association-slide">
                                <div className="association-image-container">
                                    {(() => {
                                        const imageFileName = associations[currentSlide].imageFileName;
                                        const imageUrl = imageFileName
                                            ? `http://localhost:8080/images/${imageFileName}`: null

                                        return (
                                            <img
                                                src={imageUrl}
                                                alt={associations[currentSlide].name}
                                                className="association-image"
                                                onError={(e) => {
                                                    if (!e.target.src.includes('/images/default-association.jpg')) {
                                                        e.target.src = `http://localhost:8080/images/${imageFileName}`;
                                                        e.target.onerror = (e2) => {
                                                            e2.target.onerror = null;
                                                        };
                                                    } else {
                                                        e.target.onerror = null;
                                                    }
                                                }}
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f5f5f5'
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                                <div className="association-info">
                                    <h3>{associations[currentSlide].name}</h3>
                                    <p className="association-location">
                                        <FaBuilding /> {t.city}: {associations[currentSlide].ville}
                                    </p>
                                    <p className="association-phone">
                                        <FaPhone/> {t.phone}: {associations[currentSlide].responsablePhone}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="slide-arrow next" onClick={nextSlide}>
                        <FaArrowRight />
                    </button>
                    <div className="slide-indicators">
                        {associations.map((_, index) => (
                            <button
                                key={index}
                                className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
