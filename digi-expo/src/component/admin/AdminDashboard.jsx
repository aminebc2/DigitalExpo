import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import AssociationManagement from './AssociationManagement';
import VolunteerManagement from './VolunteerManagement';
import VolunteerRequests from './VolunteerRequests';
import SessionManagement from './SessionManagement';
import {
    Box,
    Container,
    Heading,
    Button,
    SimpleGrid,
    VStack,
    useColorModeValue,
    Icon,
    Text,
    Circle,
    Flex,
    Slide,
    SlideFade
} from '@chakra-ui/react';
import {
    FaBuilding,
    FaUsers,
    FaUserPlus,
    FaCalendarAlt,
    FaTachometerAlt,
    FaHome
} from 'react-icons/fa';

// DXC Color Palette
const dxcColors = {
    primary: {
        purple: '#582C83',
        white: '#FFFFFF'
    },
    secondary: {
        lightGray: '#D8D9D9',
        mediumGray: '#97999B',
        darkGray: '#58595B'
    }
};

// Translations object
const translations = {
    fr: {
        pageTitle: "Tableau de Bord Admin",
        backToHome: "Retour à l'Accueil",
        tabs: {
            associations: "Associations",
            volunteers: "Bénévoles",
            volunteerRequests: "Demandes de Bénévolat",
            sessions: "Sessions"
        }
    },
    en: {
        pageTitle: "Admin Dashboard",
        backToHome: "Back to Home",
        tabs: {
            associations: "Associations",
            volunteers: "Volunteers",
            volunteerRequests: "Volunteer Requests",
            sessions: "Sessions"
        }
    }
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];
    const [activeTab, setActiveTab] = React.useState('associations');

    // Color mode values
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    const tabs = [
        {
            id: 'associations',
            icon: FaBuilding,
            label: t.tabs.associations,
            component: <AssociationManagement />
        },
        {
            id: 'volunteers',
            icon: FaUsers,
            label: t.tabs.volunteers,
            component: <VolunteerManagement />
        },
        {
            id: 'volunteerRequests',
            icon: FaUserPlus,
            label: t.tabs.volunteerRequests,
            component: <VolunteerRequests />
        },
        {
            id: 'sessions',
            icon: FaCalendarAlt,
            label: t.tabs.sessions,
            component: <SessionManagement />
        }
    ];

    return (
        <Box
            minH="100vh"
            bg={bgColor}
            position="relative"
            overflow="hidden"
            py={6}
        >
            <Container maxW="8xl" position="relative" zIndex={1}>
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <Flex justify="space-between" align="center" mb={4}>
                        <Flex align="center" gap={3}>
                            <Circle
                                size="40px"
                                bg={`${dxcColors.primary.purple}10`}
                                color={dxcColors.primary.purple}
                            >
                                <Icon as={FaTachometerAlt} boxSize={5} />
                            </Circle>
                            <Heading
                                size="lg"
                                color={dxcColors.primary.purple}
                            >
                                {t.pageTitle}
                            </Heading>
                        </Flex>
                        <Button
                            leftIcon={<Icon as={FaHome} boxSize={4} />}
                            onClick={() => navigate('/home')}
                            variant="ghost"
                            size="sm"
                            color={dxcColors.primary.purple}
                            _hover={{
                                bg: `${dxcColors.primary.purple}10`
                            }}
                        >
                            {t.backToHome}
                        </Button>
                    </Flex>

                    {/* Navigation Cards */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                        {tabs.map((tab) => (
                            <Box
                                key={tab.id}
                                as="button"
                                onClick={() => setActiveTab(tab.id)}
                                bg={activeTab === tab.id ? dxcColors.primary.purple : cardBg}
                                color={activeTab === tab.id ? 'white' : dxcColors.secondary.darkGray}
                                p={4}
                                borderRadius="xl"
                                boxShadow="md"
                                transition="all 0.2s"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                    bg: activeTab === tab.id ? dxcColors.primary.purple : `${dxcColors.primary.purple}10`
                                }}
                                border="1px solid"
                                borderColor={activeTab === tab.id ? 'transparent' : `${dxcColors.primary.purple}20`}
                            >
                                <VStack spacing={3}>
                                    <Circle
                                        size="45px"
                                        bg={activeTab === tab.id ? 'white' : `${dxcColors.primary.purple}10`}
                                        color={activeTab === tab.id ? dxcColors.primary.purple : dxcColors.primary.purple}
                                    >
                                        <Icon as={tab.icon} boxSize={5} />
                                    </Circle>
                                    <Text
                                        fontSize="md"
                                        fontWeight="medium"
                                    >
                                        {tab.label}
                                    </Text>
                                </VStack>
                            </Box>
                        ))}
                    </SimpleGrid>

                    {/* Content Area */}
                    <Box
                        bg={cardBg}
                        borderRadius="xl"
                        boxShadow="md"
                        p={5}
                        border="1px solid"
                        borderColor={`${dxcColors.primary.purple}20`}
                        minH="500px"
                    >
                        <SlideFade in={true} offsetY="20px">
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </SlideFade>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
