import React, { useEffect, useState } from 'react';
import VolunteerService from "../../service/VolunteerService";
import { FaBuilding, FaHandshake, FaCheckCircle, FaArrowRight, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Image,
    Icon,
    useColorModeValue,
    VStack,
    Badge,
    Flex,
    HStack,
    useToast,
    Input,
    Select,
} from '@chakra-ui/react';
import { useLanguage } from '../../context/LanguageContext';

const translations = {
    fr: {
        pageTitle: "Découvrez des Associations",
        pageSubtitle: "Explorez et rejoignez des associations qui partagent vos valeurs",
        loginRequired: "Vous devez être connecté pour rejoindre une association",
        missingVolunteerId: "ID du bénévole manquant. Veuillez vous reconnecter",
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
        requestAlreadyExists: "Une demande existe déjà pour ce bénévole et cette association"
    },
    en: {
        pageTitle: "Discover Associations",
        pageSubtitle: "Explore and join associations that share your values",
        loginRequired: "You must be logged in to join an association",
        missingVolunteerId: "Volunteer ID is missing. Please log in again",
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
        requestAlreadyExists: "Request already exists for this volunteer and association"
    }
};

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const InfoItem = ({ icon, label, value }) => {
    const textColor = useColorModeValue('gray.600', 'gray.300');
    return value ? (
        <HStack spacing={2} align="center">
            <Icon as={icon} color="purple.400" />
            <Text color={textColor} fontSize="sm" fontWeight="medium">
                {value}
            </Text>
        </HStack>
    ) : null;
};

const AssociationCard = ({ association, onJoin, isJoined, isLoading, index }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
    const headingColor = useColorModeValue('purple.800', 'white');
    const buttonScheme = isJoined ? 'green' : 'purple';
    const floatAnimation = `${float} 3s ease-in-out infinite`;
    const pulseAnimation = `${pulse} 2s ease-in-out infinite`;
    const imageBg = useColorModeValue('purple.50', 'purple.900');

    return (
        <Box
            position="relative"
            animation={floatAnimation}
            style={{ animationDelay: `${index * 0.2}s` }}
            mb={6}
        >
            <Box
                bg={cardBg}
                borderRadius="3xl"
                overflow="hidden"
                position="relative"
                transition="all 0.3s"
                boxShadow="2xl"
                backdropFilter="blur(10px)"
                _hover={{
                    transform: 'scale(1.02)',
                    boxShadow: '3xl',
                }}
            >
                <Box
                    position="relative"
                    height="300px"
                    bg={imageBg}
                >
                    {association.imageFileName ? (
                        <Image
                            src={`http://localhost:8080/images/${association.imageFileName}`}
                            alt={`Logo - ${association.name}`}
                            w="full"
                            h="full"
                            objectFit="contain"
                            p={4}
                            transition="transform 0.5s"
                            _hover={{ transform: 'scale(1.05)' }}
                        />
                    ) : (
                        <Flex
                            w="full"
                            h="full"
                            align="center"
                            justify="center"
                        >
                            <Icon
                                as={FaBuilding}
                                boxSize={16}
                                color="purple.200"
                                animation={pulseAnimation}
                            />
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
                    <VStack spacing={4} align="stretch">
                        <Heading
                            size="md"
                            color={headingColor}
                            noOfLines={2}
                        >
                            {association.name}
                        </Heading>

                        <VStack spacing={3} align="stretch">
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="purple.500"
                            >
                                {t.contactSection}
                            </Text>
                            <InfoItem
                                icon={FaEnvelope}
                                label={t.email}
                                value={association.email}
                            />
                            <InfoItem
                                icon={FaUser}
                                label={t.manager}
                                value={association.responsableName}
                            />
                            <InfoItem
                                icon={FaPhone}
                                label={t.phone}
                                value={association.responsablePhone}
                            />
                            <InfoItem
                                icon={FaMapMarkerAlt}
                                label={t.ville}
                                value={association.ville}
                            />
                        </VStack>

                        <Button
                            colorScheme={buttonScheme}
                            size="lg"
                            isLoading={isLoading}
                            onClick={() => onJoin(association.id)}
                            isDisabled={isJoined}
                            leftIcon={!isLoading && (isJoined ? <FaCheckCircle /> : <FaHandshake />)}
                            rightIcon={!isJoined && !isLoading ? <FaArrowRight /> : null}
                            borderRadius="xl"
                            _hover={{
                                transform: 'translateY(-2px)',
                            }}
                        >
                            {isLoading ? t.sending : isJoined ? t.requestSent : t.joinButton}
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
};

const AssociationList = () => {
    const [associations, setAssociations] = useState([]);
    const [joinedIds, setJoinedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

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
                return;
            }
            try {
                const response = await VolunteerService.getAllAssociations();
                if (response.status === 200) {
                    setAssociations(response.data.associationList || []);
                } else {
                    toast({
                        title: t.errorTitle,
                        description: t.loadError,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (err) {
                toast({
                    title: t.errorTitle,
                    description: t.networkError,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
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
        const matchesSearch =
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            (a.ville && a.ville.toLowerCase().includes(search.toLowerCase()));
        const matchesCity = cityFilter ? a.ville === cityFilter : true;
        return matchesSearch && matchesCity;
    });

    return (
        <Box
            minH="100vh"
            position="relative"
            overflow="hidden"
            css={{
                background: 'linear-gradient(-45deg, #553C9A, #B794F4, #805AD5, #6B46C1)',
                backgroundSize: '400% 400%',
            }}
            pt={{ base: 10, md: 20 }}
            pb={{ base: 10, md: 20 }}
        >
            {/* Decorative background elements */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                overflow="hidden"
                pointerEvents="none"
            >
                {[...Array(20)].map((_, i) => (
                    <Box
                        key={i}
                        position="absolute"
                        bg="whiteAlpha.200"
                        borderRadius="full"
                        css={{
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `${float} ${Math.random() * 5 + 3}s ease-in-out infinite`,
                            opacity: 0.1,
                        }}
                    />
                ))}
            </Box>

            <Container maxW="7xl" position="relative">
                <VStack spacing={6} mb={16} textAlign="center">
                    <Icon
                        as={FaBuilding}
                        boxSize={{ base: 12, md: 16 }}
                        color="white"
                        animation={`${float} 3s ease-in-out infinite`}
                    />
                    <Heading
                        as="h1"
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="bold"
                        color="white"
                        letterSpacing="tight"
                        textShadow="2px 2px 4px rgba(0,0,0,0.2)"
                    >
                        {t.pageTitle}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="whiteAlpha.900"
                        maxW="2xl"
                        textShadow="1px 1px 2px rgba(0,0,0,0.1)"
                    >
                        {t.pageSubtitle}
                    </Text>
                </VStack>

                {/* Search and Filter Bar */}
                <HStack mb={10} spacing={4} justify="center" flexWrap="wrap">
                    <Input
                        placeholder={t.pageTitle + '...'}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        bg="white"
                        maxW="300px"
                        borderRadius="xl"
                        boxShadow="md"
                    />
                    <Select
                        placeholder={t.ville}
                        value={cityFilter}
                        onChange={e => setCityFilter(e.target.value)}
                        bg="white"
                        maxW="200px"
                        borderRadius="xl"
                        boxShadow="md"
                    >
                        {[...new Set(associations.map(a => a.ville).filter(Boolean))].map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </Select>
                </HStack>

                {filteredAssociations.length > 0 ? (
                    <Box
                        sx={{
                            columnCount: { base: 1, md: 2, lg: 3 },
                            columnGap: "24px",
                            '& > div': {
                                breakInside: 'avoid',
                                marginBottom: '24px'
                            }
                        }}
                    >
                        {filteredAssociations.map((association, index) => (
                            <Box key={association.id}>
                                <AssociationCard
                                    association={association}
                                    onJoin={handleJoinAssociation}
                                    isJoined={joinedIds.includes(association.id)}
                                    isLoading={loadingId === association.id}
                                    index={index}
                                />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <VStack
                        spacing={6}
                        p={10}
                        bg="whiteAlpha.900"
                        borderRadius="3xl"
                        boxShadow="xl"
                        backdropFilter="blur(10px)"
                        animation={`${float} 3s ease-in-out infinite`}
                    >
                        <Icon
                            as={FaBuilding}
                            boxSize={12}
                            color="purple.400"
                            opacity={0.5}
                        />
                        <Heading size="lg" color="purple.600">
                            {t.noAssociations}
                        </Heading>
                        <Text color="gray.600">
                            {t.noAssociationsDesc}
                        </Text>
                    </VStack>
                )}
            </Container>
        </Box>
    );
};

export default AssociationList;