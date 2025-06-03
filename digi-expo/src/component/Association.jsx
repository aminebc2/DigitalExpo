import React, { useState, useEffect } from 'react';
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
    Fade,
    ScaleFade,
    Badge,
    Image,
    IconButton,
    Flex,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Skeleton,
    Alert,
    AlertIcon,
    Tooltip,
    useToast
} from '@chakra-ui/react';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaPhone,
    FaFilter,
    FaHeart,
    FaRegHeart,
    FaSlidersH,
    FaBuilding
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import GuestService from '../service/GuestService';

const MotionBox = motion(Box);

// Translations object remains the same
const translations = {
    fr: {
        pageTitle: "Découvrir les Associations",
        pageDescription: "Trouvez et connectez-vous avec des associations qui font la différence dans votre communauté",
        searchPlaceholder: "Rechercher des associations...",
        filters: "Filtres",
        allCities: "Toutes les Villes",
        sortByName: "Trier par Nom d'Association",
        sortByCity: "Trier par Ville",
        noResults: "Aucune association ne correspond à vos critères.",
        addToFavorites: "Ajouter aux favoris",
        removeFromFavorites: "Retirer des favoris"
    },
    en: {
        pageTitle: "Discover Associations",
        pageDescription: "Find and connect with associations making a difference in your community",
        searchPlaceholder: "Search associations...",
        filters: "Filters",
        allCities: "All Cities",
        sortByName: "Sort by Association Name",
        sortByCity: "Sort by City",
        noResults: "No associations found matching your criteria.",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites"
    }
};

const Associations = () => {
    const [associations, setAssociations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        category: '',
    });
    const [sortBy, setSortBy] = useState('name');
    const [favorites, setFavorites] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { language } = useLanguage();
    const t = translations[language];
    const toast = useToast();

    // Color mode values
    const bgColor = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('purple.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');
    const headingColor = useColorModeValue('gray.700', 'white');

    useEffect(() => {
        const fetchAssociations = async () => {
            try {
                setLoading(true);
                const response = await GuestService.getAllAssociations();
                if (response.statusCode === 200) {
                    setAssociations(response.associations || []);
                    setError(null);
                } else {
                    setError(response.message || 'Failed to load associations');
                }
            } catch (err) {
                setError('Failed to fetch associations');
            } finally {
                setLoading(false);
            }
        };

        fetchAssociations();
    }, []);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favoriteAssociations');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const toggleFavorite = (associationId) => {
        const newFavorites = favorites.includes(associationId)
            ? favorites.filter(id => id !== associationId)
            : [...favorites, associationId];

        setFavorites(newFavorites);
        localStorage.setItem('favoriteAssociations', JSON.stringify(newFavorites));

        toast({
            title: favorites.includes(associationId) ? "Removed from favorites" : "Added to favorites",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    const filteredAssociations = associations
        .filter(association => {
            const matchesSearch = association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                association.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = !filters.city || association.ville.toLowerCase() === filters.city.toLowerCase();
            const matchesCategory = !filters.category || association.category === filters.category;

            return matchesSearch && matchesCity && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'city') {
                return a.ville.localeCompare(b.ville);
            }
            return 0;
        });

    const cities = [...new Set(associations.map(a => a.ville))];

    const MotionGrid = motion(SimpleGrid);

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {/* Header Section */}
            <Box
                bg={headerBg}
                py={16}
                px={4}
                mb={8}
                position="relative"
                overflow="hidden"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-r, purple.500, purple.600)"
                    opacity={0.1}
                />
                <Container maxW="container.xl" position="relative">
                    <VStack spacing={4} align="center" textAlign="center">
                        <Heading
                            as="h1"
                            size="2xl"
                            color={useColorModeValue('purple.600', 'purple.300')}
                            fontWeight="bold"
                        >
                            {t.pageTitle}
                        </Heading>
                        <Text fontSize="xl" color={textColor} maxW="2xl">
                            {t.pageDescription}
                        </Text>
                    </VStack>
                </Container>
            </Box>

            <Container maxW="container.xl" px={4}>
                {/* Search and Filter Section */}
                <HStack spacing={4} mb={8} justify="space-between" wrap="wrap">
                    <InputGroup maxW={{ base: "full", md: "md" }} flex={1}>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg={bgColor}
                            borderRadius="full"
                            _focus={{
                                borderColor: "purple.500",
                                boxShadow: "0 0 0 1px purple.500"
                            }}
                        />
                    </InputGroup>

                    <Button
                        leftIcon={<FaSlidersH />}
                        onClick={onOpen}
                        colorScheme="purple"
                        variant="outline"
                        borderRadius="full"
                    >
                        {t.filters}
                    </Button>
                </HStack>

                {/* Filter Drawer */}
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth="1px">
                            {t.filters}
                        </DrawerHeader>
                        <DrawerBody>
                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Text mb={2} fontWeight="medium">City</Text>
                                    <Select
                                        value={filters.city}
                                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                                        placeholder={t.allCities}
                                    >
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </Select>
                                </Box>
                                <Box>
                                    <Text mb={2} fontWeight="medium">Sort By</Text>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="name">{t.sortByName}</option>
                                        <option value="city">{t.sortByCity}</option>
                                    </Select>
                                </Box>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Error Alert */}
                {error && (
                    <Alert status="error" borderRadius="lg" mb={8}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {/* Associations Grid */}
                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                        {[...Array(6)].map((_, i) => (
                            <Box key={i} borderRadius="lg" overflow="hidden">
                                <Skeleton height="200px" />
                                <Box p={4}>
                                    <Skeleton height="20px" mb={2} />
                                    <Skeleton height="20px" width="60%" />
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : filteredAssociations.length === 0 ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        minH="200px"
                        bg={cardBg}
                        borderRadius="lg"
                        p={8}
                    >
                        <Icon as={FaBuilding} boxSize={12} color="gray.400" mb={4} />
                        <Text color={textColor} fontSize="lg">
                            {t.noResults}
                        </Text>
                    </Flex>
                ) : (
                    <MotionGrid
                        columns={{ base: 1, md: 2, lg: 3 }}
                        spacing={8}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredAssociations.map(association => (
                            <MotionBox
                                key={association.id}
                                as="article"
                                bg={cardBg}
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow={`0 4px 20px ${shadowColor}`}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                display="flex"
                                flexDirection="column"
                            >
                                <Box
                                    position="relative"
                                    width="100%"
                                    paddingBottom="56.25%" // 16:9 aspect ratio
                                    minHeight="200px"
                                    maxHeight="400px"
                                >
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                    >
                                        <Image
                                            src={association.imageFileName
                                                ? `http://localhost:8080/images/${association.imageFileName}`
                                                : '/images/default-association.jpg'
                                            }
                                            alt={association.name}
                                            objectFit="contain"
                                            bg="gray.100"
                                            w="full"
                                            h="full"
                                            fallback={
                                                <Flex
                                                    w="full"
                                                    h="full"
                                                    bg="purple.50"
                                                    align="center"
                                                    justify="center"
                                                >
                                                    <Icon as={FaBuilding} boxSize={12} color="purple.200" />
                                                </Flex>
                                            }
                                        />
                                        <Tooltip
                                            label={favorites.includes(association.id) ? t.removeFromFavorites : t.addToFavorites}
                                            placement="top"
                                        >
                                            <IconButton
                                                icon={favorites.includes(association.id) ? <FaHeart /> : <FaRegHeart />}
                                                position="absolute"
                                                top={4}
                                                right={4}
                                                colorScheme="purple"
                                                variant="solid"
                                                onClick={() => toggleFavorite(association.id)}
                                                aria-label={favorites.includes(association.id) ? t.removeFromFavorites : t.addToFavorites}
                                                size="sm"
                                                borderRadius="full"
                                            />
                                        </Tooltip>
                                    </Box>
                                </Box>
                                <Box p={6} flex={1}>
                                    <VStack align="stretch" spacing={3} height="100%">
                                        <Heading size="md" color={headingColor}>
                                            {association.name}
                                        </Heading>
                                        <HStack spacing={2} color={textColor}>
                                            <Icon as={FaMapMarkerAlt} />
                                            <Text>{association.ville}</Text>
                                        </HStack>
                                        {association.responsablePhone && (
                                            <HStack spacing={2} color={textColor}>
                                                <Icon as={FaPhone} />
                                                <Text>{association.responsablePhone}</Text>
                                            </HStack>
                                        )}
                                        <Badge colorScheme="purple" alignSelf="flex-start" mt="auto">
                                            Association
                                        </Badge>
                                    </VStack>
                                </Box>
                            </MotionBox>
                        ))}
                    </MotionGrid>
                )}
            </Container>
        </Box>
    );
};

export default Associations;
