import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    HStack,
    VStack,
    Circle,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaChevronRight } from 'react-icons/fa';

const defaultSteps = [
    {
        title: 'GESTION DES RÔLES ET ACCÈS',
        description:
            'Assurer une sécurité adaptée via des rôles définis selon les profils utilisateurs.',
    },
    {
        title: 'GESTION CENTRALISÉE DES DONNÉES',
        description:
            "Centraliser l’ensemble des informations relatives aux associations, bénévoles, sessions et demandes dans une plateforme unique.",
    },
    {
        title: 'GESTION OPTIMISÉE DES SESSIONS DE BÉNÉVOLAT',
        description:
            'Permettre la réservation et planification des sessions, faciliter l’inscription des bénévoles selon leurs disponibilités.',
    },
    {
        title: 'AUTOMATISATION DES PROCESSUS DE VALIDATION',
        description:
            'Accélérer les prises de décision entre associations et bénévoles.',
    },
    {
        title: 'ACCESSIBILITÉ ET EXPÉRIENCE UTILISATEUR',
        description:
            'Proposer une interface intuitive et responsive accessible sur tous les supports.',
    },
];

const StepCard = ({ index, title, description }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('#E9E3FF', 'gray.700');
    return (
        <VStack
            spacing={4}
            align="stretch"
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="lg"
            p={6}
            position="relative"
            borderWidth="1px"
            borderColor={border}
        >
            <HStack spacing={4} align="center">
                <Circle size={10} bg="#582C83" color="white" fontWeight="bold">
                    {index}
                </Circle>
                <Heading size="sm" color="#582C83" lineHeight={1.3}>
                    {title}
                </Heading>
            </HStack>
            <Box h="2px" bg="#E9E3FF" borderRadius="full" />
            <Text color="gray.600">{description}</Text>
        </VStack>
    );
};

const Arrow = () => (
    <HStack justify="center" align="center" h="full">
        <Icon as={FaChevronRight} color="#9C74FF" boxSize={6} />
    </HStack>
);

const ProcessSteps = ({ steps = defaultSteps }) => {
    return (
        <Box py={16} bg="#F8F5FF">
            <Container maxW="container.xl">
                <Heading size="xl" color="#582C83" textAlign="center" mb={10}>
                    Notre Processus Clé
                </Heading>

                {/* Desktop: steps with arrows; Mobile: grid */}
                <Box display={{ base: 'none', lg: 'block' }}>
                    <HStack spacing={4} align="stretch">
                        {steps.map((step, idx) => (
                            <React.Fragment key={idx}>
                                <Box flex="1">
                                    <StepCard index={idx + 1} title={step.title} description={step.description} />
                                </Box>
                                {idx < steps.length - 1 && <Arrow />}
                            </React.Fragment>
                        ))}
                    </HStack>
                </Box>

                <Box display={{ base: 'block', lg: 'none' }}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {steps.map((step, idx) => (
                            <StepCard
                                key={idx}
                                index={idx + 1}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </SimpleGrid>
                </Box>
            </Container>
        </Box>
    );
};

export default ProcessSteps;


