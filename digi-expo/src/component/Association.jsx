import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaPhone,
    FaFilter,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
import GuestService from '../service/GuestService';
import './Association.css';

const Associations = () => {
    const [associations, setAssociations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        category: '',
    });
    const [sortBy, setSortBy] = useState('name');
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch associations
    useEffect(() => {
        const fetchAssociations = async () => {
            try {
                setLoading(true);
                const response = await GuestService.getAllAssociations();
                if (response.statusCode === 200) {
                    setAssociations(response.associations || []);
                    setError(null);
                } else {
                    setError(response.message || 'Failed to load associations');
                }
            } catch (err) {
                setError('Failed to fetch associations');
            } finally {
                setLoading(false);
            }
        };

        fetchAssociations();
    }, []);

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favoriteAssociations');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage
    const toggleFavorite = (associationId) => {
        const newFavorites = favorites.includes(associationId)
            ? favorites.filter(id => id !== associationId)
            : [...favorites, associationId];

        setFavorites(newFavorites);
        localStorage.setItem('favoriteAssociations', JSON.stringify(newFavorites));
    };

    // Filter and sort associations
    const filteredAssociations = associations
        .filter(association => {
            const matchesSearch = association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                association.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = !filters.city || association.ville.toLowerCase() === filters.city.toLowerCase();
            const matchesCategory = !filters.category || association.category === filters.category;

            return matchesSearch && matchesCity && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'city') {
                return a.ville.localeCompare(b.ville);
            }
            return 0;
        });

    // Get unique cities for filter
    const cities = [...new Set(associations.map(a => a.ville))];

    if (loading) {
        return (
            <div className="associations-loading">
                <div className="loading-spinner"></div>
                <p>Loading associations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="associations-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="associations-container">
            {/* Header Section */}
            <header className="associations-header">
                <h1>Discover Associations</h1>
                <p>Find and connect with associations making a difference in your community</p>
            </header>

            {/* Search and Filter Section */}
            <section className="search-filter-section">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search associations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <button
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filters
                    </button>
                    <div className={`filter-dropdown ${showFilters ? 'show' : ''}`}>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort by Association Name</option>
o                        </select>
                    </div>
                </div>
            </section>

            {/* Associations Grid */}
            <section className="associations-grid">
                {filteredAssociations.length === 0 ? (
                    <div className="no-results">
                        <p>No associations found matching your criteria.</p>
                    </div>
                ) : (
                    filteredAssociations.map(association => (
                        <article key={association.id} className="association-card">
                            <div className="card-image">
                                <img
                                    src={association.imageFileName
                                        ? `http://localhost:8080/images/${association.imageFileName}`
                                        : null
                                    }
                                    alt={association.name}
                                    onError={(e) => {
                                        if (!e.target.src.includes('/images/default-association.jpg')) {
                                            e.target.src = '/images/default-association.jpg';
                                        }
                                    }}
                                />
                                <button
                                    className="favorite-button"
                                    onClick={() => toggleFavorite(association.id)}
                                    aria-label={favorites.includes(association.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {favorites.includes(association.id) ? <FaHeart /> : <FaRegHeart />}
                                </button>
                            </div>
                            <div className="card-content">
                                <h2>{association.name}</h2>
                                <p></p>
                                <p className="location">
                                    <FaMapMarkerAlt/> {association.ville}
                                </p>
                                <p className="location">
                                    <FaPhone/> {association.responsablePhone}
                                </p>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
};

export default Associations;