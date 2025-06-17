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
    Circle,
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
import { useLanguage } from '../../context/LanguageContext';
import GuestService from '../../service/GuestService';

const MotionBox = motion(Box);
const MotionGrid = motion(SimpleGrid);

const translations = {
    fr: {
        pageTitle: "Découvrez des Associations Inspirantes",
        pageDescription: "Connectez-vous avec des associations qui font une différence dans votre communauté et contribuez à des causes qui vous tiennent à cœur",
        searchPlaceholder: "Rechercher une association...",
        filters: "Filtres",
        allCities: "Toutes les villes",
        sortByName: "Trier par nom",
        sortByCity: "Trier par ville",
        noResults: "Aucune association ne correspond à vos critères de recherche",
        addToFavorites: "Ajouter aux favoris",
        removeFromFavorites: "Retirer des favoris",
        cityLabel: "Ville",
        sortByLabel: "Trier par",
        loadingError: "Impossible de charger les associations",
        filterResults: "Filtrer les résultats"
    },
    en: {
        pageTitle: "Discover Inspiring Associations",
        pageDescription: "Connect with associations making a difference in your community and contribute to causes you care about",
        searchPlaceholder: "Search for an association...",
        filters: "Filters",
        allCities: "All cities",
        sortByName: "Sort by name",
        sortByCity: "Sort by city",
        noResults: "No associations found matching your search criteria",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        cityLabel: "City",
        sortByLabel: "Sort by",
        loadingError: "Unable to load associations",
        filterResults: "Filter results"
    }
};

const Associations = () => {
    const { language } = useLanguage();
    const t = translations[language];
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
    const toast = useToast();

    // Color mode values
    const bgColor = useColorModeValue('white', 'gray.800');
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
            const matchesSearch = (association?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (association?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesCity = !filters.city ||
                (association?.ville?.toLowerCase() || '').includes(filters.city.toLowerCase());

            const matchesCategory = !filters.category || association?.category === filters.category;

            return matchesSearch && matchesCity && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return (a?.name || '').localeCompare(b?.name || '');
            }
            if (sortBy === 'city') {
                return (a?.ville || '').localeCompare(b?.ville || '');
            }
            return 0;
        });

    const cities = [...new Set(associations
        .filter(a => a?.ville) // Filter out null/undefined values
        .map(a => a.ville))];

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {/* Hero Section with Search */}
            <Box
                bgGradient="linear(to-r, purple.800, purple.600)"
                pt={24}
                pb={32}
                position="relative"
                overflow="hidden"
            >
                {/* Animated Background Elements */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    overflow="hidden"
                    zIndex="0"
                >
                    {[...Array(5)].map((_, i) => (
                        <Circle
                            key={i}
                            position="absolute"
                            bg={`rgba(255, 255, 255, ${0.03 + i * 0.01})`}
                            w={`${300 + i * 100}px`}
                            h={`${300 + i * 100}px`}
                            top={`${-50 + i * 20}%`}
                            left={`${-20 + i * 30}%`}
                            transform="rotate(-45deg)"
                            filter="blur(60px)"
                        />
                    ))}
                </Box>

                <Container maxW="container.xl" position="relative" zIndex={1}>
                    <VStack spacing={6} align="center" textAlign="center" mb={12}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Heading
                                as="h1"
                                size="3xl"
                                color="white"
                                fontWeight="bold"
                                letterSpacing="tight"
                                mb={4}
                            >
                                {t.pageTitle}
                            </Heading>
                            <Text
                                fontSize="xl"
                                color="whiteAlpha.900"
                                maxW="2xl"
                                mx="auto"
                            >
                                {t.pageDescription}
                            </Text>
                        </MotionBox>
                    </VStack>

                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <HStack
                            spacing={4}
                            justify="center"
                            maxW="2xl"
                            mx="auto"
                            bg="whiteAlpha.200"
                            p={2}
                            borderRadius="full"
                            backdropFilter="blur(10px)"
                        >
                            <InputGroup size="lg" flex={1}>
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FaSearch} color="whiteAlpha.700" />
                                </InputLeftElement>
                                <Input
                                    placeholder={t.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    variant="unstyled"
                                    color="white"
                                    pl={12}
                                    _placeholder={{ color: "whiteAlpha.700" }}
                                />
                            </InputGroup>
                            <Button
                                leftIcon={<FaSlidersH />}
                                onClick={onOpen}
                                bg="white"
                                color="purple.600"
                                size="lg"
                                borderRadius="full"
                                px={8}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "lg",
                                }}
                            >
                                {t.filters}
                            </Button>
                        </HStack>
                    </MotionBox>
                </Container>
            </Box>

            {/* Main Content */}
            <Box
                transform="translateY(-100px)"
                position="relative"
                zIndex={1}
            >
                <Container maxW="container.xl" px={4}>
                    {/* Error Alert */}
                    {error && (
                        <Alert status="error" borderRadius="xl" mb={8}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    {/* Associations Grid */}
                    {loading ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                            {[...Array(6)].map((_, i) => (
                                <Box
                                    key={i}
                                    bg={cardBg}
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    boxShadow={`0 4px 20px ${shadowColor}`}
                                >
                                    <Skeleton height="200px" />
                                    <Box p={6}>
                                        <VStack align="stretch" spacing={4}>
                                            <Skeleton height="24px" width="70%" />
                                            <Skeleton height="20px" width="40%" />
                                            <Skeleton height="20px" width="30%" />
                                        </VStack>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : filteredAssociations.length === 0 ? (
                        <Box
                            bg={cardBg}
                            borderRadius="2xl"
                            p={12}
                            textAlign="center"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                        >
                            <Icon as={FaBuilding} boxSize={12} color="purple.300" mb={4} />
                            <Text color={textColor} fontSize="xl" fontWeight="medium">
                                {t.noResults}
                            </Text>
                        </Box>
                    ) : (
                        <MotionGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={8}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {filteredAssociations.map((association, index) => (
                                <MotionBox
                                    key={association.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box
                                        bg={cardBg}
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        boxShadow={`0 4px 20px ${shadowColor}`}
                                        position="relative"
                                        transition="all 0.3s"
                                        _hover={{
                                            transform: "translateY(-8px)",
                                            boxShadow: "2xl",
                                        }}
                                    >
                                        <Box
                                            position="relative"
                                            width="100%"
                                            height="260px"
                                            bg="purple.50"
                                        >
                                            <Image
                                                src={association.imageFileName
                                                    ? `http://localhost:8080/images/${association.imageFileName}`
                                                    : '/images/default-association.jpg'
                                                }
                                                alt={association.name}
                                                objectFit="contain"
                                                w="full"
                                                h="full"
                                                p={4}
                                                fallback={
                                                    <Flex
                                                        w="full"
                                                        h="full"
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
                                                    size="md"
                                                    borderRadius="full"
                                                    bg="white"
                                                    color="purple.500"
                                                    _hover={{
                                                        transform: "scale(1.1)",
                                                    }}
                                                />
                                            </Tooltip>
                                        </Box>
                                        <Box p={6}>
                                            <VStack align="stretch" spacing={4}>
                                                <Heading size="lg" color={headingColor}>
                                                    {association.name}
                                                </Heading>
                                                <HStack spacing={4}>
                                                    <HStack spacing={2} color={textColor}>
                                                        <Icon as={FaMapMarkerAlt} color="purple.500" />
                                                        <Text fontWeight="medium">{association.ville}</Text>
                                                    </HStack>
                                                    {association.responsablePhone && (
                                                        <HStack spacing={2} color={textColor}>
                                                            <Icon as={FaPhone} color="purple.500" />
                                                            <Text fontWeight="medium">{association.responsablePhone}</Text>
                                                        </HStack>
                                                    )}
                                                </HStack>
                                                <Badge
                                                    colorScheme="purple"
                                                    px={3}
                                                    py={1}
                                                    borderRadius="full"
                                                    textTransform="none"
                                                    fontSize="sm"
                                                    alignSelf="flex-start"
                                                >
                                                    Association
                                                </Badge>
                                            </VStack>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            ))}
                        </MotionGrid>
                    )}
                </Container>
            </Box>

            {/* Filter Drawer */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                <DrawerOverlay backdropFilter="blur(10px)" />
                <DrawerContent>
                    <DrawerHeader
                        borderBottomWidth="1px"
                        bg="purple.500"
                        color="white"
                    >
                        {t.filters}
                        <DrawerCloseButton color="white" />
                    </DrawerHeader>
                    <DrawerBody py={8}>
                        <VStack spacing={8} align="stretch">
                            <Box>
                                <Text mb={3} fontWeight="bold" fontSize="lg">City</Text>
                                <Select
                                    value={filters.city}
                                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                                    placeholder={t.allCities}
                                    size="lg"
                                    borderRadius="lg"
                                    focusBorderColor="purple.500"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </Select>
                            </Box>
                            <Box>
                                <Text mb={3} fontWeight="bold" fontSize="lg">Sort By</Text>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    size="lg"
                                    borderRadius="lg"
                                    focusBorderColor="purple.500"
                                >
                                    <option value="name">{t.sortByName}</option>
                                    <option value="city">{t.sortByCity}</option>
                                </Select>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Associations;
