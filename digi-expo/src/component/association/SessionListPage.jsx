import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AssociationService from '../../service/AssociationService';
import { FaCalendarAlt, FaInfoCircle, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Badge,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    Divider,
    useColorModeValue,
    Grid,
    GridItem,
    Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Translations object
const translations = {
    fr: {
        pageTitle: "Liste des Sessions",
        loading: "Chargement des sessions...",
        error: "Erreur lors du chargement des sessions",
        noSessions: "Aucune session disponible",
        viewDetails: "Voir Détails",
        sessionDetails: "Détails de la session",
        date: "Date",
        volunteerInfo: "Information du Bénévole",
        username: "Nom d'utilisateur",
        fullName: "Nom complet",
        email: "Email",
        phone: "Téléphone",
        notProvided: "Non fourni",
        noVolunteer: "Aucun bénévole assigné",
        close: "Fermer",
        status: {
            pending: "En attente",
            confirmed: "Confirmé",
            cancelled: "Annulé",
            completed: "Terminé"
        },
        lastUpdate: "Dernière mise à jour: "
    },
    en: {
        pageTitle: "Sessions List",
        loading: "Loading sessions...",
        error: "Error loading sessions",
        noSessions: "No sessions available",
        viewDetails: "View Details",
        sessionDetails: "Session Details",
        date: "Date",
        volunteerInfo: "Volunteer Information",
        username: "Username",
        fullName: "fullname",
        email: "Email",
        phone: "Phone",
        notProvided: "Not provided",
        noVolunteer: "No volunteer assigned",
        close: "Close",
        status: {
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "Cancelled",
            completed: "Completed"
        },
        lastUpdate: "Last update: "
    }
};

const StatusBadge = ({ status, t }) => {
    const statusColors = {
        pending: { bg: 'yellow.400', color: 'yellow.900' },
        confirmed: { bg: 'green.400', color: 'green.900' },
        cancelled: { bg: '#9e0a0a', color: 'white' }, // Changed to red.400 for better visibility
        completed: { bg: 'blue.400', color: 'blue.900' },
    };

    const getStatusKey = (status) => {
        // Convert status to lowercase and handle any variations
        const normalizedStatus = status?.toLowerCase();
        if (normalizedStatus === 'canceled' || normalizedStatus === 'cancelled') {
            return 'cancelled'; // Normalize to one spelling
        }
        return normalizedStatus;
    };

    const statusKey = getStatusKey(status);
    const colors = statusColors[statusKey] || statusColors.pending;
    const translatedStatus = t.status[statusKey] || status;

    return (
        <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg={colors.bg}
            color={colors.color}
            fontWeight="medium"
            fontSize="sm"
            textTransform="capitalize"
        >
            {translatedStatus}
        </Badge>
    );
};

const SessionCard = ({ session, onViewDetails, t, formatDate }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <MotionBox
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Box
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                boxShadow="lg"
                position="relative"
                overflow="hidden"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bgGradient: "linear(to-r, purple.500, purple.300)"
                }}
            >
                <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" align="flex-start">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
                                {formatDate(session.date)}
                            </Text>
                            <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                                {new Date(session.date).getFullYear()}
                            </Text>
                        </VStack>
                        <StatusBadge status={session.status} t={t} />
                    </HStack>

                    <Button
                        onClick={() => onViewDetails(session)}
                        variant="ghost"
                        colorScheme="purple"
                        size="sm"
                        rightIcon={<Icon as={FaCalendarAlt} />}
                        _hover={{
                            bg: 'purple.50',
                            transform: 'translateX(4px)'
                        }}
                        transition="all 0.2s"
                    >
                        {t.viewDetails}
                    </Button>
                </VStack>
            </Box>
        </MotionBox>
    );
};

const SessionDetailsModal = ({ isOpen, onClose, session, t, formatFullDate, getTranslatedStatus }) => {
    const modalBg = useColorModeValue('white', 'gray.800');
    const sectionBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={modalBg} borderRadius="2xl" overflow="hidden">
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    height="6px"
                    bgGradient="linear(to-r, purple.500, purple.300)"
                />

                <ModalHeader pt={8}>
                    <HStack spacing={3}>
                        <Circle size={10} bg="purple.100" color="purple.500">
                            <Icon as={FaCalendarAlt} />
                        </Circle>
                        <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                                {t.sessionDetails}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {formatFullDate(session.date)}
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <VStack spacing={6} align="stretch">
                        <HStack justify="space-between" align="center">
                            <StatusBadge status={session.status} t={t} />
                        </HStack>

                        <Box
                            bg={sectionBg}
                            borderRadius="xl"
                            p={6}
                            borderWidth="1px"
                            borderColor={borderColor}
                        >
                            <VStack spacing={4} align="stretch">
                                <HStack spacing={3}>
                                    <Circle size={8} bg="purple.100" color="purple.500">
                                        <Icon as={FaUser} />
                                    </Circle>
                                    <Text fontWeight="semibold">{t.volunteerInfo}</Text>
                                </HStack>

                                {session.volunteer ? (
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <GridItem>
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="sm" color="gray.500">{t.username}</Text>
                                                <Text>{session.volunteer.username || 'N/A'}</Text>
                                            </VStack>
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="sm" color="gray.500">{t.fullName}</Text>
                                                <Text>{session.volunteer.fullName || 'N/A'}</Text>
                                            </VStack>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="sm" color="gray.500">{t.email}</Text>
                                                <Text>{session.volunteer.email || t.notProvided}</Text>
                                            </VStack>
                                        </GridItem>
                                        <GridItem>
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="sm" color="gray.500">{t.phone}</Text>
                                                <Text>{session.volunteer.phoneNumber || t.notProvided}</Text>
                                            </VStack>
                                        </GridItem>
                                    </Grid>
                                ) : (
                                    <Alert
                                        status="info"
                                        variant="subtle"
                                        borderRadius="lg"
                                    >
                                        <AlertIcon />
                                        {t.noVolunteer}
                                    </Alert>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const SessionListPage = () => {
    const [selectedSession, setSelectedSession] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    // Use React Query for data fetching with automatic refresh
    const {
        data: response,
        isLoading,
        error,
        dataUpdatedAt
    } = useQuery({
        queryKey: ['associationSessions', associationId],
        queryFn: () => AssociationService.getSessions(associationId),
        enabled: !!associationId,
        refetchInterval: 10000, // Refresh every 10 seconds
        refetchIntervalInBackground: true, // Continue refreshing even when the tab is in the background
        staleTime: 5000, // Consider data stale after 5 seconds
        onSuccess: () => {
            setLastUpdateTime(new Date());
        }
    });

    const sessions = response?.sessionList || [];

    const handleShowDetails = (session) => {
        setSelectedSession(session);
        onOpen();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(date);
    };

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const getTranslatedStatus = (status) => {
        const statusKey = status?.toLowerCase();
        return t.status[statusKey] || status;
    };

    const formatLastUpdate = (date) => {
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
            <Container maxW="6xl">
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Circle size={12} bg="purple.100" color="purple.500">
                                <Icon as={FaCalendarAlt} boxSize={6} />
                            </Circle>
                            <VStack align="start" spacing={0}>
                                <Heading size="lg">{t.pageTitle}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    {t.lastUpdate} {formatLastUpdate(lastUpdateTime)}
                                </Text>
                            </VStack>
                        </HStack>
                    </HStack>

                    {error && (
                        <Alert status="error" borderRadius="xl">
                            <AlertIcon />
                            {error.message || t.error}
                        </Alert>
                    )}

                    {isLoading ? (
                        <VStack py={12} spacing={4}>
                            <Spinner size="xl" color="purple.500" thickness="4px" />
                            <Text>{t.loading}</Text>
                        </VStack>
                    ) : sessions.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onViewDetails={handleShowDetails}
                                    t={t}
                                    formatDate={formatDate}
                                />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <VStack py={12} spacing={4}>
                            <Circle size={16} bg="purple.100" color="purple.500">
                                <Icon as={FaCalendarAlt} boxSize={8} />
                            </Circle>
                            <Text fontSize="lg" color="gray.500">
                                {t.noSessions}
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </Container>

            {selectedSession && (
                <SessionDetailsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    session={selectedSession}
                    t={t}
                    formatFullDate={formatFullDate}
                    getTranslatedStatus={getTranslatedStatus}
                />
            )}
        </Box>
    );
};

export default SessionListPage;
