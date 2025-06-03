import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Input,
    IconButton,
    VStack,
    HStack,
    Alert,
    AlertDescription,
    Flex,
    Spinner,
    useToast,
    useColorMode,
    Badge,
    Divider,
    Tooltip,
} from '@chakra-ui/react';
import {
    AddIcon,
    DeleteIcon,
    CalendarIcon,
    WarningIcon,
    CheckIcon,
} from '@chakra-ui/icons';
import AssociationService from '../../service/AssociationService';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Translations object
const translations = {
    fr: {
        pageTitle: "Réserver des Sessions",
        subtitle: "Planifiez vos sessions en quelques clics",
        addDate: "Ajouter une date",
        deleteDate: "Supprimer cette date",
        dateReserved: "Cette date est déjà réservée par une autre association",
        dateAlreadySelected: "Cette date est déjà sélectionnée",
        missingAssociationId: "Identifiant de l'association manquant",
        reservationSuccess: "Sessions réservées avec succès",
        reservationError: "Erreur lors de la réservation",
        reserving: "Réservation en cours...",
        reserve: "Confirmer la réservation",
        selectedDates: "Dates sélectionnées",
        loading: "Chargement...",
        alreadyBooked: "Déjà réservé",
        viewBooking: "Cette date est réservée par",
    },
    en: {
        pageTitle: "Book Sessions",
        subtitle: "Schedule your sessions in a few clicks",
        addDate: "Add date",
        deleteDate: "Delete this date",
        dateReserved: "This date is already reserved by another association",
        dateAlreadySelected: "This date is already selected",
        missingAssociationId: "Missing association ID",
        reservationSuccess: "Sessions booked successfully",
        reservationError: "Error during reservation",
        reserving: "Booking in progress...",
        reserve: "Confirm booking",
        selectedDates: "Selected dates",
        loading: "Loading...",
        alreadyBooked: "Already booked",
        viewBooking: "This date is booked by",
    }
};

const MotionBox = motion(Box);

// New color palette with main color #5f249f
const colors = {
    gradient: {
        primary: 'linear-gradient(135deg, #7B2CBF 0%, #5F249F 100%)',
        secondary: 'linear-gradient(135deg, #9D4EDD 0%, #7B2CBF 100%)',
        red: 'linear-gradient(135deg, #E5383B 0%, #BA181B 100%)',
        green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        dark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    },
    solid: {
        primary: '#5F249F',
        primaryLight: '#7B2CBF',
        primaryDark: '#4C1D80',
        secondary: '#9D4EDD',
        red: '#BA181B',
        green: '#059669',
        gray: '#64748B',
        light: '#F8FAFC',
        dark: '#1E293B',
    },
    bg: {
        light: '#F8F9FF',
        dark: '#0F172A',
        card: {
            light: 'rgba(255, 255, 255, 0.9)',
            dark: 'rgba(30, 41, 59, 0.9)',
        },
    },
    alpha: {
        primary: {
            light: 'rgba(95, 36, 159, 0.1)',
            medium: 'rgba(95, 36, 159, 0.3)',
            dark: 'rgba(95, 36, 159, 0.5)',
        }
    }
};

const ReserveSessionsPage = () => {
    const { id: associationId } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { language } = useLanguage();
    const t = translations[language];
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const toast = useToast();
    const { colorMode } = useColorMode();

    // Theme-based colors
    const themeColors = {
        bg: colorMode === 'light' ? colors.bg.light : colors.bg.dark,
        cardBg: colorMode === 'light' ? colors.bg.card.light : colors.bg.card.dark,
        text: colorMode === 'light' ? colors.solid.dark : 'white',
        subtext: colorMode === 'light' ? colors.solid.gray : '#94A3B8',
        border: colorMode === 'light' ? '#E2E8F0' : '#2D3748',
    };

    const { register, control, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            dates: [{ date: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "dates"
    });

    // Fetch all reserved sessions
    const { data: globalReservedData, isLoading: isLoadingGlobal } = useQuery({
        queryKey: ['reservedSessions'],
        queryFn: AssociationService.getAllReservedSessions,
        enabled: !!currentUser?.role === 'ASSOCIATION'
    });

    // Reserve sessions mutation
    const reserveMutation = useMutation({
        mutationFn: (data) => AssociationService.reserveSessions(associationId, {
            dates: data.dates.map(d => d.date).filter(Boolean)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['reservedSessions']);
            reset({ dates: [{ date: '' }] });
            setSuccessMessage(t.reservationSuccess);
            setErrorMessage('');
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    });

    const globalReservedDates = globalReservedData?.sessions || [];

    const isDateGloballyReserved = (date) => {
        return globalReservedDates.some(reserved => reserved.date === date);
    };

    const getAssociationForDate = (date) => {
        const reservation = globalReservedDates.find(reserved => reserved.date === date);
        return reservation?.associationName || '';
    };

    const onSubmit = async (data) => {
        const reservedDates = data.dates
            .filter(({ date }) => isDateGloballyReserved(date))
            .map(({ date }) => ({
                date: format(new Date(date), 'dd/MM/yyyy', { locale: language === 'fr' ? fr : enUS }),
                associationName: getAssociationForDate(date)
            }));

        if (reservedDates.length > 0) {
            const formattedMessage = reservedDates
                .map(({ date, associationName }) => `${date}`)
                .join('\n');
            setErrorMessage(`${t.dateReserved}:\n${formattedMessage}`);
            return;
        }

        try {
            await reserveMutation.mutateAsync(data);
            setErrorMessage('');
        } catch (error) {
            console.error('Reservation error:', error);
            if (error.response?.data?.message?.includes('already exist')) {
                const date = error.response.data.message.split(': ')[1];
                const formattedDate = format(new Date(date), 'dd/MM/yyyy', { locale: language === 'fr' ? fr : enUS });
                const associationName = getAssociationForDate(date);
                setErrorMessage(`${t.dateReserved}:\n${formattedDate}`);
            } else {
                setErrorMessage(t.reservationError);
            }
        }
    };

    if (isLoadingGlobal) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={themeColors.bg}>
                <VStack spacing={4}>
                    <Spinner size="xl" color={colors.solid.primary} thickness="4px" />
                    <Text color={themeColors.text} fontSize="lg">{t.loading}</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box
            minH="100vh"
            bg={themeColors.bg}
            bgImage={colorMode === 'light' ?
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235F249F' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" :
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235F249F' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
            }
            py={16}
        >
            <Container maxW="3xl" px={4}>
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    mb={12}
                    textAlign="center"
                >
                    <Box
                        bgGradient={colors.gradient.primary}
                        display="inline-block"
                        p={3}
                        borderRadius="2xl"
                        mb={6}
                        boxShadow="lg"
                    >
                        <CalendarIcon boxSize={10} color="white" />
                    </Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: "4xl", md: "5xl" }}
                        fontWeight="extrabold"
                        bgGradient={colorMode === 'light' ? colors.gradient.primary : 'linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)'}
                        bgClip="text"
                        mb={4}
                    >
                        {t.pageTitle}
                    </Heading>
                    <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color={themeColors.subtext}
                        maxW="2xl"
                        mx="auto"
                    >
                        {t.subtitle}
                    </Text>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        bg={themeColors.cardBg}
                        borderRadius="3xl"
                        boxShadow="2xl"
                        overflow="hidden"
                        p={{ base: 6, md: 10 }}
                        backdropFilter="blur(10px)"
                        border="1px solid"
                        borderColor={themeColors.border}
                        position="relative"
                        _before={{
                            content: '""',
                            position: "absolute",
                            top: "-50%",
                            right: "-50%",
                            width: "200%",
                            height: "200%",
                            background: `radial-gradient(circle, ${colors.alpha.primary.light} 0%, transparent 50%)`,
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    >
                        <Box position="relative" zIndex={1}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack spacing={8} align="stretch">
                                    <AnimatePresence>
                                        {fields.map((field, index) => (
                                            <MotionBox
                                                key={field.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <HStack spacing={4} align="flex-start">
                                                    <Box flex={1} position="relative">
                                                        <Input
                                                            type="date"
                                                            {...register(`dates.${index}.date`)}
                                                            isInvalid={isDateGloballyReserved(watch(`dates.${index}.date`))}
                                                            required
                                                            min={new Date().toISOString().split('T')[0]}
                                                            size="lg"
                                                            bg={themeColors.cardBg}
                                                            borderColor={themeColors.border}
                                                            borderWidth="2px"
                                                            borderRadius="xl"
                                                            h="60px"
                                                            fontSize="lg"
                                                            _hover={{ borderColor: colors.solid.primary }}
                                                            _focus={{
                                                                borderColor: colors.solid.primary,
                                                                boxShadow: `0 0 0 1px ${colors.solid.primary}`
                                                            }}
                                                            pr="140px"
                                                            sx={{
                                                                "&::-webkit-calendar-picker-indicator": {
                                                                    opacity: 0,
                                                                    position: "absolute",
                                                                    right: "16px",
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    cursor: "pointer"
                                                                }
                                                            }}
                                                        />
                                                        <Box
                                                            position="absolute"
                                                            right="3"
                                                            top="3"
                                                            pointerEvents="none"
                                                            bg={colors.solid.primary}
                                                            p="2"
                                                            borderRadius="lg"
                                                            color="white"
                                                            opacity={0.9}
                                                            _hover={{ opacity: 1 }}
                                                            transition="opacity 0.2s"
                                                        >
                                                            <CalendarIcon boxSize={6} />
                                                        </Box>
                                                        {isDateGloballyReserved(watch(`dates.${index}.date`)) && (
                                                            <Tooltip
                                                                label={getAssociationForDate(watch(`dates.${index}.date`))}
                                                                placement="top"
                                                                hasArrow
                                                                bgGradient={colors.gradient.red}
                                                                color="white"
                                                                px={4}
                                                                py={2}
                                                                borderRadius="lg"
                                                            >
                                                                <Badge
                                                                    position="absolute"
                                                                    right="16"
                                                                    top="3"
                                                                    bgGradient={colors.gradient.red}
                                                                    color="white"
                                                                    px={4}
                                                                    py={2}
                                                                    borderRadius="full"
                                                                    fontSize="md"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}
                                                                    boxShadow="md"
                                                                    _hover={{
                                                                        transform: 'translateY(-1px)',
                                                                        boxShadow: 'lg',
                                                                    }}
                                                                    transition="all 0.2s"
                                                                >
                                                                    <WarningIcon boxSize={4} />
                                                                    {t.alreadyBooked}
                                                                </Badge>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                    {fields.length > 1 && (
                                                        <IconButton
                                                            icon={<DeleteIcon />}
                                                            onClick={() => remove(index)}
                                                            bgGradient={colors.gradient.red}
                                                            color="white"
                                                            size="lg"
                                                            fontSize="xl"
                                                            borderRadius="xl"
                                                            aria-label={t.deleteDate}
                                                            _hover={{
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: 'lg',
                                                            }}
                                                            transition="all 0.2s"
                                                        />
                                                    )}
                                                </HStack>
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>

                                    <Divider borderColor={themeColors.border} borderWidth="1px" />

                                    <HStack spacing={4} justify="space-between">
                                        <Button
                                            leftIcon={<AddIcon />}
                                            onClick={() => append({ date: '' })}
                                            variant="ghost"
                                            size="lg"
                                            fontSize="lg"
                                            height="60px"
                                            px={8}
                                            color={colors.solid.primary}
                                            borderRadius="xl"
                                            _hover={{
                                                bg: colors.alpha.primary.light,
                                                transform: 'translateY(-1px)',
                                            }}
                                            transition="all 0.2s"
                                        >
                                            {t.addDate}
                                        </Button>
                                        <Button
                                            type="submit"
                                            isLoading={reserveMutation.isPending}
                                            loadingText={t.reserving}
                                            isDisabled={fields.some(field => isDateGloballyReserved(watch(`dates.${fields.indexOf(field)}.date`)))}
                                            bgGradient={colors.gradient.primary}
                                            color="white"
                                            size="lg"
                                            fontSize="lg"
                                            height="60px"
                                            px={8}
                                            borderRadius="xl"
                                            rightIcon={<CalendarIcon />}
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'lg',
                                            }}
                                            _active={{
                                                transform: 'translateY(0)',
                                            }}
                                            transition="all 0.2s"
                                        >
                                            {t.reserve}
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>

                            <AnimatePresence>
                                {(errorMessage || successMessage) && (
                                    <MotionBox
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        mt={6}
                                    >
                                        {successMessage ? (
                                            <Alert
                                                status="success"
                                                variant="subtle"
                                                borderRadius="xl"
                                                bg="green.50"
                                                borderWidth="1px"
                                                borderColor="green.200"
                                                p={4}
                                                display="flex"
                                                alignItems="center"
                                                gap={3}
                                                boxShadow="sm"
                                            >
                                                <Box
                                                    bg="green.400"
                                                    borderRadius="full"
                                                    p={2}
                                                    color="white"
                                                >
                                                    <CheckIcon boxSize={4} />
                                                </Box>
                                                <VStack align="start" spacing={0}>
                                                    <Text
                                                        color="green.800"
                                                        fontSize="md"
                                                        fontWeight="semibold"
                                                    >
                                                        {t.reservationSuccess}
                                                    </Text>
                                                </VStack>
                                            </Alert>
                                        ) : (
                                            <Alert
                                                status="error"
                                                variant="solid"
                                                borderRadius="xl"
                                                bgGradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                                                color="white"
                                                p={4}
                                                display="flex"
                                                alignItems="center"
                                                gap={3}
                                                boxShadow="lg"
                                                _hover={{
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: 'xl',
                                                }}
                                                transition="all 0.2s"
                                            >
                                                <Box
                                                    bg="red.500"
                                                    borderRadius="full"
                                                    p={2}
                                                >
                                                    <WarningIcon boxSize={4} />
                                                </Box>
                                                <Text fontSize="md" fontWeight="medium">
                                                    {errorMessage}
                                                </Text>
                                            </Alert>
                                        )}
                                    </MotionBox>
                                )}
                            </AnimatePresence>
                        </Box>
                    </Box>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default ReserveSessionsPage;