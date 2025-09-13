import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Flex,
    HStack,
    VStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Image,
    Text,
    Container,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

const MAIN_COLOR = "#582C83";

const Navbar = () => {
    const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
    const { language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isVolunteerMenuOpen, setIsVolunteerMenuOpen] = useState(false);
    const volunteerMenuRef = useRef();

    // Scroll effect for background
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderRoleBasedLinks = () => {
        if (!currentUser?.role) return null;
        switch (currentUser.role) {
            case 'ADMIN':
                return (
                    <>
                        <NavButton to="/associations" label={language === 'fr' ? 'Nos Associations Partenaires' : 'Our Partner Associations'} />
                        <NavButton to="/admin" label={language === 'fr' ? 'Tableau de bord' : 'Dashboard'} />
                        <NavButton to="/aboutus" label={language === 'fr' ? 'À Propos' : 'About Us'} />
                    </>
                );
            case 'BENEVOLE':
                return (
                    <>
                        <NavButton to="/volunteer/all-associations" label={language === 'fr' ? 'Nos Associations Partenaires' : 'Our Partner Associations'} />
                        <NavButton to="/volunteer/choose-session" label={language === 'fr' ? 'Animer une Session' : 'Animate a Session'} />
                        <NavButton to="/volunteer/sessions" label={language === 'fr' ? 'Mes Sessions' : 'My Sessions'} />
                        <NavButton to="/aboutus" label={language === 'fr' ? 'À Propos' : 'About Us'} />
                        <NavButton to="/volunteer/profile" label={language === 'fr' ? 'Profil' : 'Profile'} />
                    </>
                );
            case 'ASSOCIATION':
                return (
                    <>
                        <NavButton to="/associations" label={language === 'fr' ? 'Nos Associations Partenaires' : 'Our Partner Associations'} />
                        <NavButton to={currentUser?.id ? `/association/reserve/${currentUser.id}` : '#'} label={language === 'fr' ? 'Réserver' : 'Book'} />
                        <NavButton to="/association/sessions" label={language === 'fr' ? 'Sessions' : 'Sessions'} />
                        <NavButton to="/association/volunteers" label={language === 'fr' ? 'Bénévoles' : 'Volunteers'} />
                        <NavButton to="/aboutus" label={language === 'fr' ? 'À Propos' : 'About Us'} />
                        <NavButton to="/association/profile" label={language === 'fr' ? 'Profil' : 'Profile'} />
                    </>
                );
            default:
                return null;
        }
    };

    const renderVolunteerSubmenu = () => (
        <Box position="relative" ref={volunteerMenuRef}>
            <Button
                variant="ghost"
                color={MAIN_COLOR}
                _hover={{ bg: 'purple.50' }}
                fontSize="sm"
                fontWeight="500"
                rightIcon={<ChevronDownIcon />}
                px={2}
                py={1}
                h="36px"
                minW="unset"
                onClick={() => setIsVolunteerMenuOpen((open) => !open)}
            >
                {language === 'fr' ? 'Réseau de Bénévoles' : 'Volunteer Network'}
            </Button>
            {isVolunteerMenuOpen && (
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    bg="white"
                    boxShadow="lg"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    py={2}
                    minW="150px"
                    zIndex={1000}
                >
                    <Button
                        as={Link}
                        to="/register"
                        variant="ghost"
                        color={MAIN_COLOR}
                        _hover={{ bg: 'purple.50' }}
                        w="full"
                        justifyContent="flex-start"
                        px={3}
                        py={1}
                        fontSize="sm"
                        h="36px"
                        minW="unset"
                        onClick={() => setIsVolunteerMenuOpen(false)}
                    >
                        {language === 'fr' ? 'Devenir Bénévole' : 'Become a Volunteer'}
                    </Button>
                </Box>
            )}
        </Box>
    );

    // Main nav links
    const navLinks = isAuthenticated
        ? [
            <NavButton key="home" to="/home" label={language === 'fr' ? 'Accueil' : 'Home'} />,
            ...React.Children.toArray(renderRoleBasedLinks())
        ]
        : [
            <NavButton key="home" to="/home" label={language === 'fr' ? 'Accueil' : 'Home'} />,
            <NavButton key="asso" to="/associations" label={language === 'fr' ? 'Nos Associations Partenaires' : 'Our Partner Associations'} />,
            renderVolunteerSubmenu(),
            <NavButton key="media" to="/galerie-media" label={language === 'fr' ? 'Galerie Média' : 'Media Gallery'} />,
            <NavButton key="planning" to="/planning" label={language === 'fr' ? 'Planification' : 'Planning '} />,
            <NavButton key="about" to="/aboutus" label={language === 'fr' ? 'À Propos' : 'About Us'} />,
        ];

    // Right actions
    const rightActions = isAuthenticated ? (
        <Button
            variant="solid"
            color="white"
            bg={MAIN_COLOR}
            size="sm"
            onClick={handleLogout}
            _hover={{ bg: "#4A1D6B" }}
            fontWeight="bold"
            h="36px"
            px={5}
            borderRadius="full"
        >
            {language === 'fr' ? 'Déconnexion' : 'Logout'}
        </Button>
    ) : (
        <>
            <Button
                as={Link}
                to="/login"
                variant="ghost"
                color={MAIN_COLOR}
                size="sm"
                _hover={{ bg: 'purple.50' }}
                fontWeight="500"
                h="36px"
                px={3}
                borderRadius="full"
            >
                {language === 'fr' ? 'Connexion' : 'Login'}
            </Button>
            <Button
                as={Link}
                to="/register"
                bg={MAIN_COLOR}
                color="white"
                size="sm"
                _hover={{ bg: '#4A1D6B' }}
                fontWeight="bold"
                px={5}
                borderRadius="full"
                h="36px"
                boxShadow="md"
            >
                {language === 'fr' ? "S'inscrire" : 'Register'}
            </Button>
        </>
    );

    return (
        <Box
            position="sticky"
            top="0"
            zIndex="1000"
            w="100%"
            bg={scrolled ? "white" : "transparent"}
            boxShadow={scrolled ? "md" : "none"}
            transition="background 0.2s, box-shadow 0.2s"
        >
            <Box borderBottom={`3px solid ${MAIN_COLOR}`} w="100%" />
            <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
                <Flex
                    minH={{ base: "56px", md: "64px" }}
                    py={{ base: 1, md: 2 }}
                    align={'center'}
                    justify={'space-between'}
                >
                    {/* Logo and Title */}
                    <Flex align="center" minW={{ md: "220px", lg: "260px" }}>
                        <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Home">
                            <Flex align="center" gap={2}>
                                <Image
                                    src="/Logo.png"
                                    alt="Logo"
                                    h={{ base: "52px", md: "60px" }}   // Increased size here
                                    w={{ base: "52px", md: "60px" }}   // Increased size here
                                    objectFit="contain"
                                />
                                <Text
                                    color={MAIN_COLOR}
                                    fontWeight="extrabold"
                                    fontSize={{ base: 'xl', md: 'xl' }}
                                    letterSpacing="wide"
                                    whiteSpace="nowrap"
                                    ml={1}
                                >
                                    DIGITAL EXPLORERS
                                </Text>
                            </Flex>
                        </Link>
                    </Flex>
                    {/* Desktop Nav */}
                    <HStack
                        spacing={1}
                        flex={1}
                        justify="center"
                        display={{ base: 'none', md: 'flex' }}
                        ml={{ md: 6, lg: 10 }}
                    >
                        {navLinks}
                    </HStack>
                    {/* Right Actions */}
                    <HStack spacing={2} align="center" minW="180px" justify="flex-end" display={{ base: 'none', md: 'flex' }}>
                        {rightActions}
                        <Button
                            size="sm"
                            variant="ghost"
                            color={MAIN_COLOR}
                            onClick={toggleLanguage}
                            _hover={{ bg: 'purple.50' }}
                            fontWeight="500"
                            minW="32px"
                            aria-label="Toggle language"
                            h="36px"
                            borderRadius="full"
                        >
                            {language === 'fr' ? 'EN' : 'FR'}
                        </Button>
                    </HStack>
                    {/* Hamburger for mobile */}
                    <Flex display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onOpen}
                            icon={<HamburgerIcon w={6} h={6} />}
                            variant={'ghost'}
                            color={MAIN_COLOR}
                            aria-label={'Toggle Navigation'}
                            _hover={{ bg: 'purple.50' }}
                            size="lg"
                        />
                    </Flex>
                </Flex>
            </Container>
            {/* Mobile Drawer */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody pt={10}>
                        <VStack spacing={2} align="stretch">
                            {navLinks.map((link, idx) =>
                                React.isValidElement(link)
                                    ? React.cloneElement(link, { key: idx, onClick: onClose })
                                    : null
                            )}
                            <Box pt={4}>
                                <HStack spacing={2}>
                                    {rightActions}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        color={MAIN_COLOR}
                                        onClick={() => { toggleLanguage(); onClose(); }}
                                        _hover={{ bg: 'purple.50' }}
                                        fontWeight="500"
                                        minW="32px"
                                        aria-label="Toggle language"
                                        h="36px"
                                        borderRadius="full"
                                    >
                                        {language === 'fr' ? 'EN' : 'FR'}
                                    </Button>
                                </HStack>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

// Helper for nav buttons
const NavButton = ({ to, label, onClick }) => (
    <Button
        as={Link}
        to={to}
        variant="ghost"
        color={MAIN_COLOR}
        _hover={{ bg: `${MAIN_COLOR}22`, color: MAIN_COLOR, fontWeight: "bold" }}
        fontSize="sm"
        fontWeight="500"
        onClick={onClick}
        borderRadius="full"
        px={4}
        h="36px"
        minW="unset"
        transition="all 0.15s"
    >
        {label}
    </Button>
);

export default Navbar;