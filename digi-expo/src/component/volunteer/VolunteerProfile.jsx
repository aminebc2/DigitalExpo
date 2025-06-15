import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import VolunteerService from "../../service/VolunteerService";
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
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
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    useToast,
    IconButton,
    Grid,
    GridItem,
    Card,
    CardBody,
    Stack,
    Badge,
    Checkbox,
    SimpleGrid,
} from '@chakra-ui/react';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaCamera,
    FaEdit,
    FaSave,
    FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const translations = {
    fr: {
        pageTitle: "Mon Profil",
        loading: "Chargement du profil...",
        error: "Une erreur s'est produite lors du chargement des données.",
        noProfile: "Aucune donnée de profil disponible.",
        username: "Nom d'utilisateur",
        email: "Email",
        phone: "Téléphone",
        notSpecified: "Non renseigné",
        availableDays: "Jours disponibles",
        noDaysSelected: "Aucun jour sélectionné",
        edit: "Modifier",
        save: "Enregistrer",
        cancel: "Annuler",
        updateFailed: "Échec de la mise à jour : ",
        updateError: "Échec de la mise à jour du profil",
        editProfile: "Modifier le Profil",
        saveChanges: "Enregistrer les Modifications",
        success: "Succès",
        updateSuccess: "Profil mis à jour avec succès. Veuillez vous reconnecter.",
        volunteerBadge: "Bénévole",
        days: {
            MONDAY: "LUNDI",
            TUESDAY: "MARDI",
            WEDNESDAY: "MERCREDI",
            THURSDAY: "JEUDI",
            FRIDAY: "VENDREDI",
            SATURDAY: "SAMEDI",
            SUNDAY: "DIMANCHE"
        }
    },
    en: {
        pageTitle: "My Profile",
        loading: "Loading profile...",
        error: "An error occurred while fetching data.",
        noProfile: "No profile data available.",
        username: "Username",
        email: "Email",
        phone: "Phone",
        notSpecified: "Not specified",
        availableDays: "Available Days",
        noDaysSelected: "No days selected",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        updateFailed: "Update failed: ",
        updateError: "Failed to update profile",
        editProfile: "Edit Profile",
        saveChanges: "Save Changes",
        success: "Success",
        updateSuccess: "Profile updated successfully. Please login again.",
        volunteerBadge: "Volunteer",
        days: {
            MONDAY: "MONDAY",
            TUESDAY: "TUESDAY",
            WEDNESDAY: "WEDNESDAY",
            THURSDAY: "THURSDAY",
            FRIDAY: "FRIDAY",
            SATURDAY: "SATURDAY",
            SUNDAY: "SUNDAY"
        }
    }
};

const availableDaysOptions = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
];

function VolunteerProfile() {
    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        availableDays: []
    });
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    // Color modes
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'white');
    const mutedColor = useColorModeValue('gray.600', 'gray.400');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');

    const user = JSON.parse(localStorage.getItem("user"));
    const volunteerId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await VolunteerService.getVolunteerById(volunteerId);

                if (response.statusCode === 200) {
                    const volunteerData = response.volunteer;
                    if (typeof volunteerData.availableDays === "string") {
                        volunteerData.availableDays = volunteerData.availableDays.split(",").map(day => day.trim());
                    }
                    if (!Array.isArray(volunteerData.availableDays)) {
                        volunteerData.availableDays = [];
                    }
                    setVolunteer(volunteerData);
                    setFormData(volunteerData);
                } else {
                    setError(response.message || t.updateFailed);
                }
            } catch (err) {
                setError(t.error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (volunteerId) {
            fetchData();
        }
    }, [volunteerId, t.error, t.updateFailed]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvailableDaysChange = (day, checked) => {
        let newDays = formData.availableDays ? [...formData.availableDays] : [];
        if (checked) {
            if (!newDays.includes(day)) newDays.push(day);
        } else {
            newDays = newDays.filter(d => d !== day);
        }
        setFormData({ ...formData, availableDays: newDays });
    };

    const handleSave = async () => {
        try {
            const response = await VolunteerService.updateVolunteer(volunteerId, formData);

            if (response.statusCode === 200) {
                toast({
                    title: t.success,
                    description: t.updateSuccess,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                logout();

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                throw new Error(response.message || t.updateFailed);
            }
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Error",
                description: t.updateError,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

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

    if (!volunteer) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg={pageBg}>
                <VStack spacing={4}>
                    <Circle size={16} bg="#f3e8ff" color="#5f249f">
                        <Icon as={FaUser} boxSize={8} />
                    </Circle>
                    <Text fontSize="lg" color="gray.500">
                        {t.noProfile}
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
                                        bgGradient="linear(to-r, #5f249f, #8f4fd3)"
                                        position="relative"
                                    />
                                    <Box
                                        position="absolute"
                                        left="50%"
                                        top="50%"
                                        transform="translate(-50%, -30%)"
                                        textAlign="center"
                                    >
                                        <Circle
                                            size="100px"
                                            bg="#f3e8ff"
                                            border="4px solid white"
                                        >
                                            <Icon as={FaUser} boxSize={10} color="#5f249f" />
                                        </Circle>
                                    </Box>
                                </Box>

                                <VStack pt="60px" pb={6} px={6} spacing={4}>
                                    <VStack spacing={1}>
                                        <Heading size="md" color={textColor}>
                                            {volunteer.username}
                                        </Heading>
                                        <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                                            {t.volunteerBadge}
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
                                        <Heading size="md" color={textColor}>
                                            {t.pageTitle}
                                        </Heading>
                                        {editMode && (
                                            <HStack spacing={2}>
                                                <Button
                                                    leftIcon={<Icon as={FaSave} />}
                                                    onClick={handleSave}
                                                    bg="#5f249f"
                                                    color="white"
                                                    _hover={{ bg: "#4a1d7f" }}
                                                    size="sm"
                                                >
                                                    {t.saveChanges}
                                                </Button>
                                                <Button
                                                    leftIcon={<Icon as={FaTimes} />}
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setFormData(volunteer);
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
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel color={mutedColor}>
                                                    <HStack spacing={2}>
                                                        <Icon as={FaUser} color="#5f249f" />
                                                        <Text>{t.username}</Text>
                                                    </HStack>
                                                </FormLabel>
                                                {editMode ? (
                                                    <Input
                                                        name="username"
                                                        value={formData.username || ""}
                                                        onChange={handleChange}
                                                        bg={inputBg}
                                                        borderColor={borderColor}
                                                        _focus={{
                                                            borderColor: "#5f249f",
                                                            boxShadow: "0 0 0 1px #5f249f",
                                                        }}
                                                    />
                                                ) : (
                                                    <Text color={textColor} fontSize="md" pl={8}>
                                                        {volunteer.username || t.notSpecified}
                                                    </Text>
                                                )}
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl>
                                                <FormLabel color={mutedColor}>
                                                    <HStack spacing={2}>
                                                        <Icon as={FaEnvelope} color="#5f249f" />
                                                        <Text>{t.email}</Text>
                                                    </HStack>
                                                </FormLabel>
                                                {editMode ? (
                                                    <Input
                                                        name="email"
                                                        value={formData.email || ""}
                                                        onChange={handleChange}
                                                        bg={inputBg}
                                                        borderColor={borderColor}
                                                        _focus={{
                                                            borderColor: "#5f249f",
                                                            boxShadow: "0 0 0 1px #5f249f",
                                                        }}
                                                    />
                                                ) : (
                                                    <Text color={textColor} fontSize="md" pl={8}>
                                                        {volunteer.email || t.notSpecified}
                                                    </Text>
                                                )}
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl>
                                                <FormLabel color={mutedColor}>
                                                    <HStack spacing={2}>
                                                        <Icon as={FaPhone} color="#5f249f" />
                                                        <Text>{t.phone}</Text>
                                                    </HStack>
                                                </FormLabel>
                                                {editMode ? (
                                                    <Input
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber || ""}
                                                        onChange={handleChange}
                                                        bg={inputBg}
                                                        borderColor={borderColor}
                                                        _focus={{
                                                            borderColor: "#5f249f",
                                                            boxShadow: "0 0 0 1px #5f249f",
                                                        }}
                                                    />
                                                ) : (
                                                    <Text color={textColor} fontSize="md" pl={8}>
                                                        {volunteer.phoneNumber || t.notSpecified}
                                                    </Text>
                                                )}
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 1, md: 2 }}>
                                            <FormControl>
                                                <FormLabel color={mutedColor}>
                                                    <HStack spacing={2}>
                                                        <Icon as={FaCalendarAlt} color="#5f249f" />
                                                        <Text>{t.availableDays}</Text>
                                                    </HStack>
                                                </FormLabel>
                                                {editMode ? (
                                                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                                        {availableDaysOptions.map((day) => (
                                                            <Checkbox
                                                                key={day}
                                                                isChecked={formData.availableDays?.includes(day)}
                                                                onChange={(e) => handleAvailableDaysChange(day, e.target.checked)}
                                                                colorScheme="purple"
                                                            >
                                                                {t.days[day]}
                                                            </Checkbox>
                                                        ))}
                                                    </SimpleGrid>
                                                ) : (
                                                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                                                        {volunteer.availableDays?.length > 0 ? (
                                                            volunteer.availableDays.map(day => (
                                                                <Badge
                                                                    key={day}
                                                                    colorScheme="purple"
                                                                    p={2}
                                                                    borderRadius="md"
                                                                    textAlign="center"
                                                                >
                                                                    {t.days[day]}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <Text color={mutedColor}>{t.noDaysSelected}</Text>
                                                        )}
                                                    </SimpleGrid>
                                                )}
                                            </FormControl>
                                        </GridItem>
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

export default VolunteerProfile;
