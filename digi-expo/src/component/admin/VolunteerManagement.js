import React, { useState, useEffect } from 'react';
import AdminService from '../../service/AdminService';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    VStack,
    HStack,
    Text,
    useColorModeValue,
    IconButton,
    Flex,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    SimpleGrid,
    Avatar,
    Stack,
    useToast,
    Badge,
    Icon,
    Checkbox,
    CheckboxGroup,
    Divider,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSave,
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaCalendar,
    FaSearch,
    FaUserClock
} from 'react-icons/fa';

const translations = {
    fr: {
        title: "Gestion des Bénévoles",
        subtitle: "Gérer et surveiller vos bénévoles",
        loading: "Chargement des bénévoles...",
        noVolunteers: "Aucun bénévole trouvé",
        addVolunteer: "Ajouter un Bénévole",
        cancel: "Annuler",
        closeForm: "Fermer le formulaire",
        saving: "Enregistrement...",
        save: "Enregistrer",
        update: "Mettre à jour",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce bénévole ?",
        deleteSuccess: "Bénévole supprimé avec succès",
        deleteFailed: "Échec de la suppression du bénévole",
        saveSuccess: "Bénévole enregistré avec succès !",
        saveFailed: "Échec de l'enregistrement du bénévole",
        passwordRequired: "Le mot de passe est requis pour créer un nouveau bénévole.",
        networkError: "Erreur réseau ou serveur lors de l'enregistrement du bénévole",
        searchPlaceholder: "Rechercher des bénévoles...",
        status: {
            active: "Actif",
            volunteer: "Bénévole"
        },
        form: {
            username: "Nom d'utilisateur",
            email: "Email",
            password: "Mot de passe",
            newPassword: "Nouveau mot de passe (optionnel)",
            phone: "Numéro de téléphone",
            availableDays: "Jours disponibles"
        },
        days: {
            MONDAY: "LUNDI",
            TUESDAY: "MARDI",
            WEDNESDAY: "MERCREDI",
            THURSDAY: "JEUDI",
            FRIDAY: "VENDREDI",
            SATURDAY: "SAMEDI",
            SUNDAY: "DIMANCHE"
        },
        table: {
            username: "Nom d'utilisateur",
            email: "Email",
            phone: "Téléphone",
            availableDays: "Jours disponibles",
            actions: "Actions"
        }
    },
    en: {
        title: "Volunteer Management",
        subtitle: "Manage and monitor your volunteers",
        loading: "Loading volunteers...",
        noVolunteers: "No volunteers found",
        addVolunteer: "Add Volunteer",
        cancel: "Cancel",
        closeForm: "Close Form",
        saving: "Saving...",
        save: "Save",
        update: "Update",
        deleteConfirm: "Are you sure you want to delete this volunteer?",
        deleteSuccess: "Volunteer deleted successfully",
        deleteFailed: "Failed to delete volunteer",
        saveSuccess: "Volunteer successfully saved!",
        saveFailed: "Failed to save volunteer",
        passwordRequired: "Password is required for creating a new volunteer.",
        networkError: "Network or server error while saving the volunteer",
        searchPlaceholder: "Search volunteers...",
        status: {
            active: "Active",
            volunteer: "Volunteer"
        },
        form: {
            username: "Username",
            email: "Email",
            password: "Password",
            newPassword: "New Password (optional)",
            phone: "Phone Number",
            availableDays: "Available Days"
        },
        days: {
            MONDAY: "MONDAY",
            TUESDAY: "TUESDAY",
            WEDNESDAY: "WEDNESDAY",
            THURSDAY: "THURSDAY",
            FRIDAY: "FRIDAY",
            SATURDAY: "SATURDAY",
            SUNDAY: "SUNDAY"
        },
        table: {
            username: "Username",
            email: "Email",
            phone: "Phone",
            availableDays: "Available Days",
            actions: "Actions"
        }
    }
};

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingVolunteer, setEditingVolunteer] = useState(null);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { language } = useLanguage();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = translations[language];

    // Theme colors
    const bgMain = useColorModeValue('gray.50', 'gray.900');
    const bgCard = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

    function initialFormState() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'BENEVOLE',
            phoneNumber: '',
            availableDays: [],
        };
    }

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setGlobalLoading(true);
        try {
            const result = await AdminService.getAllVolunteers();
            setVolunteers(result.data);
            if (result.data.length === 0) {
                toast({
                    title: t.noVolunteers,
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
        } catch (err) {
            toast({
                title: t.saveFailed,
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (selectedDays) => {
        setFormData(prev => ({
            ...prev,
            availableDays: selectedDays
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);

        try {
            const payload = { ...formData };

            if (editingVolunteer && !payload.password) {
                delete payload.password;
            }

            let response;
            if (editingVolunteer) {
                response = await AdminService.updateVolunteer(editingVolunteer.id, payload);
            } else {
                if (!payload.password) {
                    toast({
                        title: t.passwordRequired,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'
                    });
                    setButtonLoading(false);
                    return;
                }
                response = await AdminService.createVolunteer(payload);
            }

            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                toast({
                    title: t.saveSuccess,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
                await fetchVolunteers();
                onClose();
                setFormData(initialFormState());
                setEditingVolunteer(null);
            } else {
                throw new Error(response?.message || t.saveFailed);
            }
        } catch (err) {
            toast({
                title: t.networkError,
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleEdit = (volunteer) => {
        setFormData({
            username: volunteer.username,
            email: volunteer.email,
            password: '',
            role: volunteer.role || 'BENEVOLE',
            phoneNumber: volunteer.phoneNumber || '',
            availableDays: Array.isArray(volunteer.availableDays) ? volunteer.availableDays : []
        });
        setEditingVolunteer(volunteer);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;

        setGlobalLoading(true);
        try {
            const response = await AdminService.deleteVolunteer(id);
            if (response && response.statusCode === 200) {
                toast({
                    title: t.deleteSuccess,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
                await fetchVolunteers();
            } else {
                throw new Error(response?.message || t.deleteFailed);
            }
        } catch (err) {
            toast({
                title: t.networkError,
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState());
        setEditingVolunteer(null);
        onClose();
    };

    const filteredVolunteers = volunteers.filter(vol =>
        vol.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box bg={bgMain} minH="100vh" py={8}>
            <Container maxW="container.xl">
                {/* Header Section */}
                <Box mb={8}>
                    <Flex justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="purple.600">
                                {t.title}
                            </Heading>
                            <Text color={secondaryTextColor}>
                                {t.subtitle}
                            </Text>
                        </VStack>
                        <Button
                            leftIcon={<FaPlus />}
                            onClick={onOpen}
                            colorScheme="purple"
                            size="lg"
                            rounded="full"
                            px={8}
                        >
                            {t.addVolunteer}
                        </Button>
                    </Flex>

                    {/* Search Bar */}
                    <InputGroup maxW="400px">
                        <InputLeftElement pointerEvents="none">
                            <FaSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg={bgCard}
                            borderRadius="full"
                        />
                    </InputGroup>
                </Box>

                {/* Volunteers Grid */}
                {globalLoading ? (
                    <Flex justify="center" align="center" h="400px">
                        <VStack spacing={4}>
                            <Box className="loading-spinner" />
                            <Text color={secondaryTextColor}>{t.loading}</Text>
                        </VStack>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {filteredVolunteers.map((vol) => (
                            <Box
                                key={vol.id}
                                bg={bgCard}
                                p={6}
                                rounded="xl"
                                shadow="sm"
                                borderWidth="1px"
                                borderColor={borderColor}
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Top Action Buttons */}
                                <Flex justify="flex-end" position="absolute" top={2} right={2} zIndex={2}>
                                    <IconButton
                                        icon={<FaEdit />}
                                        variant="ghost"
                                        colorScheme="purple"
                                        onClick={() => handleEdit(vol)}
                                        aria-label="Edit"
                                        size="sm"
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<FaTrash />}
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDelete(vol.id)}
                                        aria-label="Delete"
                                        size="sm"
                                    />
                                </Flex>

                                {/* Main Content */}
                                <VStack spacing={6} align="stretch">
                                    {/* Header with Avatar and Name */}
                                    <Flex align="center" mb={4}>
                                        <Avatar
                                            size="lg"
                                            name={vol.username}
                                            mr={4}
                                        />
                                        <Box>
                                            <Heading size="md" color={textColor} mb={1}>
                                                {vol.username}
                                            </Heading>
                                            <Text color="purple.500" fontSize="sm" fontWeight="medium">
                                                {t.status.volunteer}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    {/* Information Grid */}
                                    <SimpleGrid columns={1} spacing={4}>
                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.email}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaEnvelope} mr={2} color="blue.500" />
                                                <Text fontSize="sm" isTruncated>
                                                    {vol.email}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.phone}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaPhone} mr={2} color="green.500" />
                                                <Text fontSize="sm">
                                                    {vol.phoneNumber}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.availableDays}
                                            </Text>
                                            <Flex wrap="wrap" gap={2}>
                                                {vol.availableDays?.map(day => (
                                                    <Badge
                                                        key={day}
                                                        colorScheme="purple"
                                                        variant="subtle"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="full"
                                                        fontSize="xs"
                                                    >
                                                        {t.days[day]}
                                                    </Badge>
                                                ))}
                                            </Flex>
                                        </Box>
                                    </SimpleGrid>

                                    {/* Status Badge */}
                                    <Flex mt={4} gap={2}>
                                        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                                            {t.status.active}
                                        </Badge>
                                    </Flex>
                                </VStack>

                                {/* Decorative Element */}
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    w="100%"
                                    h="4px"
                                    bgGradient="linear(to-r, purple.400, pink.400)"
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )}

                {/* Form Drawer */}
                <Drawer isOpen={isOpen} placement="right" size="md" onClose={handleCancel}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth="1px" bg="purple.50">
                            <Heading size="md" color="purple.600">
                                {editingVolunteer ? t.update : t.addVolunteer}
                            </Heading>
                        </DrawerHeader>

                        <DrawerBody>
                            <VStack spacing={6} as="form" onSubmit={handleSubmit} py={4}>
                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaUser />
                                            <Text>{t.form.username}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaEnvelope />
                                            <Text>{t.form.email}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaLock />
                                            <Text>
                                                {editingVolunteer ? t.form.newPassword : t.form.password}
                                            </Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!editingVolunteer}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaPhone />
                                            <Text>{t.form.phone}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaCalendar />
                                            <Text>{t.form.availableDays}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <CheckboxGroup
                                        colorScheme="purple"
                                        value={formData.availableDays}
                                        onChange={handleCheckboxChange}
                                    >
                                        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                                            {Object.entries(t.days).map(([day, label]) => (
                                                <Checkbox key={day} value={day}>
                                                    {label}
                                                </Checkbox>
                                            ))}
                                        </SimpleGrid>
                                    </CheckboxGroup>
                                </FormControl>

                                <HStack spacing={4} w="100%" pt={4}>
                                    <Button
                                        colorScheme="purple"
                                        leftIcon={buttonLoading ? <Box className="loading-spinner" /> : <FaSave />}
                                        onClick={handleSubmit}
                                        isLoading={buttonLoading}
                                        flex={1}
                                    >
                                        {editingVolunteer ? t.update : t.save}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleCancel}
                                        leftIcon={<FaTimes />}
                                        flex={1}
                                    >
                                        {t.cancel}
                                    </Button>
                                </HStack>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Container>

            <style jsx global>{`
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #805AD5;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </Box>
    );
};

export default VolunteerManagement;
