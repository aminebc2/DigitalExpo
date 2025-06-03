import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import {
    FaBuilding,
    FaArrowLeft,
    FaArrowRight,
    FaHandsHelping,
    FaHeart,
    FaPhone,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import GuestService from '../service/GuestService';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Translations object remains the same
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
        phone: "Téléphone"
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
        phone: "Phone"
    }
};

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [associations, setAssociations] = useState([]);
    const { language } = useLanguage();
    const t = translations[language];

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

    // Add new animation variants
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

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {/* Hero Section */}
            <Box
                position="relative"
                bg={headerBg}
                py={20}
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
                    <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        spacing={12}
                        align="center"
                        justify="space-between"
                    >
                        <VStack
                            spacing={6}
                            align={{ base: 'center', lg: 'start' }}
                            maxW={{ base: 'full', lg: '45%' }}
                            textAlign={{ base: 'center', lg: 'left' }}
                        >
                            <Heading
                                as="h1"
                                size="2xl"
                                color={accentColor}
                                fontWeight="bold"
                                lineHeight="shorter"
                            >
                                {t.welcome}
                            </Heading>
                            <Text fontSize="xl" color={textColor}>
                                {t.connectingCommunities}
                            </Text>
                            <Text color={textColor}>
                                {t.platformDescription}
                            </Text>
                        </VStack>

                        <MotionBox
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            maxW={{ base: 'full', lg: '50%' }}
                            position="relative"
                            px={4}
                        >
                            <Box
                                position="relative"
                                height={{ base: "450px", lg: "550px" }}
                                overflow="hidden"
                            >
                                <SimpleGrid
                                    columns={{ base: 2, md: 3 }}
                                    spacing={4}
                                    height="full"
                                    position="relative"
                                >
                                    {platformImages.map((image, index) => {
                                        // Calculate dynamic styles for each image
                                        const getImageStyles = () => {
                                            switch(index) {
                                                case 0:
                                                    return {
                                                        gridColumn: { base: "1 / 3", md: "1 / 3" },
                                                        height: { base: "200px", md: "280px" },
                                                        transform: "translateY(0px)"
                                                    };
                                                case 1:
                                                    return {
                                                        gridColumn: { base: "2", md: "3" },
                                                        height: { base: "180px", md: "220px" },
                                                        transform: "translateY(30px)"
                                                    };
                                                case 2:
                                                    return {
                                                        gridColumn: { base: "1", md: "1" },
                                                        height: { base: "160px", md: "200px" },
                                                        transform: "translateY(-20px)"
                                                    };
                                                case 3:
                                                    return {
                                                        gridColumn: { base: "2", md: "2 / 4" },
                                                        height: { base: "180px", md: "240px" },
                                                        transform: "translateY(-40px)"
                                                    };
                                                default:
                                                    return {};
                                            }
                                        };

                                        const styles = getImageStyles();

                                        return (
                                            <MotionBox
                                                key={index}
                                                variants={itemVariants}
                                                position="relative"
                                                {...styles}
                                                role="group"
                                            >
                                                <Box
                                                    position="relative"
                                                    height="full"
                                                    borderRadius="2xl"
                                                    overflow="hidden"
                                                    boxShadow={`0 4px 20px ${shadowColor}`}
                                                    transition="all 0.3s ease"
                                                    _hover={{
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: `0 12px 28px ${shadowColor}`
                                                    }}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`Platform showcase ${index + 1}`}
                                                        objectFit="cover"
                                                        w="full"
                                                        h="full"
                                                        transition="transform 0.3s ease"
                                                        _groupHover={{
                                                            transform: 'scale(1.05)'
                                                        }}
                                                    />
                                                    <Box
                                                        position="absolute"
                                                        inset="0"
                                                        bg="blackAlpha.200"
                                                        transition="all 0.3s ease"
                                                        _groupHover={{
                                                            bg: "blackAlpha.400"
                                                        }}
                                                    />
                                                </Box>
                                            </MotionBox>
                                        );
                                    })}
                                </SimpleGrid>

                                {/* Decorative Elements */}
                                <Circle
                                    size="60px"
                                    bg="purple.100"
                                    position="absolute"
                                    top="-20px"
                                    right="-30px"
                                    zIndex={-1}
                                />
                                <Circle
                                    size="40px"
                                    bg="purple.50"
                                    position="absolute"
                                    bottom="40px"
                                    left="-20px"
                                    zIndex={-1}
                                />
                                <Box
                                    position="absolute"
                                    width="120px"
                                    height="120px"
                                    border="2px solid"
                                    borderColor="purple.100"
                                    borderRadius="xl"
                                    bottom="-40px"
                                    right="40px"
                                    zIndex={-1}
                                    transform="rotate(15deg)"
                                />
                            </Box>
                        </MotionBox>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxW="container.xl" py={16}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <MotionBox
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        <VStack
                            bg={cardBg}
                            p={8}
                            borderRadius="xl"
                            spacing={4}
                            align="start"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                        >
                            <Circle size={12} bg="purple.100">
                                <Icon as={FaHandsHelping} boxSize={6} color="purple.500" />
                            </Circle>
                            <Heading size="md" color={accentColor}>
                                {t.easyCoordination}
                            </Heading>
                            <Text color={textColor}>
                                {t.coordinationDesc}
                            </Text>
                        </VStack>
                    </MotionBox>

                    <MotionBox
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        <VStack
                            bg={cardBg}
                            p={8}
                            borderRadius="xl"
                            spacing={4}
                            align="start"
                            boxShadow={`0 4px 20px ${shadowColor}`}
                        >
                            <Circle size={12} bg="purple.100">
                                <Icon as={FaHeart} boxSize={6} color="purple.500" />
                            </Circle>
                            <Heading size="md" color={accentColor}>
                                {t.communityImpact}
                            </Heading>
                            <Text color={textColor}>
                                {t.impactDesc}
                            </Text>
                        </VStack>
                    </MotionBox>
                </SimpleGrid>
            </Container>

            {/* Featured Associations Section - Enhanced Image Display */}
            <Box bg={headerBg} py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={12}>
                        <Heading
                            textAlign="center"
                            color={accentColor}
                            size="xl"
                            mb={8}
                        >
                            {t.featuredAssociations}
                        </Heading>

                        {associations.length > 0 && (
                            <Box position="relative" w="full">
                                <Flex
                                    direction={{ base: 'column', md: 'row' }}
                                    align="center"
                                    justify="center"
                                    gap={8}
                                >
                                    <IconButton
                                        icon={<FaChevronLeft />}
                                        onClick={prevSlide}
                                        position={{ base: 'relative', md: 'absolute' }}
                                        left={{ md: -12 }}
                                        top={{ md: '50%' }}
                                        transform={{ md: 'translateY(-50%)' }}
                                        colorScheme="purple"
                                        variant="ghost"
                                        fontSize="24px"
                                        isRound
                                        zIndex={2}
                                    />

                                    <ScaleFade in={true} initialScale={0.9}>
                                        <MotionBox
                                            bg={cardBg}
                                            borderRadius="3xl"
                                            overflow="hidden"
                                            boxShadow={`0 4px 20px ${shadowColor}`}
                                            maxW="800px"
                                            w="full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Stack
                                                direction={{ base: 'column', md: 'row' }}
                                                spacing={0}
                                            >
                                                <Box
                                                    position="relative"
                                                    minW={{ base: "full", md: "400px" }}
                                                    h={{ base: "300px", md: "400px" }}
                                                    overflow="hidden"
                                                >
                                                    <Image
                                                        src={associations[currentSlide].imageFileName
                                                            ? `http://localhost:8080/images/${associations[currentSlide].imageFileName}`
                                                            : '/images/default-association.jpg'
                                                        }
                                                        alt={associations[currentSlide].name}
                                                        objectFit="cover"
                                                        w="full"
                                                        h="full"
                                                        transition="0.3s transform ease"
                                                        _hover={{
                                                            transform: 'scale(1.1)'
                                                        }}
                                                        fallback={
                                                            <Flex
                                                                w="full"
                                                                h="full"
                                                                bg="purple.50"
                                                                align="center"
                                                                justify="center"
                                                            >
                                                                <Icon as={FaBuilding} boxSize={16} color="purple.200" />
                                                            </Flex>
                                                        }
                                                    />
                                                    <Box
                                                        position="absolute"
                                                        top={0}
                                                        left={0}
                                                        right={0}
                                                        h="100%"
                                                    />
                                                </Box>

                                                <VStack
                                                    align="start"
                                                    spacing={6}
                                                    p={8}
                                                    flex={1}
                                                    position="relative"
                                                    bg={cardBg}
                                                >
                                                    <Heading size="lg" color={accentColor}>
                                                        {associations[currentSlide].name}
                                                    </Heading>
                                                    <HStack spacing={2} color={textColor}>
                                                        <Icon as={FaBuilding} />
                                                        <Text>{t.city}: {associations[currentSlide].ville}</Text>
                                                    </HStack>
                                                    <HStack spacing={2} color={textColor}>
                                                        <Icon as={FaPhone} />
                                                        <Text>{t.phone}: {associations[currentSlide].responsablePhone}</Text>
                                                    </HStack>
                                                    <Badge
                                                        colorScheme="purple"
                                                        fontSize="sm"
                                                        px={4}
                                                        py={2}
                                                        borderRadius="full"
                                                    >
                                                        Association
                                                    </Badge>
                                                </VStack>
                                            </Stack>
                                        </MotionBox>
                                    </ScaleFade>

                                    <IconButton
                                        icon={<FaChevronRight />}
                                        onClick={nextSlide}
                                        position={{ base: 'relative', md: 'absolute' }}
                                        right={{ md: -12 }}
                                        top={{ md: '50%' }}
                                        transform={{ md: 'translateY(-50%)' }}
                                        colorScheme="purple"
                                        variant="ghost"
                                        fontSize="24px"
                                        isRound
                                        zIndex={2}
                                    />
                                </Flex>

                                <HStack justify="center" mt={8} spacing={2}>
                                    {associations.map((_, index) => (
                                        <Circle
                                            key={index}
                                            size={2}
                                            bg={index === currentSlide ? 'purple.500' : 'gray.300'}
                                            cursor="pointer"
                                            onClick={() => setCurrentSlide(index)}
                                            _hover={{ transform: 'scale(1.2)' }}
                                            transition="all 0.2s"
                                        />
                                    ))}
                                </HStack>
                            </Box>
                        )}
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
