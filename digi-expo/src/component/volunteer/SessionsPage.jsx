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
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "CANCELED",
            completed: "Completed"
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
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "CANCELED",
            completed: "Completed"
        }
    }
};

// Animation keyframes
const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const SessionCard = ({ session, onViewDetails }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    // Standardize status text regardless of input
    const standardizeStatus = (status) => {
        const lowercaseStatus = status?.toLowerCase() || '';

        if (lowercaseStatus.includes('confirmed')) return 'Confirmed';
        if (lowercaseStatus.includes('pending')) return 'Pending';
        if (lowercaseStatus.includes('canceled') || lowercaseStatus.includes('annul')) return 'CANCELED';
        if (lowercaseStatus.includes('complet') || lowercaseStatus.includes('termin')) return 'Completed';
        return status;
    };

    const getStatusStyles = (status) => {
        const standardStatus = standardizeStatus(status);
        switch (standardStatus) {
            case 'Pending':
                return {
                    bg: '#FFF3E0',
                    color: '#B45309',
                    text: 'Pending'
                };
            case 'Confirmed':
                return {
                    bg: '#E6F6EC',
                    color: '#166534',
                    text: 'Confirmed'
                };
            case 'CANCELED':
                return {
                    bg: '#FEE2E2',
                    color: '#9e0a0a',
                    text: 'CANCELED'
                };
            case 'Completed':
                return {
                    bg: '#EEF2FF',
                    color: '#3730A3',
                    text: 'Completed'
                };
            default:
                return {
                    bg: 'gray.100',
                    color: 'gray.600',
                    text: standardStatus
                };
        }
    };

    const statusStyles = getStatusStyles(session.status);

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
                borderColor: 'purple.400',
            }}
        >
            <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                        <Icon as={FaCalendarAlt} color="purple.500" boxSize={5} />
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
                        textTransform="none"
                    >
                        {statusStyles.text}
                    </Badge>
                </Flex>

                <Divider />

                <HStack spacing={4}>
                    <Icon as={FaBuilding} color="purple.500" />
                    <Text fontWeight="medium" noOfLines={1}>
                        {session.association?.name || t.notAvailable}
                    </Text>
                </HStack>

                <Button
                    rightIcon={<FaArrowRight />}
                    colorScheme="purple"
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
            <Icon as={icon} color="purple.500" boxSize={5} />
            <VStack align="start" spacing={0}>
                <Text fontSize="sm" color={textColor}>
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
                        <Icon as={FaCalendarAlt} color="purple.500" />
                        <Text>{t.sessionDetails}</Text>
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
                                color="purple.500"
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
            bg={bgColor}
            pt={{ base: 10, md: 20 }}
            pb={{ base: 10, md: 20 }}
        >
            <Container maxW="7xl">
                <VStack spacing={6} mb={16} textAlign="center">
                    <Icon
                        as={FaCalendarAlt}
                        boxSize={{ base: 12, md: 16 }}
                        color="purple.400"
                        animation={`${float} 3s ease-in-out infinite`}
                    />
                    <Heading
                        as="h1"
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="bold"
                        color={headingColor}
                        letterSpacing="tight"
                    >
                        {t.pageTitle}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={subTextColor}
                        maxW="2xl"
                    >
                        {t.pageSubtitle}
                    </Text>
                </VStack>

                {loading ? (
                    <VStack spacing={4}>
                        <Icon
                            as={FaCalendarAlt}
                            boxSize={8}
                            color="purple.400"
                            animation={`${float} 1s ease-in-out infinite`}
                        />
                        <Text color={subTextColor}>{t.loading}</Text>
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
                            color="purple.400"
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
