import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    Container,
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    IconButton,
    Input,
    Alert,
    AlertIcon,
    Badge,
    useColorModeValue,
    Spinner,
    Flex,
    Tooltip,
    Circle,
    Wrap,
    WrapItem,
    FormControl,
    Card,
    CardBody,
    useToast
} from '@chakra-ui/react';
import {
    AddIcon,
    DeleteIcon,
    CalendarIcon,
    WarningIcon,
    CheckIcon,
    TimeIcon,
    InfoIcon,
} from '@chakra-ui/icons';
import CustomDatePicker from './CustomDatePicker';

// DXC Color Palette
const dxcColors = {
    primary: {
        purple: '#582C83',
        white: '#FFFFFF'
    },
    secondary: {
        lightGray: '#D8D9D9',
        mediumGray: '#97999B',
        darkGray: '#58595B'
    },
    accents: {
        teal: '#00A6AF',
        blue: '#0095C8',
        darkTeal: '#006275',
        green: '#00C14F',
        orange: '#FF8F1C',
        gold: '#FFCD00',
        red: '#9e0a0a'
    }
};

// Translations object
const translations = {
    fr: {
        pageTitle: "Réserver des Sessions",
        addDate: "Ajouter une autre date",
        deleteDate: "Supprimer cette date",
        dateReserved: "Cette date est déjà réservée par vous ou une autre association",
        dateAlreadySelected: "Cette date est déjà sélectionnée. Veuillez en choisir une autre.",
        missingAssociationId: "Identifiant de l'association manquant.",
        reservationSuccess: "Sessions réservées avec succès.",
        reservationError: "Erreur lors de la réservation.",
        reserving: "Réservation...",
        reserve: "Réserver",
        selectedDates: "Dates Sélectionnées",
        noDatesSelected: "Aucune date sélectionnée",
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
        addDate: "Add another date",
        deleteDate: "Delete this date",
        dateReserved: "This date is already reserved by you or another association",
        dateAlreadySelected: "This date is already selected. Please choose another one.",
        missingAssociationId: "Missing association ID.",
        reservationSuccess: "Sessions booked successfully.",
        reservationError: "Error during reservation.",
        reserving: "Booking...",
        reserve: "Book",
        selectedDates: "Selected Dates",
        noDatesSelected: "No dates selected",
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

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const StatusBadge = ({ status, t }) => {
    const statusColors = {
        pending: { bg: dxcColors.accents.gold, color: 'black' },
        confirmed: { bg: dxcColors.accents.green, color: 'white' },
        cancelled: { bg: dxcColors.accents.red, color: 'white' },
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

    const cardBg = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('gray.50', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const shadowColor = useColorModeValue('rgba(88, 44, 131, 0.1)', 'rgba(0, 166, 175, 0.1)');

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser) {
                    setRawMessage("Please log in to access this page");
                    return;
                }

                if (currentUser.role !== 'ASSOCIATION') {
                    setRawMessage("Access denied. Only associations can view this page.");
                    return;
                }

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
                .slice(1)
                .filter(date => date.trim())
                .map(date => {
                    try {
                        const dateStr = date.trim();
                        const parsedDate = new Date(dateStr);
                        if (!isNaN(parsedDate.getTime())) {
                            return formatDate(parsedDate);
                        }
                        return dateStr;
                    } catch (e) {
                        return date;
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
            console.log('API Response:', response); // Debug log to see the actual structure

            // Based on your API format, sessions are in response.data, not response.sessions
            if (response?.data) {
                const reserved = response.data.map(session => ({
                    date: new Date(session.date).toISOString().split('T')[0], // Ensure YYYY-MM-DD format
                    associationName: session.association.name // Get association name from nested object
                }));
                setGlobalReservedDates(reserved);
                console.log('Reserved dates for date picker:', reserved); // Debug log
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

    const handleDateChange = (index, value) => {
        // Check if date is reserved before allowing the change
        if (isDateReserved(value)) {
            const reservation = globalReservedDates.find(reserved => {
                const reservedDate = typeof reserved === 'object' && reserved.date
                    ? reserved.date
                    : (typeof reserved === 'string' ? reserved : new Date(reserved).toISOString().split('T')[0]);
                return reservedDate === value;
            });

            const associationName = reservation?.associationName || 'another association';
            const message = t.dateAlreadyBooked.replace('{association}', associationName);
            setRawMessage(message);
            return; // Don't allow the change
        }

        // Check for duplicate selection within current form
        if (dates.some((date, i) => i !== index && date === value)) {
            setRawMessage('dateAlreadySelected');
            return;
        }

        // Update the date if it's valid
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

    const isDateReserved = (dateString) => {
        return globalReservedDates.some(reserved => {
            const reservedDate = typeof reserved === 'object' && reserved.date
                ? reserved.date
                : (typeof reserved === 'string' ? reserved : new Date(reserved).toISOString().split('T')[0]);
            return reservedDate === dateString;
        });
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

        const validDates = dates.filter(date => date);
        if (validDates.length === 0) {
            setRawMessage('noDatesSelected');
            return;
        }

        setLoading(true);
        const dto = { dates: validDates };
        try {
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

            const response = await AssociationService.reserveSessions(associationId, dto);

            if (response?.statusCode === 400) {
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
                        .map(conflict => conflict.split(" (")[0].trim())
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
                        .map(conflict => conflict.split(" (")[0].trim())
                        .map(date => formatDate(date));

                    const formattedMessage = conflicts.join('\n');
                    setRawMessage(`${t.dateReserved}\n${formattedMessage}`);
                } else {
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
                bg: `${dxcColors.accents.red}10`,
                borderColor: dxcColors.accents.red,
                color: dxcColors.accents.red,
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
            bg={pageBg}
            py={10}
        >
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

            <Container
                maxW="3xl"
                position="relative"
                zIndex={1}
                px={{ base: 4, md: 8 }}
                py={{ base: 6, md: 10 }}
            >
                <VStack spacing={8}>
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        textAlign="center"
                    >
                        <VStack spacing={4}>
                            <Box position="relative" display="inline-block">
                                <Circle
                                    size="4rem"
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

                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        bg={cardBg}
                        borderRadius="2xl"
                        overflow="hidden"
                        boxShadow={`0 4px 20px ${shadowColor}`}
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
                                                            <CustomDatePicker
                                                                value={date}
                                                                onChange={(value) => handleDateChange(index, value)}
                                                                minDate={getMinDate()}
                                                                reservedDates={globalReservedDates} // This will now be in correct format
                                                                language={language}
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
                                                                    colorScheme="red"
                                                                    size="sm"
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </HStack>
                                                </FormControl>
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>

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
                                        >
                                            {t.addDate}
                                        </Button>
                                        <Button
                                            type="submit"
                                            w="full"
                                            bg={dxcColors.primary.purple}
                                            color="white"
                                            _hover={{
                                                bg: `${dxcColors.primary.purple}90`
                                            }}
                                            isLoading={loading}
                                            loadingText={t.reserving}
                                            isDisabled={dates.some(date => !date || isDateReserved(date))}
                                        >
                                            {t.reserve}
                                        </Button>
                                    </VStack>
                                </VStack>
                            </form>

                            <AnimatePresence>
                                {message && (
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        mt={6}
                                    >
                                        <Alert
                                            status={message === t.reservationSuccess ? "success" : "error"}
                                            variant="subtle"
                                            borderRadius="xl"
                                        >
                                            <AlertIcon />
                                            <Text>{message}</Text>
                                        </Alert>
                                    </MotionBox>
                                )}
                            </AnimatePresence>
                        </CardBody>
                    </MotionCard>

                    {globalReservedDates.length > 0 && (
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            w="full"
                        >
                        </MotionBox>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default ReserveSessionsPage;