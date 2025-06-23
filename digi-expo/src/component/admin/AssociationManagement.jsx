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
    FaBuilding,
    FaCity,
    FaUserTie,
    FaPhone,
    FaImage,
    FaSearch,
} from 'react-icons/fa';
import {MdDescription} from "react-icons/md";

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

// Keep your existing translations object
const translations = {
    fr: {
        title: "Gestion des Associations",
        subtitle: "Gérer et surveiller vos associations",
        searchPlaceholder: "Rechercher des associations...",
        addAssociation: "Ajouter une Association",
        editAssociation: "Modifier l'Association",
        cancel: "Annuler",
        loading: "Chargement des associations...",
        networkError: "Erreur réseau ou serveur lors du chargement des associations",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette association ?",
        deleteError: "Erreur réseau ou serveur lors de la suppression de l'association",
        deleteSuccess: "Association supprimée avec succès",
        passwordRequired: "Le mot de passe est requis pour créer une nouvelle association.",
        saveSuccess: "Association enregistrée avec succès !",
        saveFailed: "Échec de l'enregistrement de l'association",
        saveError: "Erreur réseau ou serveur lors de l'enregistrement de l'association",
        saving: "Enregistrement...",
        noAssociations: "Aucune association trouvée",
        closeForm: "Fermer le formulaire",
        status: {
            active: "Actif",
            association: "Association"
        },
        form: {
            username: "Nom d'utilisateur",
            email: "Email",
            password: "Mot de passe",
            newPassword: "Nouveau mot de passe (optionnel)",
            name: "Nom de l'Association",
            city: "Ville",
            responsible: "Responsable",
            phone: "Numéro de téléphone",
            description: "Description",
            uploadImage: "Télécharger une image",
            update: "Mettre à jour",
            save: "Enregistrer"
        },
        table: {
            username: "Nom d'utilisateur",
            email: "Email",
            name: "Nom",
            city: "Ville",
            responsible: "Responsable",
            phone: "Téléphone",
            image: "Image",
            actions: "Actions"
        }
    },
    en: {
        title: "Association Management",
        subtitle: "Manage and monitor your associations",
        searchPlaceholder: "Search associations...",
        addAssociation: "Add Association",
        editAssociation: "Edit Association",
        cancel: "Cancel",
        loading: "Loading associations...",
        networkError: "Network or server error while loading associations",
        deleteConfirm: "Are you sure you want to delete this association?",
        deleteError: "Network or server error while deleting the association",
        deleteSuccess: "Association successfully deleted",
        passwordRequired: "Password is required for creating a new association.",
        saveSuccess: "Association successfully saved!",
        saveFailed: "Failed to save association",
        saveError: "Network or server error while saving the association",
        saving: "Saving...",
        noAssociations: "No associations found",
        closeForm: "Close form",
        status: {
            active: "Active",
            association: "Association"
        },
        form: {
            username: "Username",
            email: "Email",
            password: "Password",
            newPassword: "New Password (optional)",
            name: "Association Name",
            city: "City",
            responsible: "Responsible Person",
            phone: "Phone Number",
            description: "Description",
            uploadImage: "Upload Image",
            update: "Update",
            save: "Save"
        },
        table: {
            username: "Username",
            email: "Email",
            name: "Name",
            city: "City",
            responsible: "Responsible",
            phone: "Phone",
            image: "Image",
            actions: "Actions"
        }
    }
};

const AssociationManagement = () => {
    const [associations, setAssociations] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [editingAssociation, setEditingAssociation] = useState(null);
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
            role: 'ASSOCIATION',
            name: '',
            ville: '',
            responsableName: '',
            responsablePhone: '',
            description: '',
            imageFileName: null
        };
    }

    useEffect(() => {
        fetchAssociations();
    }, []);

    const fetchAssociations = async () => {
        setGlobalLoading(true);
        try {
            const response = await AdminService.getAllAssociations();
            setAssociations(response.data || []);
        } catch (err) {
            toast({
                title: t.networkError,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);

        try {
            const formDataToSend = new FormData();
            const { imageFile, password, ...otherData } = formData;

            if (!editingAssociation && !password) {
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

            const dataToSend = {
                ...otherData,
                password: password || undefined,
            };

            formDataToSend.append('data', JSON.stringify(dataToSend));

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response;
            if (editingAssociation) {
                response = await AdminService.updateAssociation(editingAssociation.id, formDataToSend);
            } else {
                response = await AdminService.createAssociation(formDataToSend);
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                toast({
                    title: t.saveSuccess,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
                await fetchAssociations();
                handleCancel();
            } else {
                throw new Error(response.message || t.saveFailed);
            }
        } catch (err) {
            toast({
                title: t.saveError,
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

    const handleEdit = (assoc) => {
        setFormData({
            username: assoc.username,
            email: assoc.email,
            password: '',
            role: assoc.role,
            name: assoc.name,
            ville: assoc.ville,
            responsableName: assoc.responsableName,
            responsablePhone: assoc.responsablePhone,
            description: assoc.description,
            imageFileName: assoc.imageFileName
        });
        setEditingAssociation(assoc);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;

        setGlobalLoading(true);
        try {
            await AdminService.deleteAssociation(id);
            await fetchAssociations();
            toast({
                title: t.deleteSuccess,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } catch (err) {
            toast({
                title: t.deleteError,
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
        setEditingAssociation(null);
        onClose();
    };

    const filteredAssociations = associations.filter(assoc =>
        (assoc?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (assoc?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (assoc?.ville?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

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
                        <Button
                            leftIcon={<FaPlus />}
                            onClick={onOpen}
                            colorScheme="#582C83"
                            size="lg"
                            rounded="full"
                            px={8}
                        >
                            {t.addAssociation}
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

                {/* Associations Grid */}
                {globalLoading ? (
                    <Flex justify="center" align="center" h="400px">
                        <VStack spacing={4}>
                            <Box className="loading-spinner" />
                            <Text color={secondaryTextColor}>{t.loading}</Text>
                        </VStack>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {filteredAssociations.map((assoc) => (
                            <Box
                                key={assoc.id}
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
                                        onClick={() => handleEdit(assoc)}
                                        aria-label="Edit"
                                        size="sm"
                                        mr={2}
                                    />
                                    <IconButton
                                        icon={<FaTrash />}
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDelete(assoc.id)}
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
                                            name={assoc.name}
                                            src={assoc.imageFileName ? `http://localhost:8080/images/${assoc.imageFileName}` : undefined}
                                            bg="#582C83"
                                            mr={4}
                                        />
                                        <Box>
                                            <Heading size="md" color={textColor} mb={1}>
                                                {assoc.name}
                                            </Heading>
                                            <Text color="purple.500" fontSize="sm" fontWeight="medium">
                                                @{assoc.username}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    {/* Information Grid */}
                                    <SimpleGrid columns={1} spacing={4}>
                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.table.email}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaEnvelope} mr={2} color="blue.500" />
                                                <Text fontSize="sm" isTruncated>
                                                    {assoc.email}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.table.city}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaCity} mr={2} color="green.500" />
                                                <Text fontSize="sm">
                                                    {assoc.ville}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.table.responsible}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaUserTie} mr={2} color="orange.500" />
                                                <Text fontSize="sm">
                                                    {assoc.responsableName}
                                                </Text>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color={secondaryTextColor} textTransform="uppercase" mb={1}>
                                                {t.table.phone}
                                            </Text>
                                            <Flex align="center" color={textColor}>
                                                <Icon as={FaPhone} mr={2} color="pink.500" />
                                                <Text fontSize="sm">
                                                    {assoc.responsablePhone}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </SimpleGrid>

                                    {/* Status Badges */}
                                    <Flex mt={4} gap={2}>
                                        <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                                            {t.status.association}
                                        </Badge>
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
                                {editingAssociation ? t.editAssociation : t.addAssociation}
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
                                                {editingAssociation ? t.form.newPassword : t.form.password}
                                            </Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!editingAssociation}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaBuilding />
                                            <Text>{t.form.name}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaCity />
                                            <Text>{t.form.city}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaUserTie />
                                            <Text>{t.form.responsible}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="responsableName"
                                        value={formData.responsableName}
                                        onChange={handleInputChange}
                                        required
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
                                        name="responsablePhone"
                                        value={formData.responsablePhone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <MdDescription />
                                            <Text>{t.form.description}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <HStack spacing={2}>
                                            <FaImage />
                                            <Text>{t.form.uploadImage}</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData(prev => ({...prev, imageFile: e.target.files[0]}))}
                                        p={1}
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
                                        {editingAssociation ? t.form.update : t.form.save}
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

export default AssociationManagement;