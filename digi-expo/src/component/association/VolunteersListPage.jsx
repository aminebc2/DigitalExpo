import React, { useEffect, useState } from 'react';
import AssociationService from "../../service/AssociationService";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUser, FaUserFriends, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    Heading,
    Text,
    Stack,
    VStack,
    HStack,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    useColorModeValue,
    Circle,
    Badge,
    Flex,
    Divider,
    Button,
    Wrap,
    WrapItem,
    useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const translations = {
    fr: {
        pageTitle: "Liste des Bénévoles",
        loading: "Chargement des bénévoles...",
        error: "Erreur lors du chargement des bénévoles",
        noVolunteers: "Aucun bénévole trouvé",
        unnamedVolunteer: "Bénévole sans nom",
        email: "Email",
        phone: "Téléphone",
        notProvided: "Non fourni",
        availableDays: "Jours disponibles",
        noDaysAvailable: "Aucun jour disponible",
        volunteersCount: "{count} bénévoles inscrits",
        activeVolunteer: "Bénévole Actif",
        days: {
            monday: "Lundi",
            tuesday: "Mardi",
            wednesday: "Mercredi",
            thursday: "Jeudi",
            friday: "Vendredi",
            saturday: "Samedi",
            sunday: "Dimanche"
        }
    },
    en: {
        pageTitle: "Volunteers List",
        loading: "Loading volunteers...",
        error: "Error fetching volunteers",
        noVolunteers: "No volunteers found",
        unnamedVolunteer: "Unnamed Volunteer",
        email: "Email",
        phone: "Phone",
        notProvided: "Not provided",
        availableDays: "Available Days",
        noDaysAvailable: "No days available",
        volunteersCount: "{count} volunteers registered",
        activeVolunteer: "Active Volunteer",
        days: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
        }
    }
};

const StatusIndicator = ({ isActive }) => (
    <Circle
        size={3}
        bg={isActive ? "#5f249f" : "gray.400"}
        boxShadow={isActive ? "0 0 12px rgba(95, 36, 159, 0.5)" : "none"}
    />
);

const VolunteerCard = ({ volunteer, t, formatAvailableDays }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const mutedColor = useColorModeValue('gray.600', 'gray.400');
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <MotionBox
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            width="100%"
        >
            <Box
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                overflow="hidden"
                position="relative"
                transition="all 0.2s"
                _hover={{
                    borderColor: '#5f249f',
                    boxShadow: 'lg',
                }}
            >
                <Flex
                    direction={isMobile ? "column" : "row"}
                    align={isMobile ? "stretch" : "center"}
                    justify="space-between"
                    p={6}
                    gap={4}
                >
                    {/* Left Section - Basic Info */}
                    <HStack spacing={4} flex="2">
                        <Box position="relative">
                            <Circle
                                size={12}
                                bg="#f3e8ff"
                                color="#5f249f"
                                position="relative"
                            >
                                <Icon as={FaUser} boxSize={5} />
                            </Circle>
                            <StatusIndicator
                                isActive={true}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                }}
                            />
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                {volunteer.username || t.unnamedVolunteer}
                            </Text>
                            <HStack spacing={2}>
                                <Badge bg="#5f249f" color="white" variant="solid">
                                    {t.activeVolunteer}
                                </Badge>
                            </HStack>
                        </VStack>
                    </HStack>

                    {/* Middle Section - Contact Info */}
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={4}
                        flex="3"
                        divider={!isMobile && <Divider orientation="vertical" />}
                    >
                        <HStack spacing={3}>
                            <Icon as={FaEnvelope} color="#5f249f" />
                            <Text color={mutedColor} fontSize="sm">
                                {volunteer.email}
                            </Text>
                        </HStack>
                        <HStack spacing={3}>
                            <Icon as={FaPhone} color="#5f249f" />
                            <Text color={mutedColor} fontSize="sm">
                                {volunteer.phoneNumber || t.notProvided}
                            </Text>
                        </HStack>
                    </Stack>

                    {/* Right Section - Available Days */}
                    <Box flex="2">
                        <VStack align="start" spacing={2}>
                            <HStack spacing={2}>
                                <Icon as={FaCalendarAlt} color="#5f249f" />
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={textColor}
                                >
                                    {t.availableDays}
                                </Text>
                            </HStack>
                            <Wrap spacing={2}>
                                {volunteer.availableDays?.map((day, index) => (
                                    <WrapItem key={index}>
                                        <Badge
                                            bg="#f3e8ff"
                                            color="#5f249f"
                                            px={2}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {t.days[day.toLowerCase()]}
                                        </Badge>
                                    </WrapItem>
                                )) || (
                                    <Text fontSize="sm" color={mutedColor}>
                                        {t.noDaysAvailable}
                                    </Text>
                                )}
                            </Wrap>
                        </VStack>
                    </Box>
                </Flex>
            </Box>
        </MotionBox>
    );
};

const VolunteersListPage = ({ associationId }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await AssociationService.getVolunteers(volunteerId);
                const volunteersList = response?.volunteerList;

                if (Array.isArray(volunteersList)) {
                    setVolunteers(volunteersList);
                } else {
                    setVolunteers([]);
                }
                setLoading(false);
            } catch (error) {
                setError(t.error);
                setVolunteers([]);
                setLoading(false);
            }
        };

        if (volunteerId) fetchVolunteers();
    }, [volunteerId, language]);

    const formatAvailableDays = (days) => {
        if (!days || days.length === 0) return t.noDaysAvailable;
        return days.map(day => {
            const dayKey = day.toLowerCase();
            return t.days[dayKey] || day;
        }).join(', ');
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    <Flex
                        justify="space-between"
                        align="center"
                        bg={useColorModeValue('white', 'gray.800')}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                    >
                        <HStack spacing={4}>
                            <Circle size={12} bg="#f3e8ff" color="#5f249f">
                                <Icon as={FaUserFriends} boxSize={6} />
                            </Circle>
                            <VStack align="start" spacing={1}>
                                <Heading size="lg">{t.pageTitle}</Heading>
                                <Text color="gray.500">
                                    {t.volunteersCount.replace('{count}', volunteers.length)}
                                </Text>
                            </VStack>
                        </HStack>
                    </Flex>

                    {error && (
                        <Alert status="error" borderRadius="lg">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <VStack py={12} spacing={4}>
                            <Spinner size="xl" color="#5f249f" thickness="4px" />
                            <Text>{t.loading}</Text>
                        </VStack>
                    ) : volunteers.length > 0 ? (
                        <VStack spacing={4}>
                            {volunteers.map((volunteer) => (
                                <VolunteerCard
                                    key={volunteer.id}
                                    volunteer={volunteer}
                                    t={t}
                                    formatAvailableDays={formatAvailableDays}
                                />
                            ))}
                        </VStack>
                    ) : (
                        <VStack py={12} spacing={4}>
                            <Circle size={16} bg="#f3e8ff" color="#5f249f">
                                <Icon as={FaUserFriends} boxSize={8} />
                            </Circle>
                            <Text fontSize="lg" color="gray.500">
                                {t.noVolunteers}
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default VolunteersListPage;
