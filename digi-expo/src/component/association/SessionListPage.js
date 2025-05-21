import React, { useState, useEffect } from 'react';
import AssociationService from '../../service/AssociationService';
import { Card, Button, Row, Col, Modal, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
    COMPLETED: 'primary',
};

const SessionListPage = () => {
    const [sessions, setSessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await AssociationService.getSessions(associationId);
                const sessionsList = response?.sessionList || [];
                if (Array.isArray(sessionsList)) {
                    setSessions(sessionsList);
                } else {
                    console.warn('sessionList is not an array:', sessionsList);
                    setSessions([]);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setSessions([]);
            }
        };

        if (associationId) fetchSessions();
    }, [associationId]);

    const handleShowDetails = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSession(null);
    };

    const renderVolunteerDetails = (volunteer) => {
        if (volunteer) {
            return (
                <div className="volunteer-details">
                    <p><strong>Username:</strong> {volunteer.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {volunteer.email || 'Not Provided'}</p>
                    <p><strong>Phone Number:</strong> {volunteer.phoneNumber || 'Not Provided'}</p>
                </div>
            );
        }
        return <p className="text-muted">No volunteer assigned.</p>;
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-5" style={{ fontWeight: '700', color: '#2c3e50', letterSpacing: '1.1px' }}>
                Liste des Sessions
            </h3>

            {sessions.length > 0 ? (
                <Row xs={1} md={3} className="g-4">
                    {sessions.map((session) => (
                        <Col key={session.id}>
                            <Card className="session-card shadow-sm border-0 h-100">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title className="mb-3" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#34495e' }}>
                                            {new Date(session.date).toLocaleDateString('fr-FR', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </Card.Title>
                                        <Badge
                                            bg={statusVariantMap[session.status?.toUpperCase()] || 'secondary'}
                                            className="mb-3"
                                            style={{ fontSize: '0.9rem', padding: '0.4em 0.8em', letterSpacing: '0.05em' }}
                                        >
                                            {session.status}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleShowDetails(session)}
                                        className="mt-auto"
                                        style={{ fontWeight: '600', borderRadius: '8px' }}
                                    >
                                        Voir Détails
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5 text-muted" style={{ fontSize: '1.1rem' }}>
                    <p>Aucune session disponible.</p>
                </div>
            )}

            {selectedSession && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton style={{ backgroundColor: '#f1f3f5' }}>
                        <Modal.Title>Détails de la session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <strong>Date:</strong>{' '}
                            {new Date(selectedSession.date).toLocaleDateString('fr-FR', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <Badge bg={statusVariantMap[selectedSession.status?.toUpperCase()] || 'secondary'}>
                                {selectedSession.status}
                            </Badge>
                        </p>
                        <hr />
                        <h5>Détails du bénévole</h5>
                        {renderVolunteerDetails(selectedSession.volunteer)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <style jsx>{`
        .session-card:hover {
          box-shadow: 0 12px 20px rgba(39, 174, 96, 0.35);
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }

        .session-card {
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .volunteer-details p {
          margin-bottom: 6px;
          color: #2c3e50;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default SessionListPage;