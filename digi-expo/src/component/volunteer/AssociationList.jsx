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
    Spinner,
    useToast,
    Icon,
    useColorModeValue,
    VStack,
    Badge,
    Flex,
    HStack,
    Tooltip,
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
        noEmail: "Aucun courriel disponible",
        manager: "Responsable",
        noManager: "Responsable non spécifié",
        phone: "Téléphone",
        noPhone: "Numéro non disponible",
        contactInfo: "Coordonnées",
        ville: "Ville",
        noVille: "Ville non spécifiée",
        loading: "Chargement...",
        errorOccurred: "Une erreur s'est produite",
        tryAgain: "Veuillez réessayer plus tard",
        imageAlt: "Logo de l'association",
        contactSection: "Informations de Contact",
        joinButton: "Rejoindre l'Association",
        successTitle: "Succès !",
        errorTitle: "Erreur",
        welcomeMessage: "Bienvenue dans notre communauté d'associations",
        requestAlreadyExists: "Une demande existe déjà pour ce bénévole et cette association",
        requestExists: "Demande déjà existante",
        alreadyRequested: "Vous avez déjà envoyé une demande à cette association"
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
        noEmail: "No email available",
        manager: "Manager",
        noManager: "Manager not specified",
        phone: "Phone",
        noPhone: "Number not available",
        contactInfo: "Contact Details",
        ville: "City",
        noVille: "City not specified",
        loading: "Loading...",
        errorOccurred: "An error occurred",
        tryAgain: "Please try again later",
        imageAlt: "Association logo",
        contactSection: "Contact Information",
        joinButton: "Join Association",
        successTitle: "Success!",
        errorTitle: "Error",
        welcomeMessage: "Welcome to our association community",
        requestAlreadyExists: "Request already exists for this volunteer and association",
        requestExists: "Request Exists",
        alreadyRequested: "You have already sent a request to this association"
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

    const cardBg = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.800', 'white');
    const buttonScheme = isJoined ? 'green' : 'purple';
    const floatAnimation = `${float} 3s ease-in-out infinite`;
    const pulseAnimation = `${pulse} 2s ease-in-out infinite`;
    const imageBg = useColorModeValue('gray.50', 'gray.700');

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
                boxShadow="lg"
                _hover={{
                    transform: 'scale(1.02)',
                    boxShadow: '2xl',
                }}
            >
                {/* Image Container */}
                <Box
                    position="relative"
                    height="300px"
                    bg={imageBg}
                >
                    {association.imageFileName ? (
                        <Image
                            src={`http://localhost:8080/images/${association.imageFileName}`}
                            alt={`${t.imageAlt} - ${association.name}`}
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

                {/* Content Container */}
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
                description: res.message || t.requestSuccess,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setJoinedIds((prev) => [...prev, associationId]);
        } catch (err) {
            const isRequestExistsError = err.response?.data?.message?.toLowerCase().includes('already exists');
            toast({
                title: t.errorTitle,
                description: isRequestExistsError ? t.requestAlreadyExists : (err.response?.data?.message || t.requestFailed),
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
                        as={FaBuilding}
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

                {associations.length > 0 ? (
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
                        {associations.map((association, index) => (
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
                        bg={emptyStateBg}
                        borderRadius="3xl"
                        boxShadow="xl"
                        animation={`${float} 3s ease-in-out infinite`}
                    >
                        <Icon
                            as={FaBuilding}
                            boxSize={12}
                            color="purple.400"
                            opacity={0.5}
                        />
                        <Heading size="lg" color={headingColor}>
                            {t.noAssociations}
                        </Heading>
                        <Text color={subTextColor}>
                            {t.noAssociationsDesc}
                        </Text>
                    </VStack>
                )}
            </Container>
        </Box>
    );
};

export default AssociationList;
