import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    useColorModeValue,
    Image,
    SimpleGrid,
    Flex,
    IconButton,
    Circle,
    Stack,
    Badge,
    useBreakpointValue,
    Fade,
    ScaleFade,
    Wrap,
    WrapItem,
    Grid,
    Divider,
} from '@chakra-ui/react';
import {
    FaBuilding,
    FaArrowRight,
    FaHandsHelping,
    FaHeart,
    FaPhone,
    FaChevronLeft,
    FaChevronRight,
    FaLightbulb,
    FaUsers,
    FaStar,
    FaArrowLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from "../../context/LanguageContext";
import GuestService from "../../service/GuestService";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const translations = {
    fr: {
        welcome: "Bienvenue à Digital Explorers",
        connectingCommunities: "Connecter les Communautés par le Service",
        platformDescription: "Notre plateforme réunit associations et bénévoles, créant des liens significatifs et des changements positifs dans les communautés. Nous facilitons la gestion des activités pour les associations et permettons aux bénévoles de trouver des opportunités pour faire la différence.",
        easyCoordination: "Coordination Facile",
        coordinationDesc: "Gestion simplifiée des sessions et affectation des bénévoles",
        communityImpact: "Impact Communautaire",
        impactDesc: "Faites une réelle différence dans votre communauté locale",
        featuredAssociations: "Associations en Vedette",
        city: "Ville",
        phone: "Téléphone",
        getStarted: "Commencer",
        learnMore: "En Savoir Plus",
        communityBuilding: "Construction Communautaire",
        connectVolunteers: "Connectez-vous avec des bénévoles partageant les mêmes idées",
        associations: "Associations",
        volunteers: "Bénévoles",
        sessions: "Sessions",
        cities: "Villes"
    },
    en: {
        welcome: "Welcome to Digital Explorers",
        connectingCommunities: "Connecting Communities Through Service",
        platformDescription: "Our platform brings together associations and volunteers, creating meaningful connections and positive change in communities. We make it easy for associations to manage their activities and for volunteers to find opportunities to make a difference.",
        easyCoordination: "Easy Coordination",
        coordinationDesc: "Streamlined session management and volunteer assignment",
        communityImpact: "Community Impact",
        impactDesc: "Make a real difference in your local community",
        featuredAssociations: "Featured Associations",
        city: "City",
        phone: "Phone",
        getStarted: "Get Started",
        learnMore: "Learn More",
        communityBuilding: "Community Building",
        connectVolunteers: "Connect with like-minded volunteers",
        associations: "Associations",
        volunteers: "Volunteers",
        sessions: "Sessions",
        cities: "Cities"
    }
};

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [associations, setAssociations] = useState([]);
    const { language } = useLanguage();
    const t = translations[language];
    const navigate = useNavigate();

    // Add isAuthenticated check
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Color mode values
    const bgColor = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('purple.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const accentColor = useColorModeValue('purple.500', 'purple.300');
    const shadowColor = useColorModeValue('rgba(95, 36, 159, 0.1)', 'rgba(95, 36, 159, 0.3)');

    const platformImages = [
        '/images/1.jpg',
        '/images/2.webp',
        '/images/3.avif',
        '/images/4.jpg'
    ];

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    // Handle login click
    const handleLoginClick = () => {
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await GuestService.getAllAssociations();
                if (response.statusCode === 200) {
                    setAssociations(response.associations || []);
                } else {
                    setError(response.message || "Failed to load associations");
                }
                setError(null);
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % associations.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + associations.length) % associations.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [associations.length]);

    const isMobile = useBreakpointValue({ base: true, md: false });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Enhanced purple color scheme
    const colors = {
        purple: {
            50: '#F8F5FF',
            100: '#E9E3FF',
            200: '#D1C2FF',
            300: '#B49AFF',
            400: '#9C74FF',
            500: '#8445FF',
            600: '#7028FF',
            700: '#5B1AE6',
            800: '#4A15BF',
            900: '#3A1299',
        }
    };

    return (
        <Box>
            {/* Hero Section */}
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
                    <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        spacing={{ base: 10, lg: 20 }}
                        align="center"
                    >
                        <VStack
                            spacing={8}
                            align={{ base: 'center', lg: 'start' }}
                            maxW={{ base: 'full', lg: '50%' }}
                            textAlign={{ base: 'center', lg: 'left' }}
                        >
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Heading
                                    as="h1"
                                    fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                                    fontWeight="bold"
                                    color="white"
                                    lineHeight="shorter"
                                    letterSpacing="tight"
                                >
                                    {t.welcome}
                                </Heading>
                            </MotionBox>
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Text
                                    fontSize={{ base: 'lg', md: 'xl' }}
                                    color="whiteAlpha.900"
                                    maxW="600px"
                                >
                                    {t.platformDescription}
                                </Text>
                            </MotionBox>
                            {!isAuthenticated && (
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <Button
                                        size="lg"
                                        bg="white"
                                        color="purple.600"
                                        px={8}
                                        h={14}
                                        fontSize="lg"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: "lg",
                                        }}
                                        transition="all 0.3s"
                                        rightIcon={<Icon as={FaArrowRight} />}
                                        onClick={handleLoginClick}
                                    >
                                        {t.getStarted}
                                    </Button>
                                </MotionBox>
                            )}
                        </VStack>

                        {/* Hero Image Grid with Animation */}
                        <Grid
                            templateColumns="repeat(2, 1fr)"
                            gap={4}
                            maxW={{ base: 'full', lg: '45%' }}
                            position="relative"
                            zIndex={1}
                        >
                            {platformImages.map((image, index) => (
                                <MotionBox
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    gridColumn={index === 0 ? 'span 2' : 'auto'}
                                >
                                    <Box
                                        height={index === 0 ? '300px' : '200px'}
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        boxShadow="2xl"
                                        transform={`translateY(${index * 20}px)`}
                                        transition="transform 0.3s"
                                        _hover={{ transform: `translateY(${index * 20 - 10}px)` }}
                                        bg="whiteAlpha.100"
                                        backdropFilter="blur(8px)"
                                    >
                                        <Image
                                            src={image}
                                            alt={`Platform showcase ${index + 1}`}
                                            objectFit="cover"
                                            w="full"
                                            h="full"
                                        />
                                    </Box>
                                </MotionBox>
                            ))}
                        </Grid>
                    </Stack>
                </Container>
            </Box>

            {/* Stats Section - Now positioned to overlap the hero section */}
            <Box
                transform="translateY(-100px)"
                position="relative"
                zIndex={1}
                px={4}
            >
                <Container maxW="container.xl">
                    <SimpleGrid
                        columns={{ base: 2, md: 4 }}
                        spacing={8}
                        bg="white"
                        p={8}
                        borderRadius="2xl"
                        boxShadow="xl"
                    >
                        {[
                            { number: '8+', label: t.associations, icon: FaBuilding },
                            { number: '100+', label: t.volunteers, icon: FaUsers },
                            { number: '400+', label: t.sessions, icon: FaLightbulb },
                            { number: '7', label: t.cities, icon: FaStar },
                        ].map((stat, index) => (
                            <MotionBox
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <VStack
                                    spacing={4}
                                    p={6}
                                    borderRadius="xl"
                                    transition="all 0.3s"
                                    _hover={{
                                        transform: 'translateY(-5px)',
                                        boxShadow: 'lg',
                                    }}
                                >
                                    <Icon as={stat.icon} boxSize={8} color="purple.500" />
                                    <Heading size="2xl" color="purple.700">
                                        {stat.number}
                                    </Heading>
                                    <Text fontSize="lg" color="purple.600" fontWeight="medium">
                                        {stat.label}
                                    </Text>
                                </VStack>
                            </MotionBox>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box py={20} bg={colors.purple[50]}>
                <Container maxW="container.xl">
                    <VStack spacing={16}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            textAlign="center"
                        >
                            <Heading
                                size="2xl"
                                color={colors.purple[700]}
                                mb={4}
                            >
                                {t.connectingCommunities}
                            </Heading>
                            <Text
                                fontSize="xl"
                                color={colors.purple[600]}
                                maxW="2xl"
                                mx="auto"
                            >
                                {t.platformDescription}
                            </Text>
                        </MotionBox>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                            {[
                                {
                                    icon: FaLightbulb,
                                    title: t.easyCoordination,
                                    description: t.coordinationDesc,
                                },
                                {
                                    icon: FaUsers,
                                    title: t.communityBuilding,
                                    description: t.connectVolunteers,
                                },
                                {
                                    icon: FaStar,
                                    title: t.communityImpact,
                                    description: t.impactDesc,
                                },
                            ].map((feature, index) => (
                                <MotionBox
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <VStack
                                        bg="white"
                                        p={8}
                                        borderRadius="2xl"
                                        spacing={6}
                                        height="full"
                                        boxShadow="lg"
                                        transition="all 0.3s"
                                        _hover={{
                                            transform: 'translateY(-8px)',
                                            boxShadow: '2xl',
                                        }}
                                    >
                                        <Circle size={16} bg={colors.purple[100]}>
                                            <Icon as={feature.icon} color={colors.purple[500]} boxSize={8} />
                                        </Circle>
                                        <Heading size="md" color={colors.purple[700]}>
                                            {feature.title}
                                        </Heading>
                                        <Text color="gray.600" textAlign="center">
                                            {feature.description}
                                        </Text>
                                    </VStack>
                                </MotionBox>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* Featured Associations Section */}
            <Box py={20}>
                <Container maxW="container.xl">
                    <VStack spacing={16}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            textAlign="center"
                        >
                            <Heading
                                size="2xl"
                                color={colors.purple[700]}
                                mb={4}
                                position="relative"
                                _after={{
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '4px',
                                    borderRadius: 'full',
                                    bg: colors.purple[400],
                                }}
                            >
                                {t.featuredAssociations}
                            </Heading>
                        </MotionBox>

                        {/* Associations Carousel */}
                        <Box position="relative" width="full" overflow="hidden">
                            {/* Left Arrow */}
                            <IconButton
                                icon={<FaChevronLeft />}
                                onClick={prevSlide}
                                isDisabled={currentSlide === 0}
                                colorScheme="purple"
                                variant="solid"
                                size="lg"
                                isRound
                                aria-label="Previous slide"
                                position="absolute"
                                top="50%"
                                left="4"
                                transform="translateY(-50%)"
                                zIndex={2}
                                boxShadow="md"
                            />
                            {/* Carousel Slides */}
                            <Flex
                                transition="transform 0.5s ease"
                                transform={`translateX(-${currentSlide * 100}%)`}
                            >
                                {associations.map((association, index) => (
                                    <Box
                                        key={index}
                                        flex="0 0 100%"
                                        p={4}
                                    >
                                        <MotionBox
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            bg="white"
                                            p={8}
                                            borderRadius="2xl"
                                            boxShadow="xl"
                                            width="full"
                                            maxW="900px"
                                            mx="auto"
                                            overflow="hidden"
                                        >
                                            <Stack
                                                direction={{ base: 'column', md: 'row' }}
                                                spacing={8}
                                                align="center"
                                            >
                                                <Box
                                                    width={{ base: "full", md: "300px" }}
                                                    height={{ base: "200px", md: "250px" }}
                                                    position="relative"
                                                    borderRadius="xl"
                                                    overflow="hidden"
                                                    boxShadow="lg"
                                                >
                                                    <Image
                                                        src={association.imageFileName
                                                            ? `http://localhost:8080/images/${association.imageFileName}`
                                                            : '/images/default-association.jpg'
                                                        }
                                                        alt={association.name}
                                                        objectFit="contain"
                                                        bg="white"
                                                        w="full"
                                                        h="full"
                                                        p={2}
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
                                                </Box>
                                                <VStack
                                                    align="start"
                                                    spacing={6}
                                                    flex={1}
                                                >
                                                    <Heading
                                                        size="xl"
                                                        color={colors.purple[700]}
                                                    >
                                                        {association.name}
                                                    </Heading>
                                                    <HStack spacing={6}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FaBuilding} color={colors.purple[500]} />
                                                            <Text fontSize="lg">{association.ville}</Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Icon as={FaPhone} color={colors.purple[500]} />
                                                            <Text fontSize="lg">{association.responsablePhone}</Text>
                                                        </HStack>
                                                    </HStack>
                                                    <Button
                                                        colorScheme="purple"
                                                        size="lg"
                                                        rightIcon={<Icon as={FaArrowRight} />}
                                                        onClick={() => window.location.href = `/associations`}
                                                    >
                                                        {t.learnMore}
                                                    </Button>
                                                </VStack>
                                            </Stack>
                                        </MotionBox>
                                    </Box>
                                ))}
                            </Flex>
                            {/* Right Arrow */}
                            <IconButton
                                icon={<FaChevronRight />}
                                onClick={nextSlide}
                                isDisabled={currentSlide === associations.length - 1}
                                colorScheme="purple"
                                variant="solid"
                                size="lg"
                                isRound
                                aria-label="Next slide"
                                position="absolute"
                                top="50%"
                                right="4"
                                transform="translateY(-50%)"
                                zIndex={2}
                                boxShadow="md"
                            />
                            {/* Dots */}
                            <HStack
                                position="absolute"
                                bottom="-16"
                                left="50%"
                                transform="translateX(-50%)"
                                spacing={6}
                                zIndex={2}
                            >
                                <HStack spacing={3}>
                                    {associations.map((_, index) => (
                                        <Circle
                                            key={index}
                                            size={4}
                                            bg={currentSlide === index ? colors.purple[500] : 'gray.300'}
                                            cursor="pointer"
                                            onClick={() => setCurrentSlide(index)}
                                            transition="all 0.2s"
                                            _hover={{
                                                transform: 'scale(1.2)',
                                            }}
                                        />
                                    ))}
                                </HStack>
                            </HStack>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
