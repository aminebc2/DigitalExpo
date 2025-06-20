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
    FaSearch,
    FaAddressCard
} from 'react-icons/fa';

const colors = {
    primary: {
        purple: '#8B5CF6',
        lightPurple: '#A78BFA',
        darkPurple: '#7C3AED',
        white: '#FFFFFF'
    },
    purple: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#582C83'
    },
    neutrals: {
        lightGray: '#F8FAFC',
        mediumGray: '#94A3B8',
        darkGray: '#374151',
        black: '#000000'
    },
    accents: {
        teal: '#14B8A6',
        blue: '#3B82F6',
        darkTeal: '#0F766E',
        green: '#10B981',
        orange: '#F97316',
        gold: '#F59E0B',
        yellow: '#EAB308',
        red: '#9e0a0a'
    }
};

const translations = {
    fr: {
        title: "Gestion des Admins",
        subtitle: "Gérer et surveiller vos admins",
        loading: "Chargement des admins...",
        noAdmins: "Aucun admin trouvé",
        addAdmin: "Ajouter un Admin",
        cancel: "Annuler",
        closeForm: "Fermer le formulaire",
        saving: "Enregistrement...",
        save: "Enregistrer",
        update: "Mettre à jour",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce admin ?",
        deleteSuccess: "Admin supprimé avec succès",
        deleteFailed: "Échec de la suppression du admin",
        saveSuccess: "Admin enregistré avec succès !",
        saveFailed: "Échec de l'enregistrement du admin",
        passwordRequired: "Le mot de passe est requis pour créer un nouveau admin.",
        networkError: "Erreur réseau ou serveur lors de l'enregistrement du admin",
        searchPlaceholder: "Rechercher des admins...",
        updateLogout: "Profil mis à jour avec succès. Vous allez être déconnecté...",
        redirecting: "Redirection vers la page de connexion...",
        status: {
            active: "Actif",
            admin: "Bénévole"
        },
        form: {
            username: "Nom d'utilisateur",
            fullName:"Nom complet",
            email: "Email",
            password: "Mot de passe",
            newPassword: "Nouveau mot de passe (optionnel)",
            phoneNumber: "Numéro de téléphone"
        },
        table: {
            username: "Nom d'utilisateur",
            fullName: "Nom complet",
            email: "Email",
            phoneNumber: "Numéro de téléphone",
            actions: "Actions"
        }
    },
    en: {
        title: "Admin Management",
        subtitle: "Manage and monitor your admins",
        loading: "Loading admins...",
        noAdmins: "No admins found",
        addAdmin: "Add Admin",
        cancel: "Cancel",
        closeForm: "Close Form",
        saving: "Saving...",
        save: "Save",
        update: "Update",
        deleteConfirm: "Are you sure you want to delete this admin?",
        deleteSuccess: "Admin deleted successfully",
        deleteFailed: "Failed to delete admin",
        saveSuccess: "Admin successfully saved!",
        saveFailed: "Failed to save admin",
        passwordRequired: "Password is required for creating a new admin.",
        networkError: "Network or server error while saving the admin",
        searchPlaceholder: "Search admins...",
        updateLogout: "Profile updated successfully. You will be logged out...",
        redirecting: "Redirecting to login page...",
        status: {
            active: "Active",
            admin: "Admin"
        },
        form: {
            username: "Username",
            fullName: "Full Name",
            email: "Email",
            password: "Password",
            newPassword: "New Password (optional)",
            phoneNumber: "Phone Number"
        },
        table: {
            username: "Username",
            fullName: "Full Name",
            email: "Email",
            phoneNumber: "Phone Number",
            actions: "Actions"
        }
    }
};

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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
            fullName: '',
            email: '',
            password: '',
            role: 'ADMIN',
            phoneNumber: ''
        };
    }

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setGlobalLoading(true);
        try {
            const result = await AdminService.getAllAdmins();

            if (result && result.data) {
                setAdmins(result.data);
                if (result.data.length === 0) {
                    toast({
                        title: t.noAdmins,
                        status: 'info',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'
                    });
                }
            } else {
                console.error('Invalid response format:', result);
            }
        } catch (err) {
            console.error('Error fetching admins:', err);
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
        setFormData(prev => ({
            ...prev,
            [name]: value || '' // Ensure value is never null
        }));
    };

    const handleCheckboxChange = (selectedDays) => {
        setFormData(prev => ({
            ...prev
        }));
    };

    // Function to handle logout
    const handleLogout = () => {
        console.log('handleLogout called');
        setIsLoggingOut(true);

        // Show logout message
        toast({
            title: t.updateLogout,
            status: 'success',
            duration: 3000,
            isClosable: false,
            position: 'top-right'
        });

        // Clear all stored data - be more thorough
        const keysToRemove = ['username', 'adminUsername', 'userId', 'adminId', 'id', 'email', 'adminEmail', 'token', 'authToken', 'accessToken', 'refreshToken', 'role', 'userRole'];
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        // Also clear everything just to be sure
        localStorage.clear();
        sessionStorage.clear();

        // Force redirect immediately - don't wait
        setTimeout(() => {
            console.log('Redirecting to login...');
            // Try multiple redirect methods
            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
                // Fallback
                window.location.href = '/login';
            }
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);

        try {
            const payload = { ...formData };

            // Get current user information from localStorage - check all possible keys
            const currentUsername = localStorage.getItem('username') || localStorage.getItem('adminUsername');
            const currentUserId = localStorage.getItem('userId') || localStorage.getItem('adminId') || localStorage.getItem('id');
            const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('adminEmail');

            let response;
            if (editingAdmin) {
                response = await AdminService.updateAdmin(editingAdmin.id, payload);

                if (response.statusCode === 200) {
                    // More comprehensive check for current user - stricter comparison
                    const isCurrentUser = (
                        (currentUsername && editingAdmin.username?.toLowerCase() === currentUsername.toLowerCase()) ||
                        (currentUserId && (editingAdmin.id === parseInt(currentUserId) || editingAdmin.id === currentUserId)) ||
                        (currentUserEmail && editingAdmin.email?.toLowerCase() === currentUserEmail.toLowerCase())
                    );

                    if (isCurrentUser) {
                        // Immediately start logout process without waiting for state updates
                        setIsLoggingOut(true);

                        // Show logout message first
                        toast({
                            title: t.updateLogout,
                            status: 'success',
                            duration: 2000,
                            isClosable: false,
                            position: 'top-right'
                        });

                        // Clear form and close drawer immediately
                        onClose();
                        setFormData(initialFormState());
                        setEditingAdmin(null);
                        setButtonLoading(false);

                        // Clear all stored data
                        const keysToRemove = [
                            'username', 'adminUsername', 'userId', 'adminId', 'id',
                            'email', 'adminEmail', 'token', 'authToken', 'accessToken',
                            'refreshToken', 'role', 'userRole', 'permissions'
                        ];

                        keysToRemove.forEach(key => {
                            localStorage.removeItem(key);
                            sessionStorage.removeItem(key);
                        });

                        // Clear everything
                        localStorage.clear();
                        sessionStorage.clear();

                        // Force redirect after a short delay to ensure toast is visible
                        setTimeout(() => {
                            if (window.location.pathname !== '/login') {
                                window.location.href = '/login';
                                // Fallback
                                setTimeout(() => {
                                    window.location.replace('/login');
                                }, 100);
                            }
                        }, 1500);

                        return;
                    }

                    // If it's not the current user, update the local state
                    const updatedAdmin = response.data;
                    setAdmins(prevAdmins =>
                        prevAdmins.map(admin =>
                            admin.id === editingAdmin.id ? updatedAdmin : admin
                        )
                    );

                    toast({
                        title: "Admin updated successfully!",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'
                    });

                    onClose();
                    setFormData(initialFormState());
                    setEditingAdmin(null);
                }
            } else {
                // Handle create new admin...
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
                response = await AdminService.createAdmin(payload);

                if (response.statusCode === 201) {
                    // Add the new admin to the state
                    const newAdmin = response.data;
                    setAdmins(prevAdmins => [...prevAdmins, newAdmin]);

                    toast({
                        title: t.saveSuccess,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'
                    });

                    onClose();
                    setFormData(initialFormState());
                }
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
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

    const handleEdit = (admin) => {
        setFormData({
            username: admin.username || '',
            fullName: admin.fullName || '',
            email: admin.email || '',
            password: '',  // Always empty for editing
            role: admin.role || 'ADMIN',
            phoneNumber: admin.phoneNumber || ''
        });
        setEditingAdmin(admin);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;

        setGlobalLoading(true);
        try {
            const response = await AdminService.deleteAdmin(id);
            if (response && response.statusCode === 200) {
                toast({
                    title: t.deleteSuccess,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
                await fetchAdmins();
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
        setEditingAdmin(null);
        onClose();
    };

    const filteredAdmins = admins.filter(ad => {
        const searchQueryLower = searchQuery.toLowerCase();
        return (
            (ad.username?.toLowerCase() || '').includes(searchQueryLower) ||
            (ad.fullName?.toLowerCase() || '').includes(searchQueryLower) ||
            (ad.email?.toLowerCase() || '').includes(searchQueryLower) ||
            (ad.phoneNumber?.toLowerCase() || '').includes(searchQueryLower)
        );
    });

    // Show loading overlay when logging out
    if (isLoggingOut) {
        return (
            <Box
                bg={bgMain}
                minH="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgGradient={`linear(to-br, ${colors.purple[50]}, ${colors.primary.white})`}
            >
                <VStack spacing={4}>
                    <Box className="loading-spinner" />
                    <Text color={textColor} fontSize="lg">{t.updateLogout}</Text>
                    <Text color={secondaryTextColor}>{t.redirecting}</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box bg={bgMain} minH="100vh" py={8} bgGradient={`linear(to-br, ${colors.purple[50]}, ${colors.primary.white})`}>
            <Container maxW="container.xl">
                {/* Header Section */}
                <Box mb={8}>
                    <Flex justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="#582C83">
                                {t.title}
                            </Heading>
                            <Text color="black">
                                {t.subtitle}
                            </Text>
                        </VStack>
                        <HStack spacing={4}>
                            <Button
                                leftIcon={<FaPlus />}
                                onClick={onOpen}
                                colorScheme="#582C83"
                                size="lg"
                                rounded="full"
                                px={8}
                            >
                                {t.addAdmin}
                            </Button>
                        </HStack>
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

                {/* Admins Grid */}
                {globalLoading ? (
                    <Flex justify="center" align="center" h="400px">
                        <VStack spacing={4}>
                            <Box className="loading-spinner" />
                            <Text color={secondaryTextColor}>{t.loading}</Text>
                        </VStack>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {filteredAdmins.map((ad) => (
                            <Box
                                key={ad.id}
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
                                        onClick={() => handleEdit(ad)}
                                        aria-label="Edit"
                                        size="sm"
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<FaTrash />}
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDelete(ad.id)}
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
                                            name={ad.username}
                                            bg="#582C83"
                                            mr={4}
                                        />
                                        <Box>
                                            <Heading size="md" color={textColor} mb={1}>
                                                {ad.username}
                                            </Heading>
                                            <Text color="purple.500" fontSize="sm" fontWeight="medium">
                                                {t.status.admin}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    {/* Information Grid */}
                                    <SimpleGrid columns={1} spacing={4}>
                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.fullName}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaAddressCard} mr={2} color="purple.500" />
                                                <Text fontSize="sm" isTruncated>
                                                    {ad.fullName}
                                                </Text>
                                            </Flex>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.email}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaEnvelope} mr={2} color="blue.500" />
                                                <Text fontSize="sm" isTruncated>
                                                    {ad.email}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.form.phoneNumber}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaPhone} mr={2} color="green.500" />
                                                <Text fontSize="sm">
                                                    {ad.phoneNumber}
                                                </Text>
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
                            <Heading size="md" color="#582C83">
                                {editingAdmin ? t.update : t.addAdmin}
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
                                        value={formData.username || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaAddressCard />
                                            <Text>{t.form.fullName}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="fullName"
                                        value={formData.fullName || ''}
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
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaLock />
                                            <Text>
                                                {editingAdmin ? t.form.newPassword : t.form.password}
                                            </Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleInputChange}
                                        required={!editingAdmin}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaPhone />
                                            <Text>{t.form.phoneNumber}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <HStack spacing={4} w="100%" pt={4}>
                                    <Button
                                        colorScheme="#582C83"
                                        leftIcon={buttonLoading ? <Box className="loading-spinner" /> : <FaSave />}
                                        onClick={handleSubmit}
                                        isLoading={buttonLoading}
                                        flex={1}
                                    >
                                        {editingAdmin ? t.update : t.save}
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

        </Box>
    );
};

export default AdminManagement;