import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from '../../context/LanguageContext';
import { keyframes } from '@emotion/react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    useColorModeValue,
    Alert,
    AlertIcon,
    Badge,
    Icon,
    Flex,
    HStack,
    useToast,
} from '@chakra-ui/react';
import {
    FaHandshake,
    FaCheckCircle,
    FaBuilding,
    FaInfoCircle,
    FaArrowRight
} from 'react-icons/fa';

// Animations
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

// Enhanced translations
const translations = {
    fr: {
        pageTitle: "Associations Disponibles",
        pageSubtitle: "Découvrez et rejoignez des associations qui correspondent à vos intérêts",
        loadError: "Échec du chargement des associations.",
        requestFailed: "Échec de l'envoi de la demande.",
        noDescription: "Aucune description disponible.",
        requestSent: "Demande envoyée",
        alreadyJoined: "Déjà membre",
        loadingMemberships: "Chargement des adhésions...",
        joinAssociation: "Rejoindre l'association",
        available: "Disponible"
    },
    en: {
        pageTitle: "Available Associations",
        pageSubtitle: "Discover and join associations that match your interests",
        loadError: "Failed to load associations.",
        requestFailed: "Failed to send request.",
        noDescription: "No description available.",
        requestSent: "Request Sent",
        alreadyJoined: "Already joined",
        loadingMemberships: "Loading memberships...",
        joinAssociation: "Join Association",
        available: "Available"
    }
};

const AssociationCard = ({ association, onJoin, isJoined, hasRequested, index }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const cardBg = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.800', 'white');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');
    const buttonScheme = isJoined ? 'green' : hasRequested ? 'purple' : 'blue';
    const floatAnimation = `${float} 3s ease-in-out infinite`;

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
                p={6}
            >
                <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Heading
                            size="md"
                            color={headingColor}
                            noOfLines={2}
                        >
                            {association.name}
                        </Heading>
                        <Badge
                            colorScheme={isJoined ? 'green' : 'purple'}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                        >
                            {isJoined ? t.alreadyJoined : t.available}
                        </Badge>
                    </Flex>

                    <Text
                        color={descriptionColor}
                        fontSize="md"
                        noOfLines={3}
                    >
                        {association.description || t.noDescription}
                    </Text>

                    <Button
                        colorScheme={buttonScheme}
                        size="lg"
                        onClick={() => !isJoined && !hasRequested && onJoin(association.id)}
                        isDisabled={isJoined || hasRequested}
                        leftIcon={isJoined ? <FaCheckCircle /> : hasRequested ? <FaHandshake /> : <FaArrowRight />}
                        borderRadius="xl"
                        _hover={{
                            transform: 'translateY(-2px)',
                        }}
                    >
                        {isJoined ? t.alreadyJoined : hasRequested ? t.requestSent : t.joinAssociation}
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

const JoinAssociation = ({ volunteerId, token }) => {
    const [associations, setAssociations] = useState([]);
    const [joinedIds, setJoinedIds] = useState([]);
    const [membershipIds, setMembershipIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    // Theme colors
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headingColor = useColorModeValue('purple.600', 'purple.300');
    const subTextColor = useColorModeValue('gray.600', 'gray.400');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [associationsRes, membershipsRes] = await Promise.all([
                    axios.get("http://localhost:8080/volunteer/all-associations"),
                    axios.get(
                        `http://localhost:8080/volunteer/${volunteerId}/memberships`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                ]);

                setAssociations(associationsRes.data);
                const memberIds = membershipsRes.data.map(membership => membership.associationId);
                setMembershipIds(memberIds);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: t.loadError,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId, token, toast, t.loadError]);

    const handleJoin = async (associationId) => {
        try {
            const dto = {
                volunteer: { id: volunteerId },
                association: { id: associationId }
            };

            await axios.post(
                "http://localhost:8080/volunteer/create-request",
                dto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setJoinedIds([...joinedIds, associationId]);
            toast({
                title: t.requestSent,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            const errMsg = error.response?.data?.message || t.requestFailed;
            toast({
                title: errMsg,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
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

                {loading ? (
                    <VStack spacing={4}>
                        <Icon
                            as={FaBuilding}
                            boxSize={8}
                            color="purple.400"
                            animation={`${pulse} 1s ease-in-out infinite`}
                        />
                        <Text color={subTextColor}>{t.loadingMemberships}</Text>
                    </VStack>
                ) : (
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
                                    onJoin={handleJoin}
                                    isJoined={membershipIds.includes(association.id)}
                                    hasRequested={joinedIds.includes(association.id)}
                                    index={index}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default JoinAssociation;


