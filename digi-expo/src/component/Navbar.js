import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Image,
    Text,
    useColorModeValue,
    Container,
    Collapse
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Navbar = () => {
    const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
    const { language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const { isOpen, onToggle } = useDisclosure();

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
                        <Button
                            as={Link}
                            to="/associations"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Associations' : 'Associations'}
                        </Button>
                        <Button
                            as={Link}
                            to="/admin"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                        </Button>
                        <Button
                            as={Link}
                            to="/aboutus"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'À Propos' : 'About Us'}
                        </Button>
                    </>
                );
            case 'BENEVOLE':
                return (
                    <>
                        <Button
                            as={Link}
                            to="/volunteer/all-associations"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Associations' : 'Associations'}
                        </Button>
                        <Button
                            as={Link}
                            to="/volunteer/sessions"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Mes Sessions' : 'My Sessions'}
                        </Button>
                        <Button
                            as={Link}
                            to="/aboutus"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'À Propos' : 'About Us'}
                        </Button>
                        <Button
                            as={Link}
                            to="/volunteer/profile"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Profil' : 'Profile'}
                        </Button>
                    </>
                );
            case 'ASSOCIATION':
                return (
                    <>
                        <Button
                            as={Link}
                            to="/associations"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Associations' : 'Associations'}
                        </Button>
                        <Button
                            as={Link}
                            to={currentUser?.id ? `/association/reserve/${currentUser.id}` : '#'}
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Réserver' : 'Book'}
                        </Button>
                        <Button
                            as={Link}
                            to="/association/sessions"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Sessions' : 'Sessions'}
                        </Button>
                        <Button
                            as={Link}
                            to="/association/volunteers"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Bénévoles' : 'Volunteers'}
                        </Button>
                        <Button
                            as={Link}
                            to="/aboutus"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'À Propos' : 'About Us'}
                        </Button>
                        <Button
                            as={Link}
                            to="/association/profile"
                            variant="ghost"
                            color="purple.600"
                            _hover={{ bg: 'purple.50' }}
                        >
                            {language === 'fr' ? 'Profil' : 'Profile'}
                        </Button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            borderBottom="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            position="sticky"
            top="0"
            zIndex="1000"
            backdropFilter="blur(8px)"
        >
            <Container maxW="container.xl">
                <Flex
                    minH={'60px'}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    align={'center'}
                    justify={'space-between'}
                >
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}
                    >
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>

                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <Link to="/home" style={{ textDecoration: 'none' }}>
                            <Flex align="center">
                                <Image
                                    src="/Logo.png"
                                    alt="Logo"
                                    h="40px"
                                    mr={2}
                                />
                                <Text
                                    color="purple.600"
                                    fontWeight="bold"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    display={{ base: 'none', md: 'block' }}
                                >
                                    DXC CDG DIGITAL EXPO
                                </Text>
                            </Flex>
                        </Link>

                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <HStack spacing={4}>
                                {isAuthenticated ? (
                                    <>
                                        <Button
                                            as={Link}
                                            to="/home"
                                            variant="ghost"
                                            color="purple.600"
                                            _hover={{ bg: 'purple.50' }}
                                        >
                                            {language === 'fr' ? 'Accueil' : 'Home'}
                                        </Button>
                                        {renderRoleBasedLinks()}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            as={Link}
                                            to="/home"
                                            variant="ghost"
                                            color="purple.600"
                                            _hover={{ bg: 'purple.50' }}
                                        >
                                            {language === 'fr' ? 'Accueil' : 'Home'}
                                        </Button>
                                        <Button
                                            as={Link}
                                            to="/associations"
                                            variant="ghost"
                                            color="purple.600"
                                            _hover={{ bg: 'purple.50' }}
                                        >
                                            {language === 'fr' ? 'Associations' : 'Associations'}
                                        </Button>
                                        <Button
                                            as={Link}
                                            to="/aboutus"
                                            variant="ghost"
                                            color="purple.600"
                                            _hover={{ bg: 'purple.50' }}
                                        >
                                            {language === 'fr' ? 'About Us' : 'About Us'}
                                        </Button>
                                    </>
                                )}
                            </HStack>
                        </Flex>
                    </Flex>

                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={6}
                        align="center"
                    >
                        {isAuthenticated ? (
                            <>
                                <Button
                                    variant="outline"
                                    colorScheme="purple"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    {language === 'fr' ? 'Déconnexion' : 'Logout'}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="ghost"
                                    color="purple.600"
                                    size="sm"
                                >
                                    {language === 'fr' ? 'Connexion' : 'Login'}
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    colorScheme="purple"
                                    size="sm"
                                >
                                    {language === 'fr' ? "S'inscrire" : 'Register'}
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            color="purple.600"
                            onClick={toggleLanguage}
                        >
                            {language === 'fr' ? 'EN' : 'FR'}
                        </Button>
                    </Stack>
                </Flex>

                <Collapse in={isOpen} animateOpacity>
                    <Stack
                        bg={useColorModeValue('white', 'gray.800')}
                        p={4}
                        display={{ md: 'none' }}
                    >
                        {isAuthenticated ? (
                            <>
                                <Button
                                    as={Link}
                                    to="/home"
                                    variant="ghost"
                                    color="purple.600"
                                    w="full"
                                    onClick={onToggle}
                                >
                                    {language === 'fr' ? 'Accueil' : 'Home'}
                                </Button>
                                {renderRoleBasedLinks()}
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/home"
                                    variant="ghost"
                                    color="purple.600"
                                    w="full"
                                    onClick={onToggle}
                                >
                                    {language === 'fr' ? 'Accueil' : 'Home'}
                                </Button>
                                <Button
                                    as={Link}
                                    to="/associations"
                                    variant="ghost"
                                    color="purple.600"
                                    w="full"
                                    onClick={onToggle}
                                >
                                    {language === 'fr' ? 'Associations' : 'Associations'}
                                </Button>
                                <Button
                                    as={Link}
                                    to="/aboutus"
                                    variant="ghost"
                                    color="purple.600"
                                    w="full"
                                    onClick={onToggle}
                                >
                                    {language === 'fr' ? 'About Us' : 'About Us'}
                                </Button>
                            </>
                        )}
                    </Stack>
                </Collapse>
            </Container>
        </Box>
    );
};

export default Navbar;