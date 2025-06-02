import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaPhone,
    FaFilter,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import GuestService from '../service/GuestService';
import './Association.css';

// Translations object
const translations = {
    fr: {
        pageTitle: "Découvrir les Associations",
        pageDescription: "Trouvez et connectez-vous avec des associations qui font la différence dans votre communauté",
        searchPlaceholder: "Rechercher des associations...",
        filters: "Filtres",
        allCities: "Toutes les Villes",
        sortByName: "Trier par Nom d'Association",
        sortByCity: "Trier par Ville",
        noResults: "Aucune association ne correspond à vos critères.",
        addToFavorites: "Ajouter aux favoris",
        removeFromFavorites: "Retirer des favoris"
    },
    en: {
        pageTitle: "Discover Associations",
        pageDescription: "Find and connect with associations making a difference in your community",
        searchPlaceholder: "Search associations...",
        filters: "Filters",
        allCities: "All Cities",
        sortByName: "Sort by Association Name",
        sortByCity: "Sort by City",
        noResults: "No associations found matching your criteria.",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites"
    }
};

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
    const { language } = useLanguage();
    const t = translations[language];

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

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favoriteAssociations');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const toggleFavorite = (associationId) => {
        const newFavorites = favorites.includes(associationId)
            ? favorites.filter(id => id !== associationId)
            : [...favorites, associationId];

        setFavorites(newFavorites);
        localStorage.setItem('favoriteAssociations', JSON.stringify(newFavorites));
    };

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

    const cities = [...new Set(associations.map(a => a.ville))];

    return (
        <div className="associations-container">
            {/* Header Section */}
            <header className="associations-header">
                <h1>{t.pageTitle}</h1>
                <p>{t.pageDescription}</p>
            </header>

            {/* Search and Filter Section */}
            <section className="search-filter-section">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <button
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> {t.filters}
                    </button>
                    <div className={`filter-dropdown ${showFilters ? 'show' : ''}`}>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        >
                            <option value="">{t.allCities}</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">{t.sortByName}</option>
                            <option value="city">{t.sortByCity}</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Associations Grid */}
            <section className="associations-grid">
                {filteredAssociations.length === 0 ? (
                    <div className="no-results">
                        <p>{t.noResults}</p>
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
                                    aria-label={favorites.includes(association.id) ? t.removeFromFavorites : t.addToFavorites}
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