import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    Heading,
    Input,
    Text,
    VStack,
    HStack,
    useToast,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Divider,
    IconButton,
    Grid,
    GridItem,
    useColorModeValue,
    Tooltip,
    Circle,
    Stack,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CalendarIcon, TimeIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// DXC Color Palette
const dxcColors = {
    primary: {
        purple: '#582C83', // DXC Bright Purple
        white: '#FFFFFF'
    },
    secondary: {
        lightGray: '#D8D9D9', // DXC Light Gray
        mediumGray: '#97999B', // DXC Medium Gray
        darkGray: '#58595B'  // DXC Dark Gray
    },
    accents: {
        teal: '#00A6AF', // DXC Bright Teal
        blue: '#0095C8', // DXC Blue
        darkTeal: '#006275', // DXC Dark Teal
        green: '#00C14F', // DXC Green
        orange: '#FF8F1C', // DXC Orange
        gold: '#FFCD00'  // DXC Gold
    }
};

// Translations object
const translations = {
    fr: {
        pageTitle: "Réserver des Sessions",
        addDate: "+ Ajouter une autre date",
        deleteDate: "Supprimer cette date",
        dateReserved: "Cette date est déjà réservée par vous ou une autre association",
        dateAlreadySelected: "Cette date est déjà sélectionnée. Veuillez en choisir une autre.",
        missingAssociationId: "Identifiant de l'association manquant.",
        reservationSuccess: "Sessions réservées avec succès.",
        reservationError: "Erreur lors de la réservation.",
        reserving: "Réservation...",
        reserve: "Réserver",
        reservedDates: "Dates déjà réservées",
        alreadyReserved: "Déjà réservée",
        sessionsExist: "Sessions déjà réservées pour les dates: ",
        someReserved: "Certaines dates sélectionnées sont déjà réservées. Veuillez les modifier.",
        byAssociation: "Par: ",
        dateAlreadyBooked: "Cette date est déjà réservée par {association}",
        status: {
            pending: "En attente",
            confirmed: "Confirmée",
            cancelled: "Annulée",
            completed: "Terminée"
        }
    },
    en: {
        pageTitle: "Book Sessions",
        addDate: "+ Add another date",
        deleteDate: "Delete this date",
        dateReserved: "This date is already reserved by you or another association",
        dateAlreadySelected: "This date is already selected. Please choose another one.",
        missingAssociationId: "Missing association ID.",
        reservationSuccess: "Sessions booked successfully.",
        reservationError: "Error during reservation.",
        reserving: "Booking...",
        reserve: "Book",
        reservedDates: "Already Reserved Dates",
        alreadyReserved: "Already reserved",
        sessionsExist: "Sessions already exist for dates: ",
        someReserved: "Some selected dates are already reserved. Please modify them.",
        byAssociation: "By: ",
        dateAlreadyBooked: "This date is already booked by {association}",
        status: {
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "Cancelled",
            completed: "Completed"
        }
    }
};

const StatusBadge = ({ status, t }) => {
    const statusColors = {
        pending: { bg: dxcColors.accents.gold, color: 'black' },
        confirmed: { bg: dxcColors.accents.green, color: 'white' },
        cancelled: { bg: dxcColors.accents.orange, color: 'white' },
        completed: { bg: dxcColors.accents.blue, color: 'white' },
    };

    const defaultColor = statusColors.pending;
    const colors = statusColors[status?.toLowerCase()] || defaultColor;
    const translatedStatus = t.status[status?.toLowerCase()] || status;

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

const ReserveSessionsPage = () => {
    const { currentUser } = useContext(AuthContext);
    const { language } = useLanguage();
    const t = translations[language];
    const [dates, setDates] = useState(['']);
    const [rawMessage, setRawMessage] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [reservedDates, setReservedDates] = useState([]);
    const [globalReservedDates, setGlobalReservedDates] = useState([]);
    const toast = useToast();

    // Move useColorModeValue hooks to the top level
    const cardBg = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('gray.50', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const shadowColor = useColorModeValue('rgba(88, 44, 131, 0.1)', 'rgba(0, 166, 175, 0.1)');

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user is logged in
                if (!currentUser) {
                    setRawMessage("Please log in to access this page");
                    return;
                }

                // Check if user has the ASSOCIATION role
                if (currentUser.role !== 'ASSOCIATION') {
                    setRawMessage("Access denied. Only associations can view this page.");
                    return;
                }

                // Check if token exists
                const token = localStorage.getItem("token");
                if (!token) {
                    setRawMessage("Please log in to access this page");
                    return;
                }

                try {
                    await Promise.all([
                        fetchAllReservedDates(),
                        fetchAssociationReservedDates()
                    ]);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    if (error.response?.status === 403) {
                        // Clear invalid token and user data
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setRawMessage("Your session has expired. Please log in again.");
                    } else if (error.message?.includes("Please log in")) {
                        setRawMessage(error.message);
                    } else {
                        setRawMessage(t.reservationError);
                    }
                }
            } catch (error) {
                console.error("Error in initial setup:", error);
                setRawMessage(t.reservationError);
            }
        };

        fetchData();
    }, [currentUser, associationId, t]);

    useEffect(() => {
        if (rawMessage.includes('already reserved') || rawMessage.includes('déjà réservée')) {
            const conflictDates = rawMessage
                .split('\n')
                .slice(1) // Skip the first line which is the message
                .filter(date => date.trim()) // Remove empty lines
                .map(date => {
                    // Try to extract the date from the formatted string
                    try {
                        const dateStr = date.trim();
                        // Parse the date from the string
                        const parsedDate = new Date(dateStr);
                        if (!isNaN(parsedDate.getTime())) {
                            // If successfully parsed, format it in the current language
                            return formatDate(parsedDate);
                        }
                        return dateStr; // If parsing fails, return original string
                    } catch (e) {
                        return date; // If any error occurs, return original string
                    }
                });

            const translatedMessage = `${t.dateReserved}\n${conflictDates.join('\n')}`;
            setMessage(translatedMessage);
        } else if (rawMessage) {
            setMessage(t[rawMessage] || rawMessage);
        }
    }, [language, rawMessage, t]);

    const fetchAllReservedDates = async () => {
        try {
            const response = await AssociationService.getAllReservedSessions();
            if (response?.sessions) {
                const reserved = response.sessions.map(session => ({
                    date: session.date,
                    associationName: session.associationName
                }));
                setGlobalReservedDates(reserved);
            }
        } catch (error) {
            console.error("Failed to fetch global reserved dates:", error);
            throw error;
        }
    };

    const fetchAssociationReservedDates = async () => {
        try {
            if (!associationId && !currentUser?.id) return;

            const id = currentUser?.id || associationId;
            const response = await AssociationService.getSessions(id);
            if (response?.sessionList) {
                const reserved = response.sessionList.map(session => session.date);
                setReservedDates(reserved);
            }
        } catch (error) {
            console.error("Failed to fetch association reserved dates:", error);
            throw error;
        }
    };

    const getDisabledDates = () => {
        return globalReservedDates.map(reserved => reserved.date);
    };

    const isDateDisabled = (date) => {
        return getDisabledDates().includes(date);
    };

    const isDateReserved = (date) => {
        return globalReservedDates.some(reserved => {
            const reservedDate = new Date(reserved.date).toISOString().split('T')[0];
            return reservedDate === date;
        });
    };

    const getAssociationNameForDate = (date) => {
        const reservation = globalReservedDates.find(reserved => reserved.date === date);
        if (reservation) {
            return reservation.associationName;
        }
        // If it's reserved by current association
        if (reservedDates.includes(date)) {
            return "your association";
        }
        return '';
    };

    const handleDateChange = (index, value) => {
        if (isDateReserved(value)) {
            const reservation = globalReservedDates.find(reserved =>
                new Date(reserved.date).toISOString().split('T')[0] === value
            );
            const message = t.dateAlreadyBooked.replace('{association}', reservation?.associationName || '');
            setRawMessage(message);
            return;
        }

        if (dates.some((date, i) => i !== index && date === value)) {
            setRawMessage('dateAlreadySelected');
            return;
        }

        const updatedDates = [...dates];
        updatedDates[index] = value;
        setDates(updatedDates);
        setRawMessage('');
    };

    const addDateInput = () => setDates([...dates, '']);

    const removeDateInput = (index) => {
        if (dates.length === 1) return;
        const updatedDates = dates.filter((_, i) => i !== index);
        setDates(updatedDates);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const isDateGloballyReserved = (date) => {
        return globalReservedDates.some(reserved => reserved.date === date);
    };

    const getAssociationForDate = (date) => {
        const reservation = globalReservedDates.find(reserved => reserved.date === date);
        return reservation?.associationName || '';
    };

    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!associationId) {
            setRawMessage('missingAssociationId');
            return;
        }

        // Filter out empty dates
        const validDates = dates.filter(date => date);
        if (validDates.length === 0) {
            setRawMessage('noDatesSelected');
            return;
        }

        setLoading(true);
        const dto = { dates: validDates };
        try {
            // First, check all dates against current reservations
            const reservedResponse = await AssociationService.getAllReservedSessions();
            const existingSessions = reservedResponse?.sessions || [];

            const conflicts = validDates.filter(date =>
                existingSessions.some(session =>
                    new Date(session.date).toISOString().split('T')[0] === date
                )
            ).map(date => formatDate(date));

            if (conflicts.length > 0) {
                const formattedMessage = conflicts.join('\n');
                setRawMessage(`${t.dateReserved}\n${formattedMessage}`);
                setLoading(false);
                return;
            }

            // If no conflicts, proceed with reservation
            const response = await AssociationService.reserveSessions(associationId, dto);

            if (response?.statusCode === 400) {
                // If somehow there are still conflicts (race condition)
                const errorMessage = response.message;
                if (errorMessage.includes("Cannot reserve: The following dates are already booked:") ||
                    errorMessage.includes("Sessions already exist for dates:")) {
                    let conflictsStr = '';
                    if (errorMessage.includes("already booked:")) {
                        conflictsStr = errorMessage.split("already booked: ")[1];
                    } else {
                        conflictsStr = errorMessage.split("exist for dates: ")[1];
                    }

                    const conflicts = conflictsStr.split(", ")
                        .map(conflict => conflict.split(" (")[0].trim()) // Remove any text in parentheses
                        .map(date => formatDate(date));

                    const formattedMessage = conflicts.join('\n');
                    setRawMessage(`${t.dateReserved}\n${formattedMessage}`);
                }
                await fetchAllReservedDates();
            } else if (response?.statusCode === 200) {
                setRawMessage('reservationSuccess');
                setDates(['']);
                await Promise.all([
                    fetchAllReservedDates(),
                    fetchAssociationReservedDates()
                ]);
            }
        } catch (error) {
            console.error("Reservation failed:", error);
            // Try to extract date information from error response
            const errorMessage = error.response?.data?.message || '';
            if (errorMessage.includes("Cannot reserve:") ||
                errorMessage.includes("Sessions already exist")) {
                let conflictsStr = '';
                if (errorMessage.includes("already booked:")) {
                    conflictsStr = errorMessage.split("already booked: ")[1];
                } else if (errorMessage.includes("exist for dates:")) {
                    conflictsStr = errorMessage.split("exist for dates: ")[1];
                }

                if (conflictsStr) {
                    const conflicts = conflictsStr.split(", ")
                        .map(conflict => conflict.split(" (")[0].trim()) // Remove any text in parentheses
                        .map(date => formatDate(date));

                    const formattedMessage = conflicts.join('\n');
                    setRawMessage(`${t.dateReserved}\n${formattedMessage}`);
                } else {
                    // If we can't parse the error message, check current reservations
                    fetchAllReservedDates().then(() => {
                        const conflicts = validDates
                            .filter(date => isDateReserved(date))
                            .map(date => formatDate(date));

                        if (conflicts.length > 0) {
                            const formattedMessage = conflicts.join('\n');
                            setRawMessage(`${t.dateReserved}\n${formattedMessage}`);
                        }
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const formatSelectedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Add new function to determine message type
    const getMessageStyle = (message) => {
        if (!message) return {};

        if (message === t.reservationSuccess) {
            return {
                bg: `${dxcColors.accents.green}10`,
                borderColor: dxcColors.accents.green,
                color: dxcColors.accents.green,
                icon: <CheckIcon />
            };
        }

        if (message.includes(t.dateReserved) || message.includes('error') || message.includes('Error')) {
            return {
                bg: `${dxcColors.accents.orange}10`,
                borderColor: dxcColors.accents.orange,
                color: dxcColors.accents.orange,
                icon: <TimeIcon />
            };
        }

        return {
            bg: `${dxcColors.primary.purple}05`,
            borderColor: `${dxcColors.primary.purple}20`,
            color: dxcColors.primary.purple,
            icon: <InfoIcon />
        };
    };

    return (
        <Box
            minH="100vh"
            position="relative"
            overflow="hidden"
            bgGradient={`linear(135deg, ${dxcColors.primary.purple}10, ${dxcColors.primary.purple}05)`}
            py={10}
        >
            {/* Creative Background Elements */}
            <Box
                position="fixed"
                top="5%"
                left="15%"
                w="300px"
                h="300px"
                borderRadius="full"
                bg={`${dxcColors.primary.purple}15`}
                filter="blur(80px)"
                transform="rotate(-15deg)"
                zIndex={0}
            />
            <Box
                position="fixed"
                bottom="10%"
                right="15%"
                w="250px"
                h="250px"
                borderRadius="full"
                bg={`${dxcColors.primary.purple}10`}
                filter="blur(70px)"
                transform="rotate(30deg)"
                zIndex={0}
            />

            <Container maxW="3xl" position="relative" zIndex={1}>
                <VStack spacing={8}>
                    {/* Header */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        textAlign="center"
                    >
                        <VStack spacing={4}>
                            <Box position="relative" display="inline-block">
                                <Circle
                                    size={16}
                                    bg={dxcColors.primary.purple}
                                    color="white"
                                >
                                    <CalendarIcon boxSize={6} />
                                </Circle>
                            </Box>
                            <Heading
                                fontSize="3xl"
                                color={dxcColors.primary.purple}
                                letterSpacing="tight"
                                fontWeight="bold"
                            >
                                {t.pageTitle}
                            </Heading>
                        </VStack>
                    </MotionBox>

                    {/* Main Form Card */}
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        bg={`${cardBg}90`}
                        backdropFilter="blur(12px)"
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={`${dxcColors.primary.purple}20`}
                        overflow="hidden"
                        boxShadow={`0 4px 20px ${dxcColors.primary.purple}15`}
                        w="full"
                    >
                        <CardBody p={6}>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={5}>
                                    <AnimatePresence>
                                        {dates.map((date, index) => (
                                            <MotionBox
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.2 }}
                                                w="full"
                                            >
                                                <FormControl>
                                                    <HStack spacing={3}>
                                                        <Box position="relative" flex={1}>
                                                            <Input
                                                                type="date"
                                                                value={date}
                                                                onChange={(e) => handleDateChange(index, e.target.value)}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                required
                                                                bg={`${cardBg}90`}
                                                                border="1px solid"
                                                                borderColor={isDateReserved(date) ? dxcColors.accents.orange : `${dxcColors.primary.purple}30`}
                                                                borderRadius="xl"
                                                                h="45px"
                                                                pl={4}
                                                                _hover={{
                                                                    borderColor: dxcColors.primary.purple,
                                                                    boxShadow: `0 0 0 1px ${dxcColors.primary.purple}30`
                                                                }}
                                                                _focus={{
                                                                    borderColor: dxcColors.primary.purple,
                                                                    boxShadow: `0 0 0 2px ${dxcColors.primary.purple}30`
                                                                }}
                                                                transition="all 0.2s"
                                                            />
                                                        </Box>
                                                        {dates.length > 1 && (
                                                            <Tooltip
                                                                label={t.deleteDate}
                                                                hasArrow
                                                                placement="top"
                                                            >
                                                                <IconButton
                                                                    icon={<DeleteIcon />}
                                                                    onClick={() => removeDateInput(index)}
                                                                    aria-label={t.deleteDate}
                                                                    variant="ghost"
                                                                    color="red.500"
                                                                    _hover={{
                                                                        bg: 'red.50',
                                                                        color: 'red.600'
                                                                    }}
                                                                    size="sm"
                                                                    borderRadius="xl"
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </HStack>
                                                    {isDateReserved(date) && (
                                                        <Text
                                                            color={dxcColors.primary.purple}
                                                            fontSize="sm"
                                                            mt={2}
                                                            display="flex"
                                                            alignItems="center"
                                                        >
                                                            <TimeIcon mr={2} />
                                                            {t.dateReserved}
                                                        </Text>
                                                    )}
                                                </FormControl>
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>

                                    {/* Action Buttons */}
                                    <VStack spacing={4} w="full" pt={3}>
                                        <Button
                                            leftIcon={<AddIcon />}
                                            onClick={addDateInput}
                                            variant="ghost"
                                            w="full"
                                            color={dxcColors.primary.purple}
                                            bg={`${dxcColors.primary.purple}10`}
                                            _hover={{
                                                bg: `${dxcColors.primary.purple}20`
                                            }}
                                            borderRadius="xl"
                                            h="45px"
                                        >
                                            {t.addDate}
                                        </Button>
                                        <Button
                                            type="submit"
                                            w="full"
                                            bg={dxcColors.primary.purple}
                                            color="white"
                                            _hover={{
                                                bg: `${dxcColors.primary.purple}90`,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 12px ${dxcColors.primary.purple}40`
                                            }}
                                            _active={{
                                                bg: dxcColors.primary.purple,
                                                transform: 'translateY(0)',
                                                boxShadow: `0 2px 6px ${dxcColors.primary.purple}30`
                                            }}
                                            _disabled={{
                                                bg: `${dxcColors.primary.purple}60`,
                                                opacity: 0.7,
                                                cursor: 'not-allowed',
                                                transform: 'none',
                                                boxShadow: 'none'
                                            }}
                                            isLoading={loading}
                                            loadingText={t.reserving}
                                            isDisabled={dates.some(date => !date || isDateReserved(date))}
                                            borderRadius="xl"
                                            h="45px"
                                            boxShadow={`0 4px 12px ${dxcColors.primary.purple}30`}
                                            transition="all 0.2s ease"
                                        >
                                            {t.reserve}
                                        </Button>
                                    </VStack>
                                </VStack>
                            </form>

                            {/* Messages */}
                            <AnimatePresence>
                                {message && (
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box
                                            mt={6}
                                            p={4}
                                            borderRadius="xl"
                                            bg={getMessageStyle(message).bg}
                                            backdropFilter="blur(8px)"
                                            border="1px solid"
                                            borderColor={getMessageStyle(message).borderColor}
                                            color={getMessageStyle(message).color}
                                            whiteSpace="pre-line"
                                        >
                                            <HStack spacing={3} align="flex-start">
                                                <Box mt={0.5}>
                                                    {getMessageStyle(message).icon}
                                                </Box>
                                                <Text>{message}</Text>
                                            </HStack>
                                        </Box>
                                    </MotionBox>
                                )}
                            </AnimatePresence>
                        </CardBody>
                    </MotionCard>

                    {/* Reserved Dates Section */}
                    {globalReservedDates.length > 0 && (
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            w="full"
                        >
                            <VStack spacing={6}>
                                <Text
                                    fontSize="lg"
                                    color={dxcColors.primary.purple}
                                    fontWeight="medium"
                                >
                                    {t.reservedDates}
                                </Text>
                                <Wrap spacing={4} justify="center">
                                    {globalReservedDates.map((reservation, index) => (
                                        <WrapItem key={index}>
                                            <MotionBox
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2, delay: index * 0.1 }}
                                            >
                                                <Box
                                                    p={4}
                                                    bg={`${cardBg}90`}
                                                    backdropFilter="blur(8px)"
                                                    borderRadius="xl"
                                                    border="1px solid"
                                                    borderColor={`${dxcColors.primary.purple}20`}
                                                    minW="250px"
                                                    _hover={{
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 4px 12px ${dxcColors.primary.purple}20`,
                                                        borderColor: dxcColors.primary.purple
                                                    }}
                                                    transition="all 0.2s"
                                                >
                                                    <VStack align="start" spacing={3}>
                                                        <Text
                                                            fontWeight="medium"
                                                            color={dxcColors.primary.purple}
                                                        >
                                                            {formatSelectedDate(reservation.date)}
                                                        </Text>
                                                        <HStack
                                                            fontSize="sm"
                                                            color={dxcColors.primary.purple}
                                                            opacity={0.8}
                                                            spacing={2}
                                                        >
                                                            <CalendarIcon boxSize={3} />
                                                            <Text>{reservation.associationName}</Text>
                                                        </HStack>
                                                    </VStack>
                                                </Box>
                                            </MotionBox>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            </VStack>
                        </MotionBox>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default ReserveSessionsPage;