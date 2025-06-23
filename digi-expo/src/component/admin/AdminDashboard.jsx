import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
import AssociationManagement from './AssociationManagement';
import VolunteerManagement from './VolunteerManagement';
import VolunteerRequests from './VolunteerRequests';
import SessionManagement from './SessionManagement';
import AdminManagement from "./AdminManagement";
import {
    Box,
    Flex,
    Icon,
    Text,
    useColorModeValue,
    IconButton,
    VStack,
    HStack,
    useBreakpointValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Avatar,
    Tooltip,
    Divider,
    Button,
} from '@chakra-ui/react';
import {
    FaBuilding,
    FaUsers,
    FaUserPlus,
    FaCalendarAlt,
    FaBars,
    FaSignOutAlt,
    FaUserTie,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

const mainColor = "#582C83";

const translations = {
    fr: {
        dashboard: "Tableau de bord",
        admins: "Administrateurs",
        associations: "Associations",
        volunteers: "Bénévoles",
        requests: "Demandes",
        sessions: "Sessions",
        logout: "Déconnexion",
        collapse: "Réduire",
        expand: "Développer"
    },
    en: {
        dashboard: "Dashboard",
        admins: "Administrators",
        associations: "Associations",
        volunteers: "Volunteers",
        requests: "Requests",
        sessions: "Sessions",
        logout: "Logout",
        collapse: "Collapse",
        expand: "Expand"
    }
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { currentUser, logout } = useContext(AuthContext); // Update this line
    const t = translations[language];
    const [activeTab, setActiveTab] = React.useState('admins');
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, lg: false });


    const menuItems = [
        { id: 'admins', icon: FaUserTie, label: t.admins, component: <AdminManagement /> },
        { id: 'associations', icon: FaBuilding, label: t.associations, component: <AssociationManagement /> },
        { id: 'volunteers', icon: FaUsers, label: t.volunteers, component: <VolunteerManagement /> },
        { id: 'volunteerRequests', icon: FaUserPlus, label: t.requests, component: <VolunteerRequests /> },
        { id: 'sessions', icon: FaCalendarAlt, label: t.sessions, component: <SessionManagement /> },
    ];

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    const handleLogout = () => {
        logout();
        navigate('/login'); // or wherever you want to redirect after logout
    };

    const SidebarContent = () => (
        <Box
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            w={isCollapsed ? "80px" : "240px"}
            h="100vh"
            position="fixed"
            transition="width 0.2s"
        >
            <Flex direction="column" h="full" py={6}>
                {/* Header with Current User Info */}
                <Flex px={isCollapsed ? 4 : 6} align="center" mb={8}>
                    {!isCollapsed && (
                        <Avatar
                            size="md"
                            name={currentUser?.username || currentUser?.email || 'Admin'}
                            bg={mainColor}
                            color="white"
                            mr={3}
                        />
                    )}
                    {!isCollapsed && (
                        <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="sm">
                                {currentUser?.username || 'Admin'}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {currentUser?.email || 'admin@example.com'}
                            </Text>
                        </VStack>
                    )}
                </Flex>

                {/* Navigation Items */}
                <VStack spacing={2} flex={1} w="full">
                    {menuItems.map((item) => (
                        <Tooltip
                            key={item.id}
                            label={isCollapsed ? item.label : ""}
                            placement="right"
                            hasArrow
                        >
                            <Button
                                w="full"
                                px={isCollapsed ? 4 : 6}
                                py={3}
                                bg="transparent"
                                justifyContent={isCollapsed ? "center" : "flex-start"}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (isMobile) onClose();
                                }}
                                position="relative"
                                leftIcon={<Icon as={item.icon} boxSize={5} />}
                                color={activeTab === item.id ? mainColor : 'gray.500'}
                                _hover={{
                                    bg: hoverBg,
                                    color: mainColor,
                                }}
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    bg: mainColor,
                                    opacity: activeTab === item.id ? 1 : 0,
                                }}
                            >
                                {!isCollapsed && item.label}
                            </Button>
                        </Tooltip>
                    ))}
                </VStack>

                {/* Footer */}
                <VStack w="full" spacing={4} mt={4}>
                    <Divider />
                    <Button
                        w="full"
                        variant="ghost"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        px={isCollapsed ? 4 : 6}
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                    >
                        <Icon
                            as={isCollapsed ? FaChevronRight : FaChevronLeft}
                            boxSize={5}
                            color="gray.500"
                        />
                        {!isCollapsed && (
                            <Text ml={3}>{isCollapsed ? t.expand : t.collapse}</Text>
                        )}
                    </Button>
                    <Button
                        w="full"
                        variant="ghost"
                        onClick={handleLogout} // Updated to use handleLogout
                        px={isCollapsed ? 4 : 6}
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                        color="red.500"
                        _hover={{ bg: 'red.50' }}
                    >
                        <Icon as={FaSignOutAlt} boxSize={5} />
                        {!isCollapsed && <Text ml={3}>{t.logout}</Text>}
                    </Button>
                </VStack>
            </Flex>
        </Box>
    );

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {/* Mobile menu button */}
            {isMobile && (
                <IconButton
                    icon={<FaBars />}
                    position="fixed"
                    top={4}
                    left={4}
                    onClick={onOpen}
                    aria-label="Open Menu"
                    zIndex={20}
                    color="white"
                    bg={mainColor}
                    _hover={{ bg: 'purple.700' }}
                />
            )}

            {/* Sidebar */}
            {!isMobile && <SidebarContent />}

            {/* Mobile Drawer */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <SidebarContent />
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Box
                ml={isMobile ? 0 : (isCollapsed ? "80px" : "240px")}
                transition="margin-left 0.2s"
                p={6}
            >
                {menuItems.find(item => item.id === activeTab)?.component}
            </Box>
        </Box>
    );
};

export default AdminDashboard;