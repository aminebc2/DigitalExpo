import React, { useState, useEffect } from 'react';
import AssociationService from '../../service/AssociationService';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SessionListPage = ({ associationId }) => {
    const [sessions, setSessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await AssociationService.getSessions(associationId);
                console.log('Fetched sessions:', response);
                const sessionsList = response?.sessionList;
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
        console.log("Selected session:", session);
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
                <>
                    <p><strong>Username:</strong> {volunteer.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {volunteer.email || 'Not Provided'}</p>
                    <p><strong>Phone Number:</strong> {volunteer.phoneNumber || 'Not Provided'}</p>
                </>
            );
        }
        return <p>No volunteer assigned.</p>;
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Liste des Sessions</h3>
            {sessions.length > 0 ? (
                <Row>
                    {sessions.map((session) => (
                        <Col md={4} key={session.id} className="mb-4">
                            <Card className="shadow-sm border-light">
                                <Card.Body>
                                    <Card.Text>
                                        <strong>Date:</strong> {session.date}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Status:</strong> {session.status}
                                    </Card.Text>
                                    <Button variant="primary" block onClick={() => handleShowDetails(session)}>
                                        Voir Détails
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">
                    <p>Aucune session disponible.</p>
                </div>
            )}

            {/* Modal for showing session details */}
            {selectedSession && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails de la session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Date:</strong> {selectedSession.date}</p>
                        <p><strong>Status:</strong> {selectedSession.status}</p>
                        <h5>Volunteer Details:</h5>
                        {renderVolunteerDetails(selectedSession.volunteer)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default SessionListPage;
