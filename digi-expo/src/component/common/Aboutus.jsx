import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Stat,
    StatNumber,
    StatLabel,
    VStack,
    Icon,
    useColorModeValue,
    Flex,
    Image,
    Circle,
    Divider,
    chakra,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { FaUsers, FaGlobe, FaLightbulb, FaHandsHelping } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

const AboutUs = () => {
    const { language } = useLanguage();
    const bgGradient = useColorModeValue(
        'linear(to-br, purple.50, white, purple.50)',
        'linear(to-br, gray.900, gray.800)'
    );
    const cardBg = useColorModeValue('white', 'gray.700');
    const statBg = useColorModeValue('white', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const headingColor = useColorModeValue('purple.900', 'white');
    const accentColor = useColorModeValue('purple.500', 'purple.300');

    const translations = {
        title: language === 'fr' ? 'Digital Explorers' : 'Digital Explorers',
        mission: language === 'fr'
            ? "Digital Explorers est un programme national de responsabilité sociétale d'entreprise, qui vise à initier les enfants en situation de précarité ou en situation de handicap, mental et/ou physique, aux bases du digital et du coding."
            : "Digital Explorers is a national corporate social responsibility program that aims to introduce children in precarious situations or with mental and/or physical disabilities to the basics of digital technology and coding.",
        features: [
            {
                icon: FaUsers,
                title: language === 'fr' ? 'Bénévoles Engagés' : 'Committed Volunteers',
                text: language === 'fr'
                    ? "Les sessions sont assurées bénévolement par nos collaborateurs engagés, directement au sein de nos 8 associations partenaires."
                    : "Sessions are conducted voluntarily by our committed collaborators, directly within our 8 partner associations.",
                delay: 0.3
            },
            {
                icon: FaGlobe,
                title: language === 'fr' ? 'Impact Territorial' : 'Territorial Impact',
                text: language === 'fr'
                    ? "Ces partenariats nous permettent de toucher un plus grand nombre d'enfants à travers plusieurs régions du Maroc, renforçant ainsi notre impact social et territorial."
                    : "These partnerships allow us to reach a larger number of children across several regions of Morocco, strengthening our social and territorial impact.",
                delay: 0.5
            }
        ],
        stats: [
            {
                number: "8",
                label: language === 'fr' ? 'Associations Partenaires' : 'Partner Associations'
            },
            {
                number: "7",
                label: language === 'fr' ? 'Villes' : 'Cities'
            },
            {
                number: "100+",
                label: language === 'fr' ? 'Bénévoles' : 'Volunteers'
            },
            {
                number: "500+",
                label: language === 'fr' ? 'Enfants Impactés' : 'Children Impacted'
            }
        ]
    };

    const floatingAnimation = {
        y: ['-10px', '10px'],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
        },
    };

    return (
        <Box bgGradient={bgGradient} minH="100vh" py={20} overflow="hidden">
            {/* Decorative Elements */}
            <Circle
                position="absolute"
                top="5%"
                right="10%"
                size="300px"
                bg="purple.50"
                filter="blur(60px)"
                opacity={0.6}
            />
            <Circle
                position="absolute"
                bottom="5%"
                left="10%"
                size="400px"
                bg="purple.50"
                filter="blur(80px)"
                opacity={0.4}
            />

            <Container maxW="container.xl" position="relative">
                {/* Hero Section */}
                <VStack spacing={12} textAlign="center" mb={20}>
                    <ChakraBox
                        animate={floatingAnimation}
                        display="inline-block"
                    >
                        <Image
                            src="/Logo.png"
                            alt="Digital Explorers Logo"
                            w={["180px", "220px"]}
                            mx="auto"
                            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                        />
                    </ChakraBox>
                    <ChakraBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Heading
                            as="h1"
                            size="2xl"
                            color={headingColor}
                            fontWeight="bold"
                            letterSpacing="tight"
                            bgGradient="linear(to-r, purple.400, purple.600)"
                            bgClip="text"
                            mb={4}
                        >
                            {translations.title}
                        </Heading>
                        <Divider w="100px" borderColor={accentColor} mx="auto" mb={6} />
                    </ChakraBox>
                </VStack>

                {/* Mission Statement */}
                <ChakraBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    bg={cardBg}
                    rounded="2xl"
                    shadow="2xl"
                    p={10}
                    mb={20}
                    mx="auto"
                    maxW="4xl"
                    position="relative"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: 'linear-gradient(135deg, purple.50 0%, transparent 50%)',
                        borderRadius: '1rem',
                        opacity: 0.1,
                    }}
                >
                    <Text
                        fontSize={["lg", "xl"]}
                        color={textColor}
                        lineHeight="tall"
                        textAlign="center"
                        position="relative"
                        zIndex={1}
                    >
                        {translations.mission}
                    </Text>
                </ChakraBox>

                {/* Features Grid */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} maxW="6xl" mx="auto" mb={20}>
                    {translations.features.map((feature, index) => (
                        <ChakraBox
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            bg={cardBg}
                            rounded="2xl"
                            shadow="xl"
                            p={8}
                            position="relative"
                            overflow="hidden"
                            _hover={{
                                transform: 'translateY(-5px)',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <Circle
                                size="120px"
                                position="absolute"
                                top="-20px"
                                right="-20px"
                                bg="purple.50"
                                opacity={0.3}
                            />
                            <Flex direction="column" align="center" position="relative">
                                <Circle
                                    size="80px"
                                    bg="purple.50"
                                    mb={6}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Icon as={feature.icon} w={8} h={8} color={accentColor} />
                                </Circle>
                                <Heading size="lg" mb={4} color={headingColor}>
                                    {feature.title}
                                </Heading>
                                <Text color={textColor} textAlign="center">
                                    {feature.text}
                                </Text>
                            </Flex>
                        </ChakraBox>
                    ))}
                </SimpleGrid>

                {/* Statistics Section */}
                <ChakraBox
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <SimpleGrid
                        columns={{ base: 2, md: 4 }}
                        spacing={8}
                        maxW="4xl"
                        mx="auto"
                    >
                        {translations.stats.map((stat, index) => (
                            <ChakraBox
                                key={index}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <Stat
                                    px={6}
                                    py={8}
                                    bg={statBg}
                                    rounded="2xl"
                                    textAlign="center"
                                    position="relative"
                                    overflow="hidden"
                                    shadow="lg"
                                    _hover={{
                                        transform: 'translateY(-5px)',
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    <Circle
                                        size="100px"
                                        position="absolute"
                                        top="-20px"
                                        right="-20px"
                                        bg="purple.50"
                                        opacity={0.3}
                                    />
                                    <StatNumber
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        color={accentColor}
                                        mb={2}
                                        position="relative"
                                    >
                                        {stat.number}
                                    </StatNumber>
                                    <StatLabel
                                        fontSize="sm"
                                        color={textColor}
                                        position="relative"
                                    >
                                        {stat.label}
                                    </StatLabel>
                                </Stat>
                            </ChakraBox>
                        ))}
                    </SimpleGrid>
                </ChakraBox>
            </Container>
        </Box>
    );
};

export default AboutUs;
