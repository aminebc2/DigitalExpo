import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    SimpleGrid,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaListAlt,
    FaUserClock,
    FaChartLine
} from 'react-icons/fa';

const DashboardCard = ({ icon, title, description, to, isActive }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box
            as={RouterLink}
            to={to}
            bg={cardBg}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={isActive ? 'purple.400' : borderColor}
            p={6}
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'purple.400',
                textDecoration: 'none'
            }}
        >
            <VStack spacing={4} align="start">
                <Icon
                    as={icon}
                    boxSize={8}
                    color="purple.500"
                />
                <Heading
                    size="md"
                    color={useColorModeValue('gray.700', 'white')}
                >
                    {title}
                </Heading>
                <Text color={textColor}>
                    {description}
                </Text>
            </VStack>
        </Box>
    );
};

const VolunteerDashboard = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headingColor = useColorModeValue('purple.600', 'purple.300');
    const subTextColor = useColorModeValue('gray.600', 'gray.400');

    const dashboardItems = [
        {
            icon: FaUserClock,
            title: "Disponibilités",
            description: "Gérez vos jours disponibles pour le bénévolat",
            to: "/volunteer/available-days"
        },
        {
            icon: FaCalendarAlt,
            title: "Sessions",
            description: "Consultez et gérez vos sessions assignées",
            to: "/volunteer/sessions"
        },
        {
            icon: FaListAlt,
            title: "Activités",
            description: "Suivez vos activités récentes et à venir",
            to: "/volunteer/activities"
        },
        {
            icon: FaChartLine,
            title: "Statistiques",
            description: "Visualisez vos statistiques de bénévolat",
            to: "/volunteer/stats"
        }
    ];

    return (
        <Box
            minH="100vh"
            bg={bgColor}
            pt={{ base: 10, md: 20 }}
            pb={{ base: 10, md: 20 }}
        >
            <Container maxW="7xl">
                <VStack spacing={6} mb={16} textAlign="center">
                    <Heading
                        as="h1"
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="bold"
                        color={headingColor}
                        letterSpacing="tight"
                    >
                        Tableau de Bord Bénévole
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={subTextColor}
                        maxW="2xl"
                    >
                        Gérez vos disponibilités, consultez vos sessions et suivez vos activités de bénévolat
                    </Text>
                </VStack>

                <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacing={8}
                    px={{ base: 4, md: 0 }}
                >
                    {dashboardItems.map((item, index) => (
                        <DashboardCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            to={item.to}
                            isActive={window.location.pathname === item.to}
                        />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default VolunteerDashboard;
