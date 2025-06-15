import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminService from '../../service/AdminService';
import { useLanguage } from '../../context/LanguageContext';
import {
    Box,
    Container,
    Button,
    IconButton,
    useToast,
    Flex,
    Text,
    Stack,
    HStack,
    VStack,
    Select,
    useColorModeValue,
    Spinner,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Heading,
    Grid,
    GridItem,
    Card,
    CardBody,
    Avatar,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Progress,
    Tooltip,
    Circle
} from '@chakra-ui/react';
import {
    FaUserTie,
    FaSearch,
    FaCheck,
    FaTimes,
    FaEllipsisV,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaTrashAlt,
    FaBuilding,
    FaListUl,
    FaThLarge,
    FaFilter,
    FaCalendarAlt
} from 'react-icons/fa';

const translations = {
    fr: {
        title: "Demandes de Bénévoles",
        subtitle: "Gérer et suivre les candidatures des bénévoles",
        gridView: "Grille",
        listView: "Liste",
        totalRequests: "Total des Demandes",
        pendingRequests: "En Attente",
        approvedRequests: "Approuvées",
        rejectedRequests: "Rejetées",
        search: "Rechercher des bénévoles ou des associations...",
        allStatus: "Tous les Statuts",
        pending: "En Attente",
        approved: "Approuvé",
        rejected: "Rejeté",
        clearFilters: "Effacer les Filtres",
        approve: "Approuver",
        reject: "Rejeter",
        actions: "Actions",
        markAsPending: "Marquer comme En Attente",
        markAsApproved: "Marquer comme Approuvé",
        markAsRejected: "Marquer comme Rejeté",
        statusUpdated: "Statut mis à jour",
        errorUpdatingStatus: "Erreur lors de la mise à jour du statut",
        errorFetchingRequests: "Erreur lors de la récupération des demandes",
        noRequests: "Aucune demande de bénévole trouvée",
        noMatchingRequests: "Aucune demande ne correspond à vos critères de recherche",
        loading: "Chargement des demandes...",
        priorityLevel: "Niveau de Priorité",
        dateSubmitted: "Date de Soumission",
        na: "N/D",
        language: "Langue",
        // New translations for delete
        delete: "Supprimer",
        deleteConfirmation: "Êtes-vous sûr de vouloir supprimer cette demande ?",
        deletedSuccess: "Demande supprimée avec succès",
        errorDeleting: "Erreur lors de la suppression"
    },
    en: {
        title: "Volunteer Requests",
        subtitle: "Manage and track volunteer applications",
        gridView: "Grid",
        listView: "List",
        totalRequests: "Total Requests",
        pendingRequests: "Pending",
        approvedRequests: "Approved",
        rejectedRequests: "Rejected",
        search: "Search volunteers or associations...",
        allStatus: "All Status",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        clearFilters: "Clear Filters",
        approve: "Approve",
        reject: "Reject",
        actions: "Actions",
        markAsPending: "Mark as Pending",
        markAsApproved: "Mark as Approved",
        markAsRejected: "Mark as Rejected",
        statusUpdated: "Status updated",
        errorUpdatingStatus: "Error updating status",
        errorFetchingRequests: "Error fetching requests",
        noRequests: "No volunteer requests found",
        noMatchingRequests: "No requests match your search criteria",
        loading: "Loading requests...",
        priorityLevel: "Priority Level",
        dateSubmitted: "Date Submitted",
        na: "N/A",
        language: "Language",
        // New translations for delete
        delete: "Delete",
        deleteConfirmation: "Are you sure you want to delete this request?",
        deletedSuccess: "Request deleted successfully",
        errorDeleting: "Error deleting request"
    }
};

// Move getStatusColor outside to prevent re-creation
const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'APPROVED':
            return { color: 'green.500', bg: 'green.50' };
        case 'REJECTED':
            return { color: 'red.500', bg: 'red.50' };
        default:
            return { color: 'orange.500', bg: 'orange.50' };
    }
};

// Optimized RequestCard component with memoization
const RequestCard = React.memo(({
                                    request,
                                    t,
                                    handleStatusUpdate,
                                    handleDeleteRequest,
                                    cardBg,
                                    borderColor,
                                    mutedText,
                                    language
                                }) => {
    const formattedDate = new Date().toLocaleDateString(
        language === 'fr' ? 'fr-FR' : 'en-US'
    );

    return (
        <Card
            bg={cardBg}
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: 'dxc.purple.300'
            }}
            transition="all 0.2s"
        >
            <CardBody>
                <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                        <HStack spacing={3}>
                            <Avatar
                                size="md"
                                name={request.volunteer?.username}
                                src={request.volunteer?.avatar}
                                bg="dxc.purple.100"
                                icon={<FaUserTie />}
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="lg">
                                    {request.volunteer?.username || t.na}
                                </Text>
                                <Text fontSize="sm" color={mutedText}>
                                    <Icon as={FaBuilding} mr={1} />
                                    {request.association?.name || t.na}
                                </Text>
                            </Box>
                        </HStack>
                        <Circle
                            size="10"
                            bg={getStatusColor(request.status).bg}
                            color={getStatusColor(request.status).color}
                        >
                            <Icon as={
                                request.status?.toUpperCase() === 'APPROVED' ? FaCheckCircle :
                                    request.status?.toUpperCase() === 'REJECTED' ? FaTimesCircle :
                                        FaClock
                            } boxSize={5} />
                        </Circle>
                    </HStack>

                    <Box py={2}>
                        <HStack spacing={4} fontSize="sm" color={mutedText}>
                            <HStack>
                                <Icon as={FaCalendarAlt} />
                                <Text>{formattedDate}</Text>
                            </HStack>
                            <Badge
                                colorScheme={
                                    request.status?.toUpperCase() === 'APPROVED' ? 'green' :
                                        request.status?.toUpperCase() === 'REJECTED' ? 'red' :
                                            'orange'
                                }
                                borderRadius="full"
                                px={3}
                                py={1}
                            >
                                {request.status?.toUpperCase() === 'APPROVED' ? t.approved :
                                    request.status?.toUpperCase() === 'REJECTED' ? t.rejected :
                                        t.pending}
                            </Badge>
                        </HStack>
                    </Box>

                    <HStack justify="space-between" pt={2}>
                        {request.status?.toUpperCase() === 'PENDING' ? (
                            <HStack spacing={1}>
                                <Button
                                    size="sm"
                                    colorScheme="purple"
                                    leftIcon={<Icon as={FaCheck} />}
                                    onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                    borderRadius="full"
                                >
                                    {t.approve}
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    leftIcon={<Icon as={FaTimes} />}
                                    onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                    borderRadius="full"
                                >
                                    {t.reject}
                                </Button>
                                <IconButton
                                    aria-label={t.delete}
                                    icon={<FaTrashAlt />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleDeleteRequest(request.id)}
                                />
                            </HStack>
                        ) : (
                            <Menu isLazy> {/* Add lazy loading for menu */}
                                <MenuButton
                                    as={Button}
                                    size="sm"
                                    variant="outline"
                                    colorScheme="purple"
                                    borderRadius="full"
                                >
                                    <FaEllipsisV />
                                </MenuButton>
                                <MenuList minW="150px">
                                    <MenuItem
                                        icon={<FaClock />}
                                        onClick={() => handleStatusUpdate(request.id, 'PENDING')}
                                    >
                                        {t.markAsPending}
                                    </MenuItem>
                                    <MenuItem
                                        icon={<FaCheck />}
                                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                    >
                                        {t.markAsApproved}
                                    </MenuItem>
                                    <MenuItem
                                        icon={<FaTimes />}
                                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                    >
                                        {t.markAsRejected}
                                    </MenuItem>
                                    <MenuItem
                                        icon={<FaTrashAlt />}
                                        color="red.500"
                                        onClick={() => handleDeleteRequest(request.id)}
                                    >
                                        {t.delete}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
});

const VolunteerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const { language } = useLanguage();
    const toast = useToast();
    const t = translations[language];

    // Theme colors
    const bgGradient = useColorModeValue(
        'linear(to-br, white, dxc.purple.50)',
        'linear(to-br, gray.900, dxc.purple.900)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const mutedText = useColorModeValue('gray.600', 'gray.400');
    const statCardBg = useColorModeValue('dxc.purple.50', 'dxc.purple.900');
    const borderColor = useColorModeValue('dxc.purple.100', 'dxc.purple.700');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllRequests();
            if (response.statusCode === 200) {
                setRequests(response.data || []);
            }
        } catch (error) {
            toast({
                title: t.errorFetchingRequests,
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = useCallback(async (requestId, newStatus) => {
        try {
            const response = await AdminService.updateRequestStatus(requestId, newStatus);
            if (response.statusCode === 200) {
                setRequests(prev => prev.map(req =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                ));
                toast({
                    title: t.statusUpdated,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: t.errorUpdatingStatus,
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast, t]);

    const handleDeleteRequest = useCallback(async (requestId) => {
        if (!window.confirm(t.deleteConfirmation)) return;

        try {
            const response = await AdminService.deleteVolunteerRequest(requestId);
            if (response.statusCode === 200) {
                setRequests(prev => prev.filter(req => req.id !== requestId));
                toast({
                    title: t.deletedSuccess,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: t.errorDeleting,
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast, t]);

    const stats = useMemo(() => {
        const total = requests.length;
        const approved = requests.filter(r => r.status?.toUpperCase() === 'APPROVED').length;
        const rejected = requests.filter(r => r.status?.toUpperCase() === 'REJECTED').length;
        const pending = requests.filter(r => r.status?.toUpperCase() === 'PENDING').length;
        return { total, approved, rejected, pending };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        return requests.filter(request => {
            const matchesSearch =
                request.volunteer?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.association?.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                selectedStatus === 'all' ||
                request.status?.toUpperCase() === selectedStatus.toUpperCase();

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, selectedStatus]);

    if (loading) {
        return (
            <Flex height="100vh" align="center" justify="center">
                <VStack spacing={4}>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="dxc.purple.500"
                        size="xl"
                    />
                    <Text color={mutedText}>{t.loading}</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box
            minH="100vh"
            bgGradient={bgGradient}
            p={8}
        >
            <Container maxW="1400px">
                <Stack spacing={8}>
                    {/* Header */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align={{ base: 'stretch', md: 'center' }}
                        gap={4}
                    >
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="purple.600">
                                {t.title}
                            </Heading>
                            <Text color={mutedText}>{t.subtitle}</Text>
                        </VStack>
                        <HStack spacing={4}>
                            <Button
                                leftIcon={<Icon as={FaThLarge} />}
                                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                                colorScheme="purple"
                                onClick={() => setViewMode('grid')}
                                size="sm"
                                borderRadius="full"
                            >
                                {t.gridView}
                            </Button>
                            <Button
                                leftIcon={<Icon as={FaListUl} />}
                                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                                colorScheme="purple"
                                onClick={() => setViewMode('list')}
                                size="sm"
                                borderRadius="full"
                            >
                                {t.listView}
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Stats */}
                    <Grid
                        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
                        gap={6}
                    >
                        {['total', 'pending', 'approved', 'rejected'].map((statKey) => (
                            <GridItem key={statKey}>
                                <Card bg={statCardBg}>
                                    <CardBody>
                                        <StatGroup>
                                            <Stat>
                                                <StatLabel color={mutedText}>
                                                    {t[`${statKey}Requests`]}
                                                </StatLabel>
                                                <StatNumber
                                                    color={
                                                        statKey === 'total' ? 'purple.600' :
                                                            statKey === 'pending' ? 'orange.500' :
                                                                statKey === 'approved' ? 'green.500' : 'red.500'
                                                    }
                                                    fontSize="3xl"
                                                >
                                                    {stats[statKey]}
                                                </StatNumber>
                                                <Progress
                                                    value={
                                                        statKey === 'total' ? 100 :
                                                            (stats[statKey] / stats.total) * 100
                                                    }
                                                    size="xs"
                                                    colorScheme={
                                                        statKey === 'total' ? 'purple' :
                                                            statKey === 'pending' ? 'orange' :
                                                                statKey === 'approved' ? 'green' : 'red'
                                                    }
                                                    mt={2}
                                                />
                                            </Stat>
                                        </StatGroup>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        ))}
                    </Grid>

                    {/* Filters */}
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stack spacing={4}>
                                <HStack justify="space-between" wrap="wrap" gap={4}>
                                    <InputGroup maxW="320px">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FaSearch} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder={t.search}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            borderRadius="full"
                                        />
                                    </InputGroup>
                                    <HStack spacing={4}>
                                        <Select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            borderRadius="full"
                                            w="150px"
                                        >
                                            <option value="all">{t.allStatus}</option>
                                            <option value="pending">{t.pending}</option>
                                            <option value="approved">{t.approved}</option>
                                            <option value="rejected">{t.rejected}</option>
                                        </Select>
                                    </HStack>
                                </HStack>
                            </Stack>
                        </CardBody>
                    </Card>

                    {/* Request Cards */}
                    {filteredRequests.length > 0 ? (
                        <Grid
                            templateColumns={{
                                base: '1fr',
                                md: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr',
                                lg: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr'
                            }}
                            gap={6}
                        >
                            {filteredRequests.map((request) => (
                                <GridItem key={request.id}>
                                    <RequestCard
                                        request={request}
                                        t={t}
                                        handleStatusUpdate={handleStatusUpdate}
                                        handleDeleteRequest={handleDeleteRequest}
                                        cardBg={cardBg}
                                        borderColor={borderColor}
                                        mutedText={mutedText}
                                        language={language}
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : (
                        <Card bg={cardBg}>
                            <CardBody>
                                <VStack py={10} spacing={4}>
                                    <Icon
                                        as={FaExclamationCircle}
                                        boxSize={12}
                                        color="dxc.purple.300"
                                    />
                                    <Text color={mutedText} fontSize="lg">
                                        {searchQuery ? t.noMatchingRequests : t.noRequests}
                                    </Text>
                                    <Button
                                        colorScheme="purple"
                                        variant="outline"
                                        leftIcon={<Icon as={FaFilter} />}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedStatus('all');
                                        }}
                                    >
                                        {t.clearFilters}
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

export default VolunteerRequests;