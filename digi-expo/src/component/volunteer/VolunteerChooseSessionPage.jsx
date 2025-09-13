import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Badge,
    Alert,
    AlertIcon,
    useToast,
    Spinner,
    Flex,
    Icon,
} from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const translations = {
    fr: {
        pageTitle: "Sessions à Animer",
        pageSubtitle: "Choisissez une session à animer dans vos associations",
        loading: "Chargement...",
        fetchError: "Erreur lors du chargement des sessions",
        noSessions: "Aucune session à animer.",
        chooseButton: "Animer",
        assigning: "Attribution...",
        successTitle: "Succès",
        errorTitle: "Erreur",
        successMessage: "Vous avez été assigné à la session avec succès.",
        errorMessage: "Erreur lors de l'attribution de la session",
        date: "Date",
        association: "Association",
        status: "Statut"
    },
    en: {
        pageTitle: "Sessions to Animate",
        pageSubtitle: "Choose a session to animate in your associations",
        loading: "Loading...",
        fetchError: "Error loading sessions",
        noSessions: "No sessions to animate.",
        chooseButton: "Animate",
        assigning: "Assigning...",
        successTitle: "Success",
        errorTitle: "Error",
        successMessage: "You have been assigned to the session successfully.",
        errorMessage: "Error assigning the session",
        date: "Date",
        association: "Association",
        status: "Status"
    }
};

const STATUS_COLORS = {
    PENDING: 'yellow.400',
    CONFIRMED: 'green.400',
    CANCELED: 'red.400'
};

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const SessionCard = ({ session, onChoose, isChoosing, t }) => {
    const statusColor = STATUS_COLORS[session.status?.toUpperCase()] || 'gray.300';
    return (
        <Flex
            borderWidth={1}
            borderRadius="lg"
            bg="white"
            boxShadow="sm"
            overflow="hidden"
            minH="140px"
            position="relative"
        >
            {/* Left color bar for status */}
            <Box w="6px" bg={statusColor} />
            <Box flex="1" p={4}>
                <HStack justify="space-between" align="start" mb={2}>
                    <Text fontWeight="bold" fontSize="lg" color="#582C83" noOfLines={1}>
                        {session.title}
                    </Text>
                    <Badge colorScheme="purple" fontSize="0.8em" borderRadius="md">
                        {session.date ? new Date(session.date).toLocaleDateString() : t.date}
                    </Badge>
                </HStack>
                <Text fontSize="sm" color="#582C83" mb={1}>
                    <b>{t.association}:</b> {session.association?.name || '-'}
                </Text>
                <Text fontSize="sm" color="gray.500" mb={2} noOfLines={2}>
                    {session.description}
                </Text>
                <HStack justify="space-between" mt={2}>
                    <Badge
                        variant="subtle"
                        colorScheme={
                            session.status === 'CONFIRMED'
                                ? 'green'
                                : session.status === 'CANCELED'
                                    ? 'red'
                                    : 'yellow'
                        }
                        fontSize="0.8em"
                        borderRadius="md"
                    >
                        {t.status}: {session.status}
                    </Badge>
                    <Button
                        size="sm"
                        variant="outline"
                        colorScheme="purple"
                        isLoading={isChoosing}
                        onClick={() => onChoose(session.id)}
                        borderRadius="full"
                        fontWeight="bold"
                    >
                        {isChoosing ? t.assigning : t.chooseButton}
                    </Button>
                </HStack>
            </Box>
        </Flex>
    );
};

const VolunteerChooseSessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [choosingId, setChoosingId] = useState(null);
    const [error, setError] = useState('');
    const toast = useToast();
    const { language } = useLanguage();
    const t = translations[language];
    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        setLoading(true);
        setError('');
        VolunteerService.getPendingSessions(volunteerId)
            .then(res => setSessions(res.data || []))
            .catch(() => setError(t.fetchError))
            .finally(() => setLoading(false));
    }, [volunteerId, t.fetchError]);

    const handleChoose = (sessionId) => {
        setChoosingId(sessionId);
        VolunteerService.chooseSession(sessionId, volunteerId)
            .then(() => {
                toast({
                    title: t.successTitle,
                    description: t.successMessage,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setSessions(sessions.filter(s => s.id !== sessionId));
            })
            .catch(err => {
                toast({
                    title: t.errorTitle,
                    description: err.response?.data?.message || t.errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            })
            .finally(() => setChoosingId(null));
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
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

                {error && (
                    <Alert status="error" mb={6}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <VStack py={20}>
                        <Spinner size="lg" color="purple.700" />
                        <Text color="purple.700">{t.loading}</Text>
                    </VStack>
                ) : sessions.length === 0 ? (
                    <VStack py={20} spacing={4}>
                        <Text color="gray.500" fontSize="lg">
                            {t.noSessions}
                        </Text>
                    </VStack>
                ) : (
                    <VStack spacing={5} align="stretch">
                        {sessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onChoose={handleChoose}
                                isChoosing={choosingId === session.id}
                                t={t}
                            />
                        ))}
                    </VStack>
                )}
            </Container>
        </Box>
    );
};

export default VolunteerChooseSessionPage;