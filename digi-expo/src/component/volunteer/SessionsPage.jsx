import React, { useState, useEffect } from 'react';
import VolunteerService from '../../service/VolunteerService';
import { useLanguage } from '../../context/LanguageContext';
import { keyframes } from '@emotion/react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
    Badge,
    Icon,
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Divider,
    Flex,
    SimpleGrid,
    useToast,
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaInfoCircle,
    FaBuilding,
    FaEnvelope,
    FaUserTie,
    FaPhone,
    FaArrowRight,
    FaClock,
    FaMapMarkerAlt
} from 'react-icons/fa';

const translations = {
    fr: {
        pageTitle: "Mes Sessions Assignées",
        pageSubtitle: "Gérez vos sessions et suivez leur statut",
        noSessions: "Aucune session assignée pour le moment",
        noSessionsDesc: "Les sessions que vous rejoignez apparaîtront ici",
        viewDetails: "Voir les détails",
        sessionDetails: "Détails de la session",
        close: "Fermer",
        date: "Date",
        time: "Heure",
        location: "Lieu",
        associationInfo: "Informations de l'Association",
        association: "Association",
        email: "Courriel",
        manager: "Responsable",
        phone: "Téléphone",
        notAvailable: "Non disponible",
        loading: "Chargement des sessions...",
        error: "Erreur lors du chargement des sessions",
        status: {
            pending: "EN ATTENTE",
            confirmed: "CONFIRMÉ",
            cancelled: "ANNULÉ",
            completed: "TERMINÉ"
        }
    },
    en: {
        pageTitle: "My Assigned Sessions",
        pageSubtitle: "Manage your sessions and track their status",
        noSessions: "No assigned sessions at the moment",
        noSessionsDesc: "Sessions you join will appear here",
        viewDetails: "View details",
        sessionDetails: "Session Details",
        close: "Close",
        date: "Date",
        time: "Time",
        location: "Location",
        associationInfo: "Association Information",
        association: "Association",
        email: "Email",
        manager: "Manager",
        phone: "Phone",
        notAvailable: "Not available",
        loading: "Loading sessions...",
        error: "Error loading sessions",
        status: {
            pending: "PENDING",
            confirmed: "CONFIRMED",
            cancelled: "CANCELED",
            completed: "COMPLETED"
        }
    }
};

// Animation keyframes
const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

// Create a shared status configuration object
const STATUS_CONFIG = {
    pending: {
        bg: '#FFF3E0',
        color: '#B45309',
        fr: 'EN ATTENTE',
        en: 'PENDING'
    },
    confirmed: {
        bg: '#E6F6EC',
        color: '#166534',
        fr: 'CONFIRMÉ',
        en: 'CONFIRMED'
    },
    cancelled: {
        bg: '#FEE2E2',
        color: '#9e0a0a',
        fr: 'ANNULÉ',
        en: 'CANCELED'
    },
    completed: {
        bg: '#EEF2FF',
        color: '#3730A3',
        fr: 'TERMINÉ',
        en: 'COMPLETED'
    }
};

// Update the standardizeStatus function
const standardizeStatus = (status) => {
    if (!status) return 'pending';

    // Convert to lowercase for consistent comparison
    const normalizedStatus = status.toLowerCase();

    // Map common variations to standard status
    if (normalizedStatus.includes('confirm')) return 'confirmed';
    if (normalizedStatus.includes('cancel') || normalizedStatus.includes('annul')) return 'cancelled';
    if (normalizedStatus.includes('complet') || normalizedStatus.includes('termin')) return 'completed';
    if (normalizedStatus.includes('pend') || normalizedStatus.includes('attente')) return 'pending';

    return 'pending'; // Default fallback
};

// Update the getStatusStyles function
const getStatusStyles = (status, language) => {
    const standardStatus = standardizeStatus(status);
    const config = STATUS_CONFIG[standardStatus] || STATUS_CONFIG.pending;

    return {
        bg: config.bg,
        color: config.color,
        text: config[language] || config.en
    };
};

// Update the SessionCard component to use the new status handling
const SessionCard = ({ session, onViewDetails }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const statusStyles = getStatusStyles(session.status, language);

    return (
        <Box
            bg={cardBg}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: '#582C83',
            }}
        >
            <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                        <Icon as={FaCalendarAlt} color="#582C83" boxSize={5} />
                        <Text fontWeight="medium" color={textColor}>
                            {session.date}
                        </Text>
                    </HStack>
                    <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        bg={statusStyles.bg}
                        color={statusStyles.color}
                        textTransform="uppercase"
                    >
                        {statusStyles.text}
                    </Badge>
                </Flex>

                <Button
                    rightIcon={<FaArrowRight />}
                    color="#582C83"
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(session)}
                    _hover={{
                        transform: 'translateX(4px)',
                    }}
                >
                    {t.viewDetails}
                </Button>
            </VStack>
        </Box>
    );
};

const SessionDetailsModal = ({ session, isOpen, onClose }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const sectionBg = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const InfoItem = ({ icon, label, value }) => (
        <HStack spacing={3} p={3} bg={sectionBg} borderRadius="lg">
            <Icon as={icon} color="#582C83" boxSize={5} />
            <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="#582C83">
                    {label}
                </Text>
                <Text fontWeight="medium">
                    {value || t.notAvailable}
                </Text>
            </VStack>
        </HStack>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl">
                <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
                    <HStack spacing={3}>
                        <Icon as={FaCalendarAlt} color="#582C83" />
                        <Text color="#582C83">{t.sessionDetails}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <InfoItem
                                icon={FaCalendarAlt}
                                label={t.date}
                                value={session?.date}
                            />

                        </SimpleGrid>

                        <Box>
                            <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                mb={4}
                                color="#582C83"
                            >
                                {t.associationInfo}
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <InfoItem
                                    icon={FaBuilding}
                                    label={t.association}
                                    value={session?.association?.name}
                                />
                                <InfoItem
                                    icon={FaEnvelope}
                                    label={t.email}
                                    value={session?.association?.email}
                                />
                                <InfoItem
                                    icon={FaUserTie}
                                    label={t.manager}
                                    value={session?.association?.responsableName}
                                />
                                <InfoItem
                                    icon={FaPhone}
                                    label={t.phone}
                                    value={session?.association?.responsablePhone}
                                />
                            </SimpleGrid>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedSession, setSelectedSession] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headingColor = useColorModeValue('purple.600', 'purple.300');
    const subTextColor = useColorModeValue('gray.600', 'gray.400');
    const emptyStateBg = useColorModeValue('white', 'gray.800');

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await VolunteerService.getSessions(volunteerId);
                const sessionsList = response?.data || [];

                if (Array.isArray(sessionsList)) {
                    const translatedSessions = sessionsList.map(session => ({
                        ...session,
                        status: t.status[session.status?.toLowerCase()] || session.status
                    }));
                    setSessions(translatedSessions);
                } else {
                    setSessions([]);
                }
            } catch (error) {
                toast({
                    title: t.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchSessions();
        }
    }, [volunteerId, language, t.status, t.error, toast]);

    const handleViewDetails = (session) => {
        setSelectedSession(session);
        onOpen();
    };

    return (
        <Box
            minH="100vh"
            bg="#ffffff"
            pt={{ base: 10, md: 20 }}
            pb={{ base: 10, md: 20 }}
        >
            <Container maxW="7xl">
                <VStack spacing={6} mb={16} textAlign="center">
                    <Icon
                        as={FaCalendarAlt}
                        boxSize={{ base: 12, md: 16 }}
                        color="#582C83"
                        animation={`${float} 3s ease-in-out infinite`}
                    />
                    <Heading
                        as="h1"
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="bold"
                        color="#582C83"
                        letterSpacing="tight"
                        textShadow="2px 2px 4px rgba(0,0,0,0.2)"
                    >
                        {t.pageTitle}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="black"
                        maxW="2xl"
                        textShadow="1px 1px 2px rgba(0,0,0,0.1)"
                    >
                        {t.pageSubtitle}
                    </Text>
                </VStack>

                {loading ? (
                    <VStack spacing={4}>
                        <Icon
                            as={FaCalendarAlt}
                            boxSize={8}
                            color="#582C83"
                            animation={`${float} 1s ease-in-out infinite`}
                        />
                        <Text color="#582C83">{t.loading}</Text>
                    </VStack>
                ) : sessions.length > 0 ? (
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 3 }}
                        spacing={8}
                    >
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </SimpleGrid>
                ) : (
                    <VStack
                        spacing={6}
                        p={10}
                        bg={emptyStateBg}
                        borderRadius="2xl"
                        boxShadow="xl"
                        animation={`${float} 3s ease-in-out infinite`}
                    >
                        <Icon
                            as={FaCalendarAlt}
                            boxSize={12}
                            color="#582C83"
                            opacity={0.5}
                        />
                        <Heading size="lg" color={headingColor}>
                            {t.noSessions}
                        </Heading>
                        <Text color={subTextColor}>
                            {t.noSessionsDesc}
                        </Text>
                    </VStack>
                )}
            </Container>

            {selectedSession && (
                <SessionDetailsModal
                    session={selectedSession}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
        </Box>
    );
};

export default SessionPage;
