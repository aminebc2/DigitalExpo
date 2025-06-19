import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AssociationService from "../../service/AssociationService";
import {
    FaUser,
    FaEnvelope,
    FaBuilding,
    FaCity,
    FaUserTie,
    FaPhone,
    FaCamera,
    FaEdit,
    FaSave,
    FaTimes,
    FaLock,
    FaKey
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import {AuthContext} from '../../context/AuthContext';

import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Icon,
    Input,
    Button,
    useColorModeValue,
    Circle,
    Image,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    Divider,
    useToast,
    IconButton,
    Grid,
    GridItem,
    Card,
    CardBody,
    Stack,
    Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.div;

const translations = {
    fr: {
        pageTitle: "Profil de l'Association",
        loading: "Chargement du profil...",
        error: "Une erreur s'est produite lors du chargement des données.",
        noData: "Aucune donnée disponible.",
        editProfile: "Modifier le Profil",
        changePhoto: "Changer la Photo",
        saveChanges: "Enregistrer",
        cancel: "Annuler",
        updateFailed: "La mise à jour a échoué",
        updateSucceededNoData: "Mise à jour réussie mais aucune donnée retournée.",
        notProvided: "Non fourni",
        fields: {
            username: "Nom d'utilisateur",
            email: "Email",
            name: "Nom",
            ville: "Ville",
            responsableName: "Nom du Responsable",
            responsablePhone: "Téléphone du Responsable",
            password: "Mot de passe"
        },
        placeholders: {
            username: "Entrez le nom d'utilisateur",
            email: "Entrez l'email",
            name: "Entrez le nom",
            ville: "Entrez la ville",
            responsableName: "Entrez le nom du responsable",
            responsablePhone: "Entrez le téléphone du responsable",
            password: "Entrez le nouveau mot de passe"
        }
    },
    en: {
        pageTitle: "Association Profile",
        loading: "Loading profile...",
        error: "An error occurred while fetching data.",
        noData: "No data available.",
        editProfile: "Edit Profile",
        changePhoto: "Change Photo",
        saveChanges: "Save Changes",
        cancel: "Cancel",
        updateFailed: "Update failed",
        updateSucceededNoData: "Update succeeded but no data returned.",
        notProvided: "Not provided",
        fields: {
            username: "Username",
            email: "Email",
            name: "Name",
            ville: "City",
            responsableName: "Manager Name",
            responsablePhone: "Manager Phone",
            password: "Password"
        },
        placeholders: {
            username: "Enter username",
            email: "Enter email",
            name: "Enter name",
            ville: "Enter city",
            responsableName: "Enter manager name",
            responsablePhone: "Enter manager phone",
            password: "Enter new password"
        }
    }
};

function AssociationProfile() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        name: "",
        ville: "",
        responsableName: "",
        responsablePhone: "",
        password: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    const user = JSON.parse(localStorage.getItem("user"));
    const associationId = user?.id;

    // Color modes
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'white');
    const mutedColor = useColorModeValue('gray.600', 'gray.400');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AssociationService.getAssociationById(associationId);
                if (response.statusCode === 200) {
                    setAssociation(response.association);
                    setFormData(response.association);
                    if (response.association.imageFileName) {
                        setImagePreview(`http://localhost:8080/images/${response.association.imageFileName}`);
                    }
                } else {
                    setError(response.message || t.error);
                }
            } catch (err) {
                setError(t.error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (associationId) {
            fetchData();
        }
    }, [associationId, t.error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            // Create a copy of formData
            const dataToSend = { ...formData };

            // Only include password if it was changed
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            // Check if there are any actual changes
            const hasChanges = Object.keys(dataToSend).some(key =>
                dataToSend[key] !== association[key]
            ) || imageFile;

            // If no changes, just exit edit mode
            if (!hasChanges) {
                setEditMode(false);
                toast({
                    title: "Info",
                    description: "No changes to save",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            const response = await AssociationService.updateAssociation(
                associationId,
                dataToSend,
                imageFile
            );

            if (response && response.statusCode === 200) {
                toast({
                    title: "Success",
                    description: formData.password
                        ? "Profile updated successfully. Please login again."
                        : "Profile updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // If password was changed, force logout
                if (formData.password) {
                    logout();
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    // Update local state with new data
                    setEditMode(false);
                    setAssociation(response.association || association);
                    setFormData(response.association || association);

                    // Update image preview if needed
                    if (response.association?.imageFileName) {
                        setImagePreview(`http://localhost:8080/images/${response.association.imageFileName}`);
                    }
                }
            } else {
                throw new Error(response?.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update error:', err);
            toast({
                title: "Error",
                description: t.updateFailed,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fields = [
        { name: 'username', icon: FaUser, label: t.fields.username },
        { name: 'email', icon: FaEnvelope, label: t.fields.email },
        { name: 'name', icon: FaBuilding, label: t.fields.name },
        { name: 'ville', icon: FaCity, label: t.fields.ville },
        { name: 'responsableName', icon: FaUserTie, label: t.fields.responsableName },
        { name: 'responsablePhone', icon: FaPhone, label: t.fields.responsablePhone },
        {
            name: 'password',
            icon: FaLock,
            label: t.fields.password,
            isPassword: true
        },
    ];

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={pageBg}>
                <VStack spacing={4}>
                    <Spinner size="xl" color="#5f249f" thickness="4px" />
                    <Text>{t.loading}</Text>
                </VStack>
            </Flex>
        );
    }

    if (error) {
        return (
            <Container maxW="7xl" py={8}>
                <Alert status="error" borderRadius="xl" variant="left-accent">
                    <AlertIcon />
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!association) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={pageBg}>
                <VStack spacing={4}>
                    <Circle size={16} bg="#f3e8ff" color="#5f249f">
                        <Icon as={FaBuilding} boxSize={8} />
                    </Circle>
                    <Text fontSize="lg" color="gray.500">
                        {t.noData}
                    </Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box minH="100vh" bg={pageBg} py={8}>
            <Container maxW="7xl">
                <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={8}>
                    {/* Left Column - Profile Image and Quick Info */}
                    <GridItem>
                        <Card
                            bg={bgColor}
                            borderRadius="2xl"
                            overflow="hidden"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                            position="sticky"
                            top="8"
                        >
                            <CardBody p={0}>
                                <Box position="relative">
                                    <Box
                                        h="120px"
                                        bgGradient="linear(to-r, #582C83, #582C83)"
                                        position="relative"
                                    />
                                    <Box
                                        position="absolute"
                                        left="50%"
                                        top="50%"
                                        transform="translate(-50%, -30%)"
                                        textAlign="center"
                                    >
                                        <Box
                                            borderRadius="full"
                                            overflow="hidden"
                                            boxSize="100px"
                                            bg="white"
                                            p={1}
                                        >
                                            {imagePreview ? (
                                                <Image
                                                    src={imagePreview}
                                                    alt="Association"
                                                    w="full"
                                                    h="full"
                                                    objectFit="cover"
                                                    borderRadius="full"
                                                />
                                            ) : (
                                                <Flex
                                                    w="full"
                                                    h="full"
                                                    bg="#f3e8ff"
                                                    align="center"
                                                    justify="center"
                                                    borderRadius="full"
                                                >
                                                    <Icon as={FaBuilding} boxSize={8} color="#5f249f" />
                                                </Flex>
                                            )}
                                        </Box>
                                        {editMode && (
                                            <IconButton
                                                icon={<Icon as={FaCamera} />}
                                                position="absolute"
                                                bottom="0"
                                                right="0"
                                                colorScheme="purple"
                                                rounded="full"
                                                size="sm"
                                                onClick={() => document.getElementById('imageInput').click()}
                                            />
                                        )}
                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                </Box>

                                <VStack pt="60px" pb={6} px={6} spacing={4}>
                                    <VStack spacing={1}>
                                        <Heading size="md" color={textColor}>
                                            {association.name || t.unnamedVolunteer}
                                        </Heading>
                                        <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                                            Association
                                        </Badge>
                                    </VStack>

                                    {!editMode && (
                                        <Button
                                            leftIcon={<Icon as={FaEdit} />}
                                            onClick={() => setEditMode(true)}
                                            colorScheme="purple"
                                            variant="outline"
                                            size="sm"
                                            w="full"
                                        >
                                            {t.editProfile}
                                        </Button>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Right Column - Profile Details */}
                    <GridItem>
                        <Card
                            bg={bgColor}
                            borderRadius="2xl"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                        >
                            <CardBody>
                                <Stack spacing={6}>
                                    <HStack justify="space-between" align="center">
                                        <Heading size="md" color="#582C83">
                                            {t.pageTitle}
                                        </Heading>
                                        {editMode && (
                                            <HStack spacing={2}>
                                                <Button
                                                    leftIcon={<Icon as={FaSave} />}
                                                    onClick={handleSave}
                                                    bg="#582C83"
                                                    color="white"
                                                    _hover={{ bg: "#582C83" }}
                                                    size="sm"
                                                >
                                                    {t.saveChanges}
                                                </Button>
                                                <Button
                                                    leftIcon={<Icon as={FaTimes} />}
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setImageFile(null);
                                                        setImagePreview(association.imageFileName ?
                                                            `http://localhost:8080/images/${association.imageFileName}` : null);
                                                        setFormData(association);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    {t.cancel}
                                                </Button>
                                            </HStack>
                                        )}
                                    </HStack>

                                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                                        {fields.map((field) => (
                                            <GridItem key={field.name}>
                                                <FormControl>
                                                    <FormLabel color={mutedColor}>
                                                        <HStack spacing={2}>
                                                            <Icon as={field.icon} color="#582C83" />
                                                            <Text color="#582C83">{field.label}</Text>
                                                        </HStack>
                                                    </FormLabel>
                                                    {editMode ? (
                                                        <InputGroup>
                                                            <InputLeftElement>
                                                                <Icon as={field.icon} color="#582C83" />
                                                            </InputLeftElement>
                                                            <Input
                                                                name={field.name}
                                                                value={formData[field.name] || ""}
                                                                onChange={handleChange}
                                                                placeholder={t.placeholders[field.name]}
                                                                type={field.type}
                                                                bg={inputBg}
                                                                borderColor={borderColor}
                                                                _focus={{
                                                                    borderColor: "#582C83",
                                                                    boxShadow: "0 0 0 1px #582C83",
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    ) : (
                                                        <Text color={textColor} fontSize="md" pl={8}>
                                                            {field.type === 'password' ?
                                                                (formData[field.name] ? "••••••••" : "*******") :
                                                                (association[field.name] || "*********")}
                                                        </Text>
                                                    )}
                                                </FormControl>
                                            </GridItem>
                                        ))}
                                    </Grid>
                                </Stack>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
}

export default AssociationProfile;