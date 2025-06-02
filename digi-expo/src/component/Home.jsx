import React, { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaArrowLeft,
    FaArrowRight,
    FaHandsHelping,
    FaHeart, FaPhone,
} from 'react-icons/fa';
import GuestService from '../service/GuestService';
import './HomePage.css';

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [associations, setAssociations] = useState([]);

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
                // Fetch all associations
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

    // Auto-advance slideshow
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, [associations.length]);

    if (loading) {
        return (
            <div className="home-loading">
                <div className="spinner"></div>
                <p>Loading content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Platform Description Section */}
            <section className="platform-description">
                <h1>Welcome to Digital Explorers</h1>
                <div className="description-content">
                    <div className="description-text">
                        <h2>Connecting Communities Through Service</h2>
                        <p>Our platform brings together associations and volunteers, creating meaningful connections and positive change in communities. We make it easy for associations to manage their activities and for volunteers to find opportunities to make a difference.</p>
                        <div className="key-features">
                            <div className="feature">
                                <FaHandsHelping />
                                <h3>Easy Coordination</h3>
                                <p>Streamlined session management and volunteer assignment</p>
                            </div>
                            <div className="feature">
                                <FaHeart />
                                <h3>Community Impact</h3>
                                <p>Make a real difference in your local community</p>
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
                <h2>Featured Associations</h2>
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

                                        // Check if we need to add file extension
                                        const imageUrl = imageFileName
                                            ? `http://localhost:8080/images/${imageFileName}`: null


                                        return (
                                            <img
                                                src={imageUrl}
                                                alt={associations[currentSlide].name}
                                                className="association-image"
                                                onError={(e) => {
                                                    // Try fallback to direct file path
                                                    if (!e.target.src.includes('/images/default-association.jpg')) {
                                                        e.target.src = `http://localhost:8080/images/${imageFileName}`;
                                                        // If fallback also fails, use default image
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
                                        <FaBuilding /> {associations[currentSlide].ville}
                                    </p>
                                    <p className="association-phone">
                                        <FaPhone/> {associations[currentSlide].responsablePhone}
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
