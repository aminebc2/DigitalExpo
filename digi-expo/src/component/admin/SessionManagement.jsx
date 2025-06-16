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
    Icon
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
    FaTrash
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
        900: '#4C1D95'
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
        red: '#c80e0e'
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
        sessionManagement: "Gestion des Sessions",
        sessionManagementSubtitle: "Gérez et surveillez toutes les activités de session",
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
        sessionManagement: "Session Management",
        sessionManagementSubtitle: "Manage and monitor all session activities",
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

const SessionManagement = () => {
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
        switch (status) {
            case t.status.confirmed:
                return { bg: colors.accents.green, color: 'white' };
            case t.status.canceled:
                return { bg: colors.accents.red, color: 'white' };
            default:
                return { bg: colors.accents.yellow, color: 'white' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case t.status.confirmed:
                return <FaCheck />;
            case t.status.canceled:
                return <FaTimes />;
            default:
                return <FaClock />;
        }
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
                        bgGradient={`linear(to-r, ${colors.primary.purple}, ${colors.purple[700]})`}
                        bgClip="text"
                        mb={2}
                        fontWeight="bold"
                    >
                        {t.sessionManagement}
                    </Heading>
                    <Text color={colors.purple[600]} fontSize="md" fontWeight="medium">
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

                <Card
                    bg={colors.primary.white}
                    shadow="2xl"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor={colors.purple[200]}
                    _hover={{
                        borderColor: colors.purple[300],
                        shadow: "lg"
                    }}
                    transition="all 0.3s"
                >
                    <CardBody p={0}>
                        <TableContainer>
                            <Table variant="simple" size="lg">
                                <Thead
                                    bgGradient={`linear(to-r, ${colors.purple[100]}, ${colors.purple[50]})`}
                                >
                                    <Tr>
                                        <Th
                                            color={colors.purple[700]}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={FaCalendarAlt} color={colors.primary.purple} />
                                                <Text>{t.table.date}</Text>
                                            </HStack>
                                        </Th>
                                        <Th
                                            color={colors.purple[700]}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={FaBuilding} color={colors.purple[500]} />
                                                <Text>{t.table.association}</Text>
                                            </HStack>
                                        </Th>
                                        <Th
                                            color={colors.purple[700]}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={FaUser} color={colors.purple[400]} />
                                                <Text>{t.table.volunteer}</Text>
                                            </HStack>
                                        </Th>
                                        <Th
                                            color={colors.purple[700]}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={FaClock} color={colors.purple[600]} />
                                                <Text>{t.table.status}</Text>
                                            </HStack>
                                        </Th>
                                        <Th
                                            color={colors.purple[700]}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Icon as={FaCog} color={colors.purple[500]} />
                                                <Text>{t.table.actions}</Text>
                                            </HStack>
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {sessions.length > 0 ? (
                                        sessions.map((session, index) => (
                                            <Tr
                                                key={session.id}
                                                bg={index % 2 === 0 ? colors.primary.white : colors.purple[50]}
                                                _hover={{
                                                    bg: colors.purple[100],
                                                    transform: 'translateY(-1px)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Td py={6} fontWeight="medium" color={colors.neutrals.darkGray}>
                                                    {new Date(session.date).toLocaleDateString(language)}
                                                </Td>
                                                <Td py={6} fontWeight="medium" color={colors.neutrals.darkGray}>
                                                    {session.association?.name || t.notAvailable}
                                                </Td>
                                                <Td py={6} color={colors.purple[600]}>
                                                    {session.status === t.status.confirmed && session.volunteer
                                                        ? session.volunteer.fullName
                                                        : t.notAvailable}
                                                </Td>
                                                <Td py={6}>
                                                    <Badge
                                                        {...getStatusBadgeProps(session.status)}
                                                        px={4}
                                                        py={2}
                                                        borderRadius="full"
                                                        fontWeight="bold"
                                                        fontSize="xs"
                                                        textTransform="uppercase"
                                                        letterSpacing="wide"
                                                    >
                                                        <HStack spacing={2}>
                                                            {getStatusIcon(session.status)}
                                                            <Text>{t.statusDisplay[session.status]}</Text>
                                                        </HStack>
                                                    </Badge>
                                                </Td>
                                                <Td py={6}>
                                                    <ButtonGroup size="sm" spacing={2}>
                                                        <Button
                                                            leftIcon={<FaEdit />}
                                                            bg={colors.primary.purple}
                                                            color="white"
                                                            _hover={{
                                                                bg: colors.purple[600],
                                                                transform: 'translateY(-1px)'
                                                            }}
                                                            borderRadius="lg"
                                                            fontWeight="medium"
                                                            onClick={() => handleSessionClick(session.id)}
                                                        >
                                                            {t.buttons.edit}
                                                        </Button>

                                                        {session.status === t.status.confirmed && (
                                                            <Button
                                                                leftIcon={<FaUserPlus />}
                                                                bg={colors.accents.green}
                                                                color="white"
                                                                _hover={{
                                                                    bg: colors.accents.teal,
                                                                    transform: 'translateY(-1px)'
                                                                }}
                                                                borderRadius="lg"
                                                                fontWeight="medium"
                                                                onClick={() => handleOpenAssignModal(session)}
                                                            >
                                                                {t.buttons.assign}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            leftIcon={<FaTrash />}
                                                            bg={colors.accents.red}
                                                            color="white"
                                                            _hover={{
                                                                transform: 'translateY(-1px)'
                                                            }}
                                                            borderRadius="lg"
                                                            fontWeight="medium"
                                                            onClick={() => handleDeleteClick(session)}
                                                        >
                                                            {t.buttons.delete}
                                                        </Button>
                                                    </ButtonGroup>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={5} py={16}>
                                                <Center>
                                                    <VStack spacing={4}>
                                                        <Icon
                                                            as={FaCalendarAlt}
                                                            boxSize={12}
                                                            color={colors.purple[400]}
                                                        />
                                                        <Text
                                                            color={colors.purple[600]}
                                                            fontSize="lg"
                                                            fontWeight="medium"
                                                        >
                                                            {t.noSessions}
                                                        </Text>
                                                    </VStack>
                                                </Center>
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </CardBody>
                </Card>
            </VStack>

            <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal} size="md">
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor={colors.purple[200]}
                >
                    <ModalHeader
                        bgGradient={`linear(to-r, ${colors.primary.purple}, ${colors.purple[600]})`}
                        color="white"
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaCog} />
                            <Text fontWeight="bold">{t.modals.editStatus.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <form onSubmit={handleUpdateSession}>
                        <ModalBody py={8}>
                            <FormControl isRequired>
                                <FormLabel
                                    color={colors.purple[700]}
                                    fontWeight="bold"
                                    mb={3}
                                >
                                    {t.modals.editStatus.label}
                                </FormLabel>
                                <Select
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                    placeholder={t.modals.editStatus.selectPlaceholder}
                                    bg={colors.purple[50]}
                                    border="2px solid"
                                    borderColor={colors.purple[200]}
                                    borderRadius="lg"
                                    fontSize="md"
                                    _focus={{
                                        bg: colors.primary.white,
                                        border: '2px solid',
                                        borderColor: colors.primary.purple
                                    }}
                                >
                                    <option value="PENDING">{t.statusDisplay.PENDING}</option>
                                    <option value="CONFIRMED">{t.statusDisplay.CONFIRMED}</option>
                                    <option value="CANCELED">{t.statusDisplay.CANCELED}</option>
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter py={6}>
                            <ButtonGroup spacing={4}>
                                <Button
                                    leftIcon={<FaTimes />}
                                    onClick={closeStatusModal}
                                    bg={colors.neutrals.mediumGray}
                                    color="white"
                                    _hover={{ bg: colors.neutrals.darkGray }}
                                    borderRadius="lg"
                                    fontWeight="medium"
                                    px={6}
                                >
                                    {t.buttons.cancel}
                                </Button>
                                <Button
                                    type="submit"
                                    leftIcon={loading ? <Spinner size="sm" /> : <FaCheck />}
                                    bg={colors.primary.purple}
                                    color="white"
                                    _hover={{ bg: colors.purple[600] }}
                                    borderRadius="lg"
                                    fontWeight="medium"
                                    px={6}
                                    isLoading={loading}
                                    loadingText={t.modals.editStatus.updating}
                                >
                                    {t.modals.editStatus.updateStatus}
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} size="xl">
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor={colors.purple[200]}
                >
                    <ModalHeader
                        bg={colors.accents.green}
                        color="white"
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaUserPlus} />
                            <Text fontWeight="bold">{t.modals.assignVolunteer.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody py={8}>
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

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} size="md">
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={colors.primary.white}
                    borderRadius="2xl"
                    shadow="2xl"
                    border="2px solid"
                    borderColor={colors.purple[200]}
                >
                    <ModalHeader
                        bg={colors.accents.red}
                        color="white"
                        borderTopRadius="2xl"
                        py={6}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaTrash} />
                            <Text fontWeight="bold">{t.modals.deleteSession.title}</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody py={8}>
                        <VStack spacing={6} align="start">
                            <Text
                                color={colors.neutrals.darkGray}
                                fontSize="md"
                                lineHeight="tall"
                            >
                                {t.modals.deleteSession.confirmation}
                            </Text>
                            {selectedSession && (
                                <Box
                                    p={6}
                                    bg={colors.purple[50]}
                                    borderRadius="xl"
                                    w="full"
                                    border="2px solid"
                                    borderColor={colors.purple[200]}
                                >
                                    <VStack spacing={3} align="start">
                                        <Text color={colors.neutrals.darkGray}>
                                            <Text as="span" fontWeight="bold" color={colors.primary.purple}>
                                                {t.modals.deleteSession.details.date}:
                                            </Text>{' '}
                                            {new Date(selectedSession.date).toLocaleDateString(language)}
                                        </Text>
                                        <Text color={colors.neutrals.darkGray}>
                                            <Text as="span" fontWeight="bold" color={colors.primary.purple}>
                                                {t.modals.deleteSession.details.association}:
                                            </Text>{' '}
                                            {selectedSession.association?.name || t.notAvailable}
                                        </Text>
                                        <Text color={colors.neutrals.darkGray}>
                                            <Text as="span" fontWeight="bold" color={colors.primary.purple}>
                                                {t.modals.deleteSession.details.status}:
                                            </Text>{' '}
                                            {selectedSession.status}
                                        </Text>
                                    </VStack>
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter py={6}>
                        <ButtonGroup spacing={4}>
                            <Button
                                leftIcon={<FaTimes />}
                                onClick={closeDeleteModal}
                                bg={colors.neutrals.mediumGray}
                                color="white"
                                _hover={{ bg: colors.neutrals.darkGray }}
                                borderRadius="lg"
                                fontWeight="medium"
                                px={6}
                            >
                                {t.buttons.cancel}
                            </Button>
                            <Button
                                leftIcon={loading ? <Spinner size="sm" /> : <FaTrash />}
                                bg={colors.accents.red}
                                color="white"
                                _hover={{ bg: '#EA580C' }}
                                borderRadius="lg"
                                fontWeight="medium"
                                px={6}
                                onClick={handleDeleteConfirm}
                                isLoading={loading}
                                loadingText={t.modals.deleteSession.deleting}
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

export default SessionManagement;