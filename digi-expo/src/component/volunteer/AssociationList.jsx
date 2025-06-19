import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    Heading,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    VStack,
    HStack,
    Icon,
    Button,
    Select,
    useColorModeValue,
    Badge,
    Image,
    Flex,
    Alert,
    AlertIcon,
    Circle,
    useToast,
    Skeleton,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaUser,
    FaBuilding,
    FaHandshake,
    FaCheckCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

const MotionBox = motion(Box);
const MotionGrid = motion(SimpleGrid);

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const translations = {
    fr: {
        pageTitle: "Découvrez des Associations",
        pageDescription: "Explorez et rejoignez des associations qui partagent vos valeurs",
        searchPlaceholder: "Rechercher une association...",
        loginRequired: "Vous devez être connecté pour rejoindre une association",
        loadError: "Impossible de charger les associations",
        networkError: "Erreur de connexion au serveur",
        requestSuccess: "Votre demande d'adhésion a été envoyée avec succès",
        requestFailed: "Échec de l'envoi de la demande d'adhésion",
        noAssociations: "Aucune Association Disponible",
        noAssociationsDesc: "Il n'y a pas d'associations disponibles pour le moment. Revenez bientôt !",
        sending: "Envoi en cours...",
        requestSent: "Demande Envoyée",
        joinAssociation: "Rejoindre",
        available: "Disponible",
        joined: "Membre",
        email: "Courriel",
        manager: "Responsable",
        phone: "Téléphone",
        contactInfo: "Coordonnées",
        ville: "Ville",
        contactSection: "Informations de Contact",
        joinButton: "Rejoindre l'Association",
        successTitle: "Succès !",
        errorTitle: "Erreur",
        requestAlreadyExists: "Une demande existe déjà pour ce bénévole et cette association",
        allCities: "Toutes les villes"
    },
    en: {
        pageTitle: "Discover Associations",
        pageDescription: "Explore and join associations that share your values",
        searchPlaceholder: "Search for an association...",
        loginRequired: "You must be logged in to join an association",
        loadError: "Unable to load associations",
        networkError: "Server connection error",
        requestSuccess: "Your membership request has been sent successfully",
        requestFailed: "Failed to send membership request",
        noAssociations: "No Associations Available",
        noAssociationsDesc: "There are no associations available at the moment. Check back soon!",
        sending: "Sending...",
        requestSent: "Request Sent",
        joinAssociation: "Join",
        available: "Available",
        joined: "Member",
        email: "Email",
        manager: "Manager",
        phone: "Phone",
        contactInfo: "Contact Details",
        ville: "City",
        contactSection: "Contact Information",
        joinButton: "Join Association",
        successTitle: "Success!",
        errorTitle: "Error",
        requestAlreadyExists: "Request already exists for this volunteer and association",
        allCities: "All cities"
    }
};

const AssociationCard = ({ association, onJoin, isJoined, isLoading, index }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const cardBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const headingColor = useColorModeValue('gray.700', 'white');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Box
                bg={cardBg}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow={`0 4px 20px ${shadowColor}`}
                position="relative"
                transition="all 0.3s"
                _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "2xl",
                }}
            >
                <Box
                    position="relative"
                    width="100%"
                    height="260px"
                    bg="purple.50"
                >
                    {association.imageFileName ? (
                        <Image
                            src={`http://localhost:8080/images/${association.imageFileName}`}
                            alt={association.name}
                            objectFit="contain"
                            w="full"
                            h="full"
                            p={4}
                        />
                    ) : (
                        <Flex
                            w="full"
                            h="full"
                            align="center"
                            justify="center"
                        >
                            <Icon as={FaBuilding} boxSize={12} color="purple.200" />
                        </Flex>
                    )}
                    <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        colorScheme={isJoined ? 'green' : 'purple'}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        boxShadow="md"
                    >
                        {isJoined ? t.joined : t.available}
                    </Badge>
                </Box>

                <Box p={6}>
                    <VStack align="stretch" spacing={4}>
                        <Heading size="lg" color={headingColor}>
                            {association.name}
                        </Heading>

                        <VStack align="stretch" spacing={2}>
                            <HStack spacing={2} color={textColor}>
                                <Icon as={FaEnvelope} color="purple.500" />
                                <Text>{association.email}</Text>
                            </HStack>
                            <HStack spacing={2} color={textColor}>
                                <Icon as={FaUser} color="purple.500" />
                                <Text>{association.responsableName}</Text>
                            </HStack>
                            {association.responsablePhone && (
                                <HStack spacing={2} color={textColor}>
                                    <Icon as={FaPhone} color="purple.500" />
                                    <Text>{association.responsablePhone}</Text>
                                </HStack>
                            )}
                            <HStack spacing={2} color={textColor}>
                                <Icon as={FaMapMarkerAlt} color="purple.500" />
                                <Text>{association.ville}</Text>
                            </HStack>
                        </VStack>

                        <Button
                            leftIcon={!isLoading && (isJoined ? <FaCheckCircle /> : <FaHandshake />)}
                            onClick={() => onJoin(association.id)}
                            isLoading={isLoading}
                            isDisabled={isJoined}
                            bg="#582C83"
                            color="white"
                            size="lg"
                            width="full"
                            borderRadius="xl"
                            _hover={{
                                bg: '#4C1D96',
                                transform: 'translateY(-2px)',
                            }}
                        >
                            {isLoading ? t.sending : isJoined ? t.requestSent : t.joinButton}
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </MotionBox>
    );
};

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [joinedIds, setJoinedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    // Color mode values
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');

    useEffect(() => {
        const fetchAssociations = async () => {
            if (!volunteerId) {
                toast({
                    title: t.errorTitle,
                    description: t.loginRequired,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setLoading(false);
                return;
            }
            try {
                const response = await VolunteerService.getAllAssociations();
                if (response.status === 200) {
                    setAssociations(response.data.associationList || []);
                    setError(null);
                } else {
                    setError(t.loadError);
                }
            } catch (err) {
                setError(t.networkError);
            } finally {
                setLoading(false);
            }
        };

        fetchAssociations();
    }, [volunteerId, t.errorTitle, t.loginRequired, t.loadError, t.networkError, toast]);

    const handleJoinAssociation = async (associationId) => {
        if (!volunteerId) {
            toast({
                title: t.errorTitle,
                description: t.loginRequired,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setLoadingId(associationId);
        try {
            const res = await VolunteerService.createRequest(volunteerId, associationId);
            toast({
                title: t.successTitle,
                description: t.requestSuccess,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setJoinedIds((prev) => [...prev, associationId]);
        } catch (err) {
            const isRequestExistsError = err.response?.data?.message?.toLowerCase().includes('already exists');
            toast({
                title: t.errorTitle,
                description: isRequestExistsError ? t.requestAlreadyExists : t.requestFailed,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            if (isRequestExistsError) {
                setJoinedIds((prev) => [...prev, associationId]);
            }
        } finally {
            setLoadingId(null);
        }
    };

    // Filter associations by search and city
    const filteredAssociations = associations.filter(a => {
        const matchesSearch = (a.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (a.ville?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCity = !cityFilter || a.ville === cityFilter;
        return matchesSearch && matchesCity;
    });

    const cities = [...new Set(associations
        .filter(a => a?.ville)
        .map(a => a.ville))];

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Hero Section with Search */}
            <Box
                bgGradient="linear(to-r, #582C83, #4C1D96)"
                pt={24}
                pb={32}
                position="relative"
                overflow="hidden"
            >
                {/* Animated Background Elements */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    overflow="hidden"
                    zIndex="0"
                >
                    {[...Array(5)].map((_, i) => (
                        <Circle
                            key={i}
                            position="absolute"
                            bg={`rgba(255, 255, 255, ${0.03 + i * 0.01})`}
                            w={`${300 + i * 100}px`}
                            h={`${300 + i * 100}px`}
                            top={`${-50 + i * 20}%`}
                            left={`${-20 + i * 30}%`}
                            transform="rotate(-45deg)"
                            filter="blur(60px)"
                        />
                    ))}
                </Box>

                <Container maxW="container.xl" position="relative" zIndex={1}>
                    <VStack spacing={6} align="center" textAlign="center" mb={12}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Icon
                                as={FaBuilding}
                                boxSize={{ base: 12, md: 16 }}
                                color="white"
                                mb={6}
                                animation={`${float} 3s ease-in-out infinite`}
                            />
                            <Heading
                                as="h1"
                                size="3xl"
                                color="white"
                                fontWeight="bold"
                                letterSpacing="tight"
                                mb={4}
                            >
                                {t.pageTitle}
                            </Heading>
                            <Text
                                fontSize="xl"
                                color="whiteAlpha.900"
                                maxW="2xl"
                                mx="auto"
                            >
                                {t.pageDescription}
                            </Text>
                        </MotionBox>
                    </VStack>

                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <HStack
                            spacing={4}
                            justify="center"
                            maxW="2xl"
                            mx="auto"
                            bg="whiteAlpha.200"
                            p={2}
                            borderRadius="full"
                            backdropFilter="blur(10px)"
                        >
                            <InputGroup size="lg" flex={1}>
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FaSearch} color="whiteAlpha.700" />
                                </InputLeftElement>
                                <Input
                                    placeholder={t.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    variant="unstyled"
                                    color="white"
                                    pl={12}
                                    _placeholder={{ color: "whiteAlpha.700" }}
                                />
                            </InputGroup>
                            <Select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                placeholder={t.allCities}
                                bg="white"
                                color="purple.600"
                                size="lg"
                                maxW="200px"
                                borderRadius="full"
                                _hover={{
                                    bg: "whiteAlpha.900"
                                }}
                            >
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </Select>
                        </HStack>
                    </MotionBox>
                </Container>
            </Box>

            {/* Main Content */}
            <Box
                transform="translateY(-100px)"
                position="relative"
                zIndex={1}
            >
                <Container maxW="container.xl" px={4}>
                    {/* Error Alert */}
                    {error && (
                        <Alert status="error" borderRadius="xl" mb={8}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    {/* Associations Grid */}
                    {loading ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                            {[...Array(6)].map((_, i) => (
                                <Box
                                    key={i}
                                    bg={cardBg}
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    boxShadow={`0 4px 20px ${shadowColor}`}
                                >
                                    <Skeleton height="200px" />
                                    <Box p={6}>
                                        <VStack align="stretch" spacing={4}>
                                            <Skeleton height="24px" width="70%" />
                                            <Skeleton height="20px" width="40%" />
                                            <Skeleton height="20px" width="30%" />
                                        </VStack>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : filteredAssociations.length === 0 ? (
                        <Box
                            bg={cardBg}
                            borderRadius="2xl"
                            p={12}
                            textAlign="center"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                        >
                            <Icon as={FaBuilding} boxSize={12} color="#582C83" mb={4} />
                            <Text color={textColor} fontSize="xl" fontWeight="medium">
                                {t.noAssociations}
                            </Text>
                            <Text color={textColor} mt={2}>
                                {t.noAssociationsDesc}
                            </Text>
                        </Box>
                    ) : (
                        <MotionGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={8}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {filteredAssociations.map((association, index) => (
                                <AssociationCard
                                    key={association.id}
                                    association={association}
                                    onJoin={handleJoinAssociation}
                                    isJoined={joinedIds.includes(association.id)}
                                    isLoading={loadingId === association.id}
                                    index={index}
                                />
                            ))}
                        </MotionGrid>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default AssociationList;