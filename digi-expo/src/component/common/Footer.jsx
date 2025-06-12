import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    SimpleGrid,
    Stack,
    Text,
    Image,
    Heading,
    VStack,
    HStack,
    Icon,
    Divider,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaHeart,
} from 'react-icons/fa';

const translations = {
    fr: {
        navigation: {
            home: "Accueil",
            associations: "Associations",
            aboutUs: "À Propos",
            contact: "Contact"
        },
        aboutUs: {
            title: "À Propos de Nous",
            mission: "Notre Mission",
            missionText: "Faciliter la connexion entre les associations et les bénévoles pour créer un impact social positif.",
            vision: "Notre Vision",
            visionText: "Créer une communauté dynamique où chaque action bénévole compte.",
            description: {
                part1: "Digital Explorers est un programme national de responsabilité sociétale d'entreprise, qui vise à initier les enfants en situation de précarité ou en situation de handicap, mental et/ou physique, aux bases du digital et du coding.",
                part2: "Les sessions sont assurées bénévolement par nos collaborateurs engagés, directement au sein de nos 8 associations partenaires réparties sur 7 villes.",
                part3: "Ces partenariats nous permettent de toucher un plus grand nombre d'enfants à travers plusieurs régions du Maroc, renforçant ainsi notre impact social et territorial."
            }
        },
        contact: {
            title: "Contactez-Nous",
            address: "Technopolis, Bâtiment B9, Rabat 11100",
            phone: "+212 777-052721",
            email: "amina.bellaoui@dxc.com"
        },
        legal: {
            privacy: "Confidentialité",
            terms: "Conditions",
            copyright: "© 2025 DXC Technology Company. Tous droits réservés."
        }
    },
    en: {
        navigation: {
            home: "Home",
            associations: "Associations",
            aboutUs: "About Us",
            contact: "Contact"
        },
        aboutUs: {
            title: "About Us",
            mission: "Our Mission",
            missionText: "To facilitate connections between associations and volunteers to create positive social impact.",
            vision: "Our Vision",
            visionText: "To create a dynamic community where every volunteer action matters.",
            description: {
                part1: "Digital Explorers is a national corporate social responsibility program that aims to introduce children in precarious situations or with mental and/or physical disabilities to the basics of digital technology and coding.",
                part2: "Sessions are conducted voluntarily by our committed employees, directly within our 8 partner associations spread across 7 cities.",
                part3: "These partnerships allow us to reach a greater number of children across several regions of Morocco, thus strengthening our social and territorial impact."
            }
        },
        contact: {
            title: "Contact Us",
            address: "Technopolis, Building B9, Rabat 11100",
            phone: "+212 777-052721",
            email: "amina.bellaoui@dxc.com"
        },
        legal: {
            privacy: "Privacy",
            terms: "Terms",
            copyright: "© 2025 DXC Technology Company. All rights reserved."
        }
    }
};

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language];

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const borderColor = useColorModeValue('purple.100', 'purple.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('purple.600', 'purple.300');

    return (
        <Box
            bg={bgColor}
            color={textColor}
            borderTop="4px solid"
            borderColor={borderColor}
        >
            <Container maxW="container.xl" py={10}>
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 4 }}
                    spacing={8}
                    mb={10}
                >
                    {/* Company Info */}
                    <VStack align="start" spacing={4}>
                        <Image
                            src="/Logo.png"
                            alt="DXC Technology"
                            h="50px"
                            mb={4}
                        />
                        <VStack align="start" spacing={4}>
                            <Text fontSize="sm" lineHeight="tall">
                                {t.aboutUs.description.part1}
                            </Text>
                            <Text fontSize="sm" lineHeight="tall">
                                {t.aboutUs.description.part2}
                            </Text>
                            <Text fontSize="sm" lineHeight="tall">
                                {t.aboutUs.description.part3}
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Quick Links */}
                    <VStack align="start" spacing={4}>
                        <Heading size="md" color={headingColor}>
                            {t.navigation.aboutUs}
                        </Heading>
                        <Button
                            as={Link}
                            to="/home"
                            variant="link"
                            color={textColor}
                            _hover={{ color: headingColor }}
                        >
                            {t.navigation.home}
                        </Button>
                        <Button
                            as={Link}
                            to="/associations"
                            variant="link"
                            color={textColor}
                            _hover={{ color: headingColor }}
                        >
                            {t.navigation.associations}
                        </Button>
                        <Button
                            as={Link}
                            to="/aboutus"
                            variant="link"
                            color={textColor}
                            _hover={{ color: headingColor }}
                        >
                            {t.navigation.aboutUs}
                        </Button>
                    </VStack>

                    {/* Mission & Vision */}
                    <VStack align="start" spacing={4}>
                        <Heading size="md" color={headingColor}>
                            {t.aboutUs.mission}
                        </Heading>
                        <Text fontSize="sm">
                            {t.aboutUs.missionText}
                        </Text>
                        <Heading size="md" color={headingColor} mt={4}>
                            {t.aboutUs.vision}
                        </Heading>
                        <Text fontSize="sm">
                            {t.aboutUs.visionText}
                        </Text>
                    </VStack>

                    {/* Contact Info */}
                    <VStack align="start" spacing={4}>
                        <Heading size="md" color={headingColor}>
                            {t.contact.title}
                        </Heading>
                        <HStack spacing={3}>
                            <Icon as={FaMapMarkerAlt} color={headingColor} />
                            <Text fontSize="sm">{t.contact.address}</Text>
                        </HStack>
                        <HStack spacing={3}>
                            <Icon as={FaPhone} color={headingColor} />
                            <Text fontSize="sm">{t.contact.phone}</Text>
                        </HStack>
                        <HStack spacing={3}>
                            <Icon as={FaEnvelope} color={headingColor} />
                            <Text fontSize="sm">{t.contact.email}</Text>
                        </HStack>
                    </VStack>
                </SimpleGrid>

                <Divider borderColor={borderColor} my={6} />

                {/* Footer Bottom */}
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    spacing={4}
                >
                    <HStack spacing={4}>
                        <Button
                            variant="link"
                            size="sm"
                            color={textColor}
                            _hover={{ color: headingColor }}
                        >
                            {t.legal.privacy}
                        </Button>
                        <Button
                            variant="link"
                            size="sm"
                            color={textColor}
                            _hover={{ color: headingColor }}
                        >
                            {t.legal.terms}
                        </Button>
                    </HStack>
                    <HStack spacing={2}>
                        <Text fontSize="sm">
                            {t.legal.copyright}
                        </Text>
                        <Icon as={FaHeart} color="red.400" boxSize={3} />
                    </HStack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;