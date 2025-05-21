// SessionPage.jsx

import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService';
import { Card, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AssociationService from "../../service/AssociationService";

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await VolunteerService.getSessions(volunteerId);

                const sessionsList = response?.data || [];

                if (Array.isArray(sessionsList)) {
                    setSessions(sessionsList);
                } else {
                    console.warn('sessionList is not an array:', sessionsList);
                    setSessions([]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setSessions([]);
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchSessions();
        }
    }, [volunteerId]);

    const handleShowDetails = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Mes Sessions Assignées</h3>

            {error && <p className="text-danger text-center">{error}</p>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : sessions.length > 0 ? (
                <Row>
                    {sessions.map((session) => (
                        <Col md={4} key={session.id} className="mb-4">
                            <Card className="shadow-sm border-light purple">
                                <Card.Body>
                                    <Card.Text>
                                        <strong>Date:</strong> {session.date}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Status:</strong> {session.status}
                                    </Card.Text>
                                    {/*<Card.Text>
                                        <strong>Association:</strong> {session.association?.name || 'N/A'}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Association Email:</strong> {session.association?.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Responsable:</strong> {session.association?.responsableName || 'N/A'}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Responsable Tel:</strong> {session.association?.responsablePhone || 'N/A'}
                                    </Card.Text>*/}

                                    <Button variant="primary" style={{ width: '100%' }} onClick={() => handleShowDetails(session)}>
                                        Voir Détails
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">
                    <p>Aucune session assignée.</p>
                </div>
            )}

            {selectedSession && (
                <Modal show={showModal} onHide={handleCloseModal} key={selectedSession.id}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails de la session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Date:</strong> {selectedSession.date}</p>
                        <p><strong>Status:</strong> {selectedSession.status}</p>
                        <p><strong>Association:</strong> {selectedSession.association?.name || 'N/A'}</p>
                        <p><strong> Association Email: </strong> {selectedSession.association?.email || 'N/A'}</p>
                        <p><strong>Responsable Name:</strong> {selectedSession.association?.responsableName || 'N/A'}</p>
                        <p><strong>Responsable Tel:</strong> {selectedSession.association?.responsablePhone || 'N/A'}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default SessionPage;