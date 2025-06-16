import React, { useEffect, useState } from 'react';
import AdminService from "../../service/AdminService";
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Select,
    VStack,
    HStack,
    useToast,
    Text,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    useColorModeValue,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Tag,
    TagLeftIcon,
    TagLabel,
    Tooltip
} from '@chakra-ui/react';
import {
    FaUserPlus,
    FaUsers,
    FaTimes,
    FaCheck,
    FaExclamationCircle,
    FaUserFriends
} from 'react-icons/fa';

const translations = {
    fr: {
        loading: "Chargement...",
        noAssociation: "Aucun ID d'association fourni",
        noVolunteers: "Aucun bénévole trouvé pour cette association",
        loadError: "Échec du chargement des bénévoles",
        selectVolunteer: "Sélectionner un Bénévole",
        chooseVolunteer: "Choisir un bénévole",
        unknownVolunteer: "Bénévole inconnu",
        pleaseSelect: "Veuillez sélectionner un bénévole",
        assignError: "Échec de l'attribution du bénévole. Veuillez réessayer.",
        cancel: "Annuler",
        assign: "Attribuer",
        assigning: "Attribution en cours...",
        totalVolunteers: "Bénévoles",
        successTitle: "Succès",
        errorTitle: "Erreur",
        assignSuccess: "Bénévole attribué avec succès"
    },
    en: {
        loading: "Loading...",
        noAssociation: "No association ID provided",
        noVolunteers: "No volunteers found for this association",
        loadError: "Failed to load volunteers",
        selectVolunteer: "Select Volunteer",
        chooseVolunteer: "Choose a volunteer",
        unknownVolunteer: "Unknown volunteer",
        pleaseSelect: "Please select a volunteer",
        assignError: "Failed to assign volunteer. Please try again.",
        cancel: "Cancel",
        assign: "Assign",
        assigning: "Assigning...",
        totalVolunteers: "Volunteers",
        successTitle: "Success",
        errorTitle: "Error",
        assignSuccess: "Volunteer assigned successfully"
    }
};

const AssignVolunteerToSession = ({ sessionId, associationId, onClose }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    // Theme colors
    const bgCard = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('dxc.purple.100', 'dxc.purple.800');
    const headerBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const iconColor = 'dxc.purple.500';
    const selectBg = useColorModeValue('white', 'gray.700');
    const footerBg = useColorModeValue('gray.50', 'gray.900');
    const mutedIconColor = 'dxc.purple.400';

    useEffect(() => {
        if (!associationId) {
            setError(t.noAssociation);
            setLoading(false);
            return;
        }

        const fetchVolunteers = async () => {
            try {
                const response = await AdminService.getAssoVolunteers(associationId);
                console.log('API Response:', response);

                const volunteerArray = Array.isArray(response) ? response :
                    response?.volunteerList && Array.isArray(response.volunteerList) ? response.volunteerList :
                        [];

                const processedVolunteers = Array.from(new Map(volunteerArray.map(v => [v.id, v])).values());
                if (processedVolunteers.length > 0) {
                    setVolunteers(processedVolunteers);
                } else {
                    setError(t.noVolunteers);
                }
            } catch (error) {
                setError(error.message || t.loadError);
                toast({
                    title: t.errorTitle,
                    description: error.message || t.loadError,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
            setLoading(false);
        };

        fetchVolunteers();
    }, [associationId, t.noAssociation, t.noVolunteers, t.loadError, toast]);

    const handleAssign = async () => {
        if (!selectedVolunteerId) {
            toast({
                title: t.errorTitle,
                description: t.pleaseSelect,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }

        setSubmitting(true);
        try {
            await AdminService.assignVolunteerToSession(sessionId, selectedVolunteerId);
            toast({
                title: t.successTitle,
                description: t.assignSuccess,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
            onClose();
        } catch (err) {
            toast({
                title: t.errorTitle,
                description: t.assignError,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
            console.error('Error assigning volunteer:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const renderLoadingState = () => (
        <Card bg={bgCard} rounded="2xl" shadow="xl" borderWidth="1px" borderColor={borderColor} overflow="hidden">
            <CardBody>
                <VStack spacing={6} py={12}>
                    <Spinner
                        size="xl"
                        color="dxc.purple.500"
                        thickness="4px"
                        speed="0.8s"
                        emptyColor="gray.200"
                    />
                    <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="medium"
                    >
                        {t.loading}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );

    if (loading) {
        return renderLoadingState();
    }

    return (
        <Card
            bg={bgCard}
            rounded="2xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
        >
            <CardHeader bg={headerBg} py={6} px={6} borderBottom="1px" borderColor={borderColor}>
                <HStack spacing={4} justify="space-between">
                    <HStack spacing={3}>
                        <Icon as={FaUserPlus} boxSize={7} color={iconColor} />
                        <Heading size="lg" color={textColor} fontWeight="bold">
                            {t.selectVolunteer}
                        </Heading>
                    </HStack>
                    <Tag size="lg" variant="subtle" colorScheme="purple" borderRadius="full" px={4} py={2}>
                        <TagLeftIcon as={FaUserFriends} color={iconColor} />
                        <TagLabel>{volunteers.length} {t.totalVolunteers}</TagLabel>
                    </Tag>
                </HStack>
            </CardHeader>

            <CardBody pt={6} px={6}>
                {error && (
                    <Alert
                        status="error"
                        mb={6}
                        borderRadius="xl"
                        variant="left-accent"
                        borderLeftWidth="4px"
                    >
                        <AlertIcon as={FaExclamationCircle} color="red.500" />
                        <Text color={textColor} fontWeight="medium">{error}</Text>
                    </Alert>
                )}

                <VStack spacing={6} align="stretch">
                    <FormControl>
                        <FormLabel>
                            <HStack spacing={2}>
                                <Icon as={FaUsers} color={iconColor} />
                                <Text color={textColor} fontWeight="medium">
                                    {t.selectVolunteer}
                                </Text>
                            </HStack>
                        </FormLabel>
                        <Tooltip
                            label={volunteers.length === 0 ? t.noVolunteers : t.chooseVolunteer}
                            hasArrow
                            isDisabled={volunteers.length > 0 && !submitting}
                        >
                            <Select
                                placeholder={t.chooseVolunteer}
                                value={selectedVolunteerId}
                                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                                isDisabled={volunteers.length === 0 || submitting}
                                size="lg"
                                bg={selectBg}
                                borderRadius="xl"
                                borderColor={borderColor}
                                _hover={{
                                    borderColor: 'dxc.purple.300'
                                }}
                                _focus={{
                                    borderColor: 'dxc.purple.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-dxc-purple-500)'
                                }}
                            >
                                {volunteers.map((volunteer, index) => (
                                    <option
                                        key={`volunteer-${volunteer.id}-${index}`}
                                        value={volunteer.id || ''}
                                    >
                                        {volunteer.fullName || t.unknownVolunteer}
                                    </option>
                                ))}
                            </Select>
                        </Tooltip>
                    </FormControl>
                </VStack>
            </CardBody>

            <Divider borderColor={borderColor} />

            <CardFooter bg={footerBg} py={4} px={6}>
                <HStack spacing={4} justify="flex-end" width="100%">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        leftIcon={<Icon as={FaTimes} color={iconColor} />}
                        isDisabled={submitting}
                        size="lg"
                        borderRadius="xl"
                        borderColor="dxc.purple.500"
                        color="dxc.purple.500"
                        _hover={{
                            bg: 'dxc.purple.50'
                        }}
                        fontWeight="medium"
                    >
                        {t.cancel}
                    </Button>
                    <Button
                        bg="green.500"
                        color="white"
                        onClick={handleAssign}
                        isLoading={submitting}
                        loadingText={t.assigning}
                        leftIcon={<Icon as={FaCheck} color="white" />}
                        isDisabled={!selectedVolunteerId || submitting}
                        size="lg"
                        borderRadius="xl"
                        _hover={{
                            bg: 'green.600'
                        }}
                        _active={{
                            bg: 'green.700'
                        }}
                        fontWeight="medium"
                    >
                        {t.assign}
                    </Button>
                </HStack>
            </CardFooter>
        </Card>
    );
};

export default AssignVolunteerToSession;
