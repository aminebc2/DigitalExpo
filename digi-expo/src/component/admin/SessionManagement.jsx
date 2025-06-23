import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
    Button,
    ButtonGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    Text,
    Alert,
    AlertIcon,
    Spinner,
    Center,
    VStack,
    HStack,
    useDisclosure,
    Card,
    CardBody,
    Heading,
    Icon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import AdminService from '../../service/AdminService';
import AssignVolunteerToSession from './AssignVolunteerToSession';
import { useLanguage } from '../../context/LanguageContext';
import {
    FaCalendarAlt,
    FaCheck,
    FaTimes,
    FaExclamationCircle,
    FaUser,
    FaBuilding,
    FaClock,
    FaCog,
    FaEdit,
    FaUserPlus,
    FaTrash,
    FaChevronDown
} from 'react-icons/fa';

// Enhanced Purple-focused color palette
const colors = {
    primary: {
        purple: '#8B5CF6',
        lightPurple: '#A78BFA',
        darkPurple: '#7C3AED',
        white: '#FFFFFF'
    },
    purple: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#582C83'
    },
    neutrals: {
        lightGray: '#F8FAFC',
        mediumGray: '#94A3B8',
        darkGray: '#374151',
        black: '#000000'
    },
    accents: {
        teal: '#14B8A6',
        blue: '#3B82F6',
        darkTeal: '#0F766E',
        green: '#10B981',
        orange: '#F97316',
        gold: '#F59E0B',
        yellow: '#EAB308',
        red: '#9e0a0a'
    }
};

// French translations
const translations = {
    fr: {
        loading: "Chargement...",
        fetchError: "Une erreur s'est produite lors du chargement des sessions",
        fetchSessionError: "Échec du chargement des détails de la session",
        updateError: "Une erreur s'est produite lors de la mise à jour de la session",
        selectStatus: "Veuillez sélectionner un statut",
        deleteError: "Échec de la suppression de la session. Veuillez vérifier vos autorisations.",
        noSessions: "Aucune session trouvée",
        notAvailable: "N/A",
        sessionManagement: "Gestion des Sessions par Association",
        sessionManagementSubtitle: "Gérez et surveillez toutes les activités de session, groupées par association",
        table: {
            date: "Date",
            association: "Association",
            volunteer: "Bénévole",
            status: "Statut",
            actions: "Actions"
        },
        status: {
            pending: "PENDING",
            confirmed: "CONFIRMED",
            canceled: "CANCELED"
        },
        statusDisplay: {
            PENDING: "EN ATTENTE",
            CONFIRMED: "CONFIRMÉ",
            CANCELED: "ANNULÉ"
        },
        buttons: {
            edit: "Modifier",
            assign: "Assigner",
            delete: "Supprimer",
            cancel: "Annuler",
            update: "Mettre à jour",
            confirm: "Confirmer"
        },
        modals: {
            editStatus: {
                title: "Modifier le Statut de la Session",
                label: "Statut",
                selectPlaceholder: "Sélectionner un Statut",
                updating: "Mise à jour...",
                updateStatus: "Mettre à jour le Statut"
            },
            assignVolunteer: {
                title: "Assigner un Bénévole"
            },
            deleteSession: {
                title: "Supprimer la Session",
                confirmation: "Êtes-vous sûr de vouloir supprimer cette session ? Cette action ne peut pas être annulée.",
                details: {
                    date: "Date",
                    association: "Association",
                    status: "Statut"
                },
                deleting: "Suppression..."
            }
        }
    },
    en: {
        loading: "Loading...",
        fetchError: "An error occurred while fetching sessions",
        fetchSessionError: "Failed to fetch session details",
        updateError: "An error occurred while updating the session",
        selectStatus: "Please select a status",
        deleteError: "Failed to delete session. Please check your permissions.",
        noSessions: "No sessions found",
        notAvailable: "N/A",
        sessionManagement: "Session Management by Association",
        sessionManagementSubtitle: "Manage and monitor all session activities, grouped by association",
        table: {
            date: "Date",
            association: "Association",
            volunteer: "Volunteer",
            status: "Status",
            actions: "Actions"
        },
        status: {
            pending: "PENDING",
            confirmed: "CONFIRMED",
            canceled: "CANCELED"
        },
        statusDisplay: {
            PENDING: "PENDING",
            CONFIRMED: "CONFIRMED",
            CANCELED: "CANCELED"
        },
        buttons: {
            edit: "Edit",
            assign: "Assign",
            delete: "Delete",
            cancel: "Cancel",
            update: "Update",
            confirm: "Confirm"
        },
        modals: {
            editStatus: {
                title: "Edit Session Status",
                label: "Status",
                selectPlaceholder: "Select Status",
                updating: "Updating...",
                updateStatus: "Update Status"
            },
            assignVolunteer: {
                title: "Assign Volunteer"
            },
            deleteSession: {
                title: "Delete Session",
                confirmation: "Are you sure you want to delete this session? This action cannot be undone.",
                details: {
                    date: "Date",
                    association: "Association",
                    status: "Status"
                },
                deleting: "Deleting..."
            }
        }
    }
};

const STATUS_CONFIG = {
    PENDING: {
        bg: '#FFF3E0',
        color: '#B45309',
        icon: FaClock,
        fr: 'EN ATTENTE',
        en: 'PENDING'
    },
    CONFIRMED: {
        bg: '#E6F6EC',
        color: '#166534',
        icon: FaCheck,
        fr: 'CONFIRMÉ',
        en: 'CONFIRMED'
    },
    CANCELED: {
        bg: '#FEE2E2',
        color: '#9e0a0a',
        icon: FaTimes,
        fr: 'ANNULÉ',
        en: 'CANCELED'
    }
};

const SessionManagementByAssociation = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState('');
    const { language } = useLanguage();
    const t = translations[language];

    // Chakra UI modals
    const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();
    const { isOpen: isAssignModalOpen, onOpen: onAssignModalOpen, onClose: onAssignModalClose } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllSessions();
            if (response.statusCode === 200) {
                setSessions(response.data);
            } else {
                setError(response.message || t.fetchError);
            }
        } catch (err) {
            setError(t.fetchError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionClick = async (sessionId) => {
        setLoading(true);
        try {
            const session = await AdminService.getSessionById(sessionId);
            setSelectedSession(session);
            setSelectedSessionId(sessionId);
            setUpdatedStatus(session.status);
            onStatusModalOpen();
        } catch (err) {
            setError(t.fetchSessionError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSession = async (e) => {
        e.preventDefault();
        if (!selectedSessionId || !updatedStatus) {
            setError(t.selectStatus);
            return;
        }

        setLoading(true);
        try {
            const updatedSessionData = {
                status: updatedStatus,
                volunteer: (updatedStatus === t.status.confirmed) ? selectedSession.volunteer : null
            };

            await AdminService.updateSession(selectedSessionId, updatedSessionData);
            setError('');
            onStatusModalClose();
            fetchSessions();
        } catch (err) {
            setError(t.updateError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeStatusModal = () => {
        onStatusModalClose();
        setSelectedSession(null);
    };

    const handleOpenAssignModal = (session) => {
        setSelectedSession(session);
        onAssignModalOpen();
    };

    const closeAssignModal = () => {
        onAssignModalClose();
        setSelectedSession(null);
        fetchSessions();
    };

    const getStatusBadgeProps = (status) => {
        const normalizedStatus = status?.toUpperCase() || 'PENDING';
        const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.PENDING;

        return {
            bg: config.bg,
            color: config.color,
            icon: config.icon,
            text: language === 'fr' ? config.fr : config.en
        };
    };

    const getStatusIcon = (status) => {
        const normalizedStatus = status?.toUpperCase() || 'PENDING';
        const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.PENDING;
        return config.icon;
    };

    const handleDeleteClick = (session) => {
        setSelectedSession(session);
        onDeleteModalOpen();
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            const response = await AdminService.deleteSession(selectedSession.id);
            if (response.statusCode === 200) {
                onDeleteModalClose();
                setSelectedSession(null);
                await fetchSessions();
                setError('');
            } else {
                setError(response.message || t.deleteError);
            }
        } catch (err) {
            setError(err.message || t.deleteError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeDeleteModal = () => {
        onDeleteModalClose();
        setSelectedSession(null);
    };

    // Group sessions by association
    const groupedSessions = sessions.reduce((acc, session) => {
        const associationId = session.association?.id || 'unassigned';
        if (!acc[associationId]) {
            acc[associationId] = {
                association: session.association || { name: t.notAvailable },
                sessions: []
            };
        }
        acc[associationId].sessions.push(session);
        return acc;
    }, {});

    if (loading && sessions.length === 0) {
        return (
            <Center h="300px">
                <VStack spacing={6}>
                    <Spinner
                        size="xl"
                        color={colors.primary.purple}
                        thickness="4px"
                    />
                    <Text
                        fontSize="lg"
                        color={colors.purple[600]}
                        fontWeight="medium"
                    >
                        {t.loading}
                    </Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Box
            maxW="full"
            mx="auto"
            p={8}
            bgGradient={`linear(to-br, ${colors.purple[50]}, ${colors.primary.white})`}
            minH="100vh"
        >
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading
                        size="xl"
                        bgGradient={`linear(to-r, ${colors.purple[900]}, ${colors.purple[900]})`}
                        bgClip="text"
                        mb={2}
                        fontWeight="bold"
                    >
                        {t.sessionManagement}
                    </Heading>
                    <Text color={colors.black} fontSize="md" fontWeight="medium">
                        {t.sessionManagementSubtitle}
                    </Text>
                </Box>

                {error && (
                    <Alert
                        status="error"
                        borderRadius="lg"
                        bg={colors.accents.yellow}
                        color="white"
                        border="none"
                    >
                        <AlertIcon as={FaExclamationCircle} color="white" />
                        <Text fontWeight="medium">{error}</Text>
                    </Alert>
                )}

                <Accordion allowMultiple>
                    {Object.entries(groupedSessions).map(([associationId, { association, sessions }]) => (
                        <AccordionItem
                            key={associationId}
                            border="none"
                            mb={4}
                        >
                            <AccordionButton
                                bg={colors.purple[100]}
                                color={colors.purple[900]}
                                _hover={{ bg: colors.purple[200] }}
                                borderRadius="xl"
                                p={4}
                            >
                                <Box flex="1" textAlign="left">
                                    <HStack spacing={3}>
                                        <Icon as={FaBuilding} />
                                        <Text fontWeight="bold">{association.name}</Text>
                                        <Badge
                                            ml={2}
                                            colorScheme="purple"
                                            borderRadius="full"
                                            px={2}
                                        >
                                            {sessions.length} sessions
                                        </Badge>
                                    </HStack>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>

                            <AccordionPanel pb={4} px={0} mt={4}>
                                <Card
                                    bg={colors.primary.white}
                                    shadow="xl"
                                    borderRadius="2xl"
                                    border="2px solid"
                                    borderColor={colors.purple[200]}
                                >
                                    <CardBody p={0}>
                                        <TableContainer>
                                            <Table variant="simple">
                                                <Thead
                                                    bgGradient={`linear(to-r, ${colors.purple[100]}, ${colors.purple[50]})`}
                                                >
                                                    <Tr>
                                                        <Th color={colors.purple[900]}>
                                                            <HStack spacing={3}>
                                                                <Icon as={FaCalendarAlt} />
                                                                <Text>{t.table.date}</Text>
                                                            </HStack>
                                                        </Th>
                                                        <Th color={colors.purple[900]}>
                                                            <HStack spacing={3}>
                                                                <Icon as={FaUser} />
                                                                <Text>{t.table.volunteer}</Text>
                                                            </HStack>
                                                        </Th>
                                                        <Th color={colors.purple[900]}>
                                                            <HStack spacing={3}>
                                                                <Icon as={FaClock} />
                                                                <Text>{t.table.status}</Text>
                                                            </HStack>
                                                        </Th>
                                                        <Th color={colors.purple[900]}>
                                                            <HStack spacing={3}>
                                                                <Icon as={FaCog} />
                                                                <Text>{t.table.actions}</Text>
                                                            </HStack>
                                                        </Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {sessions.map((session, index) => (
                                                        <Tr
                                                            key={session.id}
                                                            bg={index % 2 === 0 ? colors.primary.white : colors.purple[50]}
                                                            _hover={{
                                                                bg: colors.purple[100],
                                                                transform: 'translateY(-1px)',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <Td py={4}>
                                                                {new Date(session.date).toLocaleDateString(language)}
                                                            </Td>
                                                            <Td>
                                                                {session.status === t.status.confirmed && session.volunteer
                                                                    ? session.volunteer.fullName
                                                                    : t.notAvailable}
                                                            </Td>
                                                            <Td>
                                                                <Badge
                                                                    px={3}
                                                                    py={1}
                                                                    borderRadius="full"
                                                                    bg={getStatusBadgeProps(session.status).bg}
                                                                    color={getStatusBadgeProps(session.status).color}
                                                                >
                                                                    <HStack spacing={2}>
                                                                        <Icon as={getStatusBadgeProps(session.status).icon} />
                                                                        <Text>{getStatusBadgeProps(session.status).text}</Text>
                                                                    </HStack>
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <ButtonGroup size="sm" spacing={2}>
                                                                    <Button
                                                                        leftIcon={<FaEdit />}
                                                                        bg="#582C83"
                                                                        color="white"
                                                                        _hover={{ opacity: 0.8 }}
                                                                        onClick={() => handleSessionClick(session.id)}
                                                                    >
                                                                        {t.buttons.edit}
                                                                    </Button>

                                                                    {session.status === t.status.confirmed && (
                                                                        <Button
                                                                            leftIcon={<FaUserPlus />}
                                                                            bg={STATUS_CONFIG.CONFIRMED.bg}
                                                                            color={STATUS_CONFIG.CONFIRMED.color}
                                                                            _hover={{ opacity: 0.8 }}
                                                                            onClick={() => handleOpenAssignModal(session)}
                                                                        >
                                                                            {t.buttons.assign}
                                                                        </Button>
                                                                    )}

                                                                    <Button
                                                                        leftIcon={<FaTrash />}
                                                                        bg={STATUS_CONFIG.CANCELED.bg}
                                                                        color={STATUS_CONFIG.CANCELED.color}
                                                                        _hover={{ opacity: 0.8 }}
                                                                        onClick={() => handleDeleteClick(session)}
                                                                    >
                                                                        {t.buttons.delete}
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </CardBody>
                                </Card>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </VStack>

            {/* Status Modal */}
            <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal}>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor="white"
                >
                    <ModalHeader
                        bg="#582C83"
                        color="white"
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaCog} />
                            <Text>{t.modals.editStatus.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <form onSubmit={handleUpdateSession}>
                        <ModalBody py={6}>
                            <FormControl isRequired>
                                <FormLabel color="#582C83">
                                    {t.modals.editStatus.label}
                                </FormLabel>
                                <Select
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                    placeholder={t.modals.editStatus.selectPlaceholder}
                                >
                                    {Object.keys(STATUS_CONFIG).map((status) => (
                                        <option key={status} value={status}>
                                            {language === 'fr' ? STATUS_CONFIG[status].fr : STATUS_CONFIG[status].en}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup spacing={3}>
                                <Button onClick={closeStatusModal}>
                                    {t.buttons.cancel}
                                </Button>
                                <Button
                                    type="submit"
                                    bg="#582C83"
                                    color="white"
                                    _hover={{ opacity: 0.8 }}
                                    isLoading={loading}
                                >
                                    {t.modals.editStatus.updateStatus}
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Assign Volunteer Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} size="xl">
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor="white"
                >
                    <ModalHeader
                        bg={STATUS_CONFIG.CONFIRMED.bg}
                        color={STATUS_CONFIG.CONFIRMED.color}
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaUserPlus} />
                            <Text>{t.modals.assignVolunteer.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color={STATUS_CONFIG.CONFIRMED.color} />
                    <ModalBody py={6}>
                        {selectedSession && (
                            <AssignVolunteerToSession
                                sessionId={selectedSession.id}
                                associationId={selectedSession.association?.id}
                                onClose={closeAssignModal}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor="white"
                >
                    <ModalHeader
                        bg={STATUS_CONFIG.CANCELED.bg}
                        color={STATUS_CONFIG.CANCELED.color}
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaTrash} />
                            <Text>{t.modals.deleteSession.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color={STATUS_CONFIG.CANCELED.color} />
                    <ModalBody py={6}>
                        <Text>{t.modals.deleteSession.confirmation}</Text>
                        {selectedSession && (
                            <Box mt={4} p={4} bg={colors.purple[50]} borderRadius="md">
                                <VStack align="start" spacing={2}>
                                    <Text>
                                        <strong>{t.modals.deleteSession.details.date}:</strong>{' '}
                                        {new Date(selectedSession.date).toLocaleDateString(language)}
                                    </Text>
                                    <Text>
                                        <strong>{t.modals.deleteSession.details.association}:</strong>{' '}
                                        {selectedSession.association?.name || t.notAvailable}
                                    </Text>
                                    <Text>
                                        <strong>{t.modals.deleteSession.details.status}:</strong>{' '}
                                        {selectedSession.status}
                                    </Text>
                                </VStack>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={3}>
                            <Button onClick={closeDeleteModal}>
                                {t.buttons.cancel}
                            </Button>
                            <Button
                                bg={STATUS_CONFIG.CANCELED.bg}
                                color={STATUS_CONFIG.CANCELED.color}
                                _hover={{ opacity: 0.8 }}
                                onClick={handleDeleteConfirm}
                                isLoading={loading}
                            >
                                {t.buttons.delete}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default SessionManagementByAssociation;