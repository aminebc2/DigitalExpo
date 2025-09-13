import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Container,
  VStack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Circle,
  List,
  ListItem,
  useDisclosure,
  Button,
  Select,
  Stack,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaBuilding, FaUser } from 'react-icons/fa';
import GuestService from '../../service/GuestService';
import { useLanguage } from '../../context/LanguageContext';

const MAIN_COLOR = '#582C83';

const translations = {
  fr: {
    title: 'Planning des Sessions',
    subtitle: 'Consultez le planning des sessions sous forme de calendrier.',
    noSessions: 'Aucune session trouvée.',
    noSessionsDesc: 'Aucun planning n\'est disponible pour le moment.',
    calendar: 'Calendrier',
    association: 'Association',
    volunteer: 'Bénévole',
    day: 'Jour',
    close: 'Fermer',
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    weekDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    filterAssociation: 'Association',
    filterVolunteer: 'Bénévole',
    filterDay: 'Jour',
  },
  en: {
    title: 'Session Planning',
    subtitle: 'View the session planning as a calendar.',
    noSessions: 'No sessions found.',
    noSessionsDesc: 'No planning is available at the moment.',
    calendar: 'Calendar',
    association: 'Association',
    volunteer: 'Volunteer',
    day: 'Day',
    close: 'Close',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    filterAssociation: 'Association',
    filterVolunteer: 'Volunteer',
    filterDay: 'Day',
  },
};

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday=0
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

const Planning = () => {
  const [planning, setPlanning] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();
  const t = translations[language];

  // Filtre state
  const [filters, setFilters] = useState({ association: '', volunteer: '', day: '' });

  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = MAIN_COLOR;

  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const data = await GuestService.getPlanning();
        setPlanning(data.planningList || []);
      } catch (err) {
        setError(language === 'fr' ? 'Erreur lors du chargement du planning.' : 'Error loading planning.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlanning();
    // eslint-disable-next-line
  }, [language]);

  // Filtrage dynamique
  const filteredPlanning = planning.filter(session => {
    const matchAssociation = !filters.association || session.associationName === filters.association;
    const matchVolunteer = !filters.volunteer || session.volunteerName === filters.volunteer;
    const matchDay = !filters.day || session.date === filters.day;
    return matchAssociation && matchVolunteer && matchDay;
  });

  // Group sessions by date string (YYYY-MM-DD)
  const sessionsByDate = filteredPlanning.reduce((acc, session) => {
    if (!session.date) return acc;
    acc[session.date] = acc[session.date] || [];
    acc[session.date].push(session);
    return acc;
  }, {});

  // Calendar matrix for the current month
  const monthMatrix = getMonthMatrix(calendarYear, calendarMonth);
  const monthName = t.monthNames[calendarMonth];

  // Handlers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };
  const handleDayClick = (date) => {
    setSelectedDate(date);
    onOpen();
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Modal content for selected day
  const renderDayModal = () => {
    if (!selectedDate) return null;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const sessions = sessionsByDate[dateStr] || [];
    // Group by association and volunteer
    const groupBy = (array, key) =>
      array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
      }, {});
    const sessionsByAssociation = groupBy(sessions, 'associationName');
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={headingColor}>
            {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {sessions.length === 0 ? (
              <VStack spacing={4} py={8}>
                <Icon as={FaCalendarAlt} boxSize={8} color={MAIN_COLOR} opacity={0.5} />
                <Text color={subTextColor}>{t.noSessions}</Text>
              </VStack>
            ) : (
              Object.entries(sessionsByAssociation).map(([association, assocSessions]) => {
                const sessionsByVolunteer = groupBy(assocSessions, 'volunteerName');
                return (
                  <Box key={association} mb={6}>
                    <HStack mb={2} spacing={2} align="center">
                      <Circle size="32px" bg={MAIN_COLOR} color="white">
                        <Icon as={FaBuilding} boxSize={4} />
                      </Circle>
                      <Text fontWeight="bold" color={headingColor}>{t.association} : {association}</Text>
                    </HStack>
                    <Stack spacing={2} pl={2}>
                      {Object.entries(sessionsByVolunteer).map(([volunteer, volSessions]) => (
                        <Box key={volunteer} mb={2}>
                          <HStack spacing={2} align="center">
                            <Circle size="28px" bg={MAIN_COLOR} color="white">
                              <Icon as={FaUser} boxSize={3} />
                            </Circle>
                            <Text fontWeight="semibold" color={MAIN_COLOR}>{t.volunteer} : {volunteer}</Text>
                          </HStack>
                          {/* List of sessions for this volunteer */}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                );
              })
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  // Unique values for filters
  const uniqueAssociations = [...new Set(planning.map(s => s.associationName).filter(Boolean))];
  const uniqueVolunteers = [...new Set(planning.map(s => s.volunteerName).filter(Boolean))];
  const uniqueDays = [...new Set(planning.map(s => s.date).filter(Boolean))];

  if (loading) return (
    <Box textAlign="center" py={10}>
      <Spinner size="xl" color={MAIN_COLOR} />
      <Text mt={4}>{language === 'fr' ? 'Chargement du planning...' : 'Loading planning...'}</Text>
    </Box>
  );
  if (error) return (
    <Alert status="error" mt={4} borderRadius="md">
      <AlertIcon />
      {error}
    </Alert>
  );
  if (!planning.length) return (
    <VStack spacing={6} minH="60vh" justify="center" align="center" bg={cardBg}>
      <Icon as={FaCalendarAlt} boxSize={12} color={MAIN_COLOR} opacity={0.5} />
      <Heading size="lg" color={headingColor}>{t.noSessions}</Heading>
      <Text color={subTextColor}>{t.noSessionsDesc}</Text>
    </VStack>
  );

  return (
    <Box minH="100vh" bg={pageBg} pt={{ base: 10, md: 20 }} pb={{ base: 10, md: 20 }}>
      <Container maxW="5xl">
        <VStack spacing={6} mb={10} textAlign="center">
          <Icon as={FaCalendarAlt} boxSize={{ base: 12, md: 16 }} color={MAIN_COLOR} />
          <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" color={headingColor} letterSpacing="tight">
            {t.title}
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="black" maxW="2xl">
            {t.subtitle}
          </Text>
        </VStack>
        {/* Filtres */}
        <Flex mb={6} gap={4} wrap="wrap" justify="center">
          <Select
            placeholder={t.filterAssociation}
            name="association"
            value={filters.association}
            onChange={handleFilterChange}
            maxW="200px"
            focusBorderColor={MAIN_COLOR}
            bg="white"
            color={MAIN_COLOR}
            fontWeight="semibold"
            _hover={{ borderColor: MAIN_COLOR }}
          >
            {uniqueAssociations.map((association) => (
              <option key={association} value={association}>{association}</option>
            ))}
          </Select>
          <Select
            placeholder={t.filterVolunteer}
            name="volunteer"
            value={filters.volunteer}
            onChange={handleFilterChange}
            maxW="200px"
            focusBorderColor={MAIN_COLOR}
            bg="white"
            color={MAIN_COLOR}
            fontWeight="semibold"
            _hover={{ borderColor: MAIN_COLOR }}
          >
            {uniqueVolunteers.map((volunteer) => (
              <option key={volunteer} value={volunteer}>{volunteer}</option>
            ))}
          </Select>
        </Flex>
        {/* Calendar Controls */}
        <Flex justify="space-between" align="center" mb={4}>
          <Button onClick={handlePrevMonth} colorScheme="purple" variant="ghost" size="sm">{'<'}</Button>
          <Heading as="h2" size="md" color={headingColor} textAlign="center">
            {monthName} {calendarYear}
          </Heading>
          <Button onClick={handleNextMonth} colorScheme="purple" variant="ghost" size="sm">{'>'}</Button>
        </Flex>
        {/* Weekdays */}
        <SimpleGrid columns={7} spacing={1} mb={2}>
          {t.weekDays.map((wd, idx) => (
            <Box key={idx} textAlign="center" fontWeight="bold" color={headingColor} py={1}>{wd}</Box>
          ))}
        </SimpleGrid>
        {/* Calendar Grid */}
        <SimpleGrid columns={7} spacing={2}>
          {monthMatrix.flat().map((date, idx) => {
            if (!date) {
              return <Box key={idx} h="80px" bg="gray.100" borderRadius="md" />;
            }
            const dateStr = date.toISOString().slice(0, 10);
            const hasSessions = !!sessionsByDate[dateStr];
            return (
              <Box
                key={idx}
                h="80px"
                bg={hasSessions ? MAIN_COLOR : 'gray.100'}
                color={hasSessions ? 'white' : 'gray.400'}
                borderRadius="md"
                boxShadow={hasSessions ? 'md' : undefined}
                cursor={hasSessions ? 'pointer' : 'default'}
                p={2}
                position="relative"
                onClick={hasSessions ? () => handleDayClick(date) : undefined}
                _hover={hasSessions ? { bg: '#6d3bbd' } : {}}
                transition="background 0.2s"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text fontWeight="bold" fontSize="md" mb={1}>
                  {date.getDate()}
                </Text>
                {hasSessions && (
                  <Box fontSize="xs" fontWeight="semibold" mt={1}>
                    {sessionsByDate[dateStr].length} {language === 'fr' ? 'session(s)' : 'session(s)'}
                  </Box>
                )}
              </Box>
            );
          })}
        </SimpleGrid>
        {renderDayModal()}
      </Container>
    </Box>
  );
};

export default Planning;