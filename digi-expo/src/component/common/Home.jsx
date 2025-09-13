import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    Image,
    SimpleGrid,
    Flex,
    IconButton,
    Circle,
    Stack,
    AspectRatio,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Tooltip,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    FaBuilding,
    FaArrowRight,
    FaChevronLeft,
    FaChevronRight,
    FaLightbulb,
    FaUsers,
    FaStar,
    FaPhone,
    FaPlay,
    FaPause,
    FaVolumeMute,
    FaVolumeUp,
    FaInfoCircle,
    FaPlus,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from "../../context/LanguageContext";
import GuestService from "../../service/GuestService";
import { MdDescription } from "react-icons/md";

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionButton = motion(Button);

const translations = {
    fr: {
        welcome: "Bienvenue à Digital Explorers",
        connectingCommunities: "Connecter les Communautés par le Service",
        platformDescription: "Notre plateforme réunit associations et bénévoles, créant des liens significatifs et des changements positifs dans les communautés. Nous facilitons la gestion des activités pour les associations et permettons aux bénévoles de trouver des opportunités pour faire la différence.",
        easyCoordination: "Coordination Facile",
        coordinationDesc: "Gestion simplifiée des sessions et affectation des bénévoles",
        communityImpact: "Impact Communautaire",
        impactDesc: "Faites une réelle différence dans votre communauté locale",
        featuredAssociations: "Associations partenaires",
        city: "Ville",
        phone: "Téléphone",
        getStarted: "Commencer",
        learnMore: "En Savoir Plus",
        communityBuilding: "Construction Communautaire",
        connectVolunteers: "Connectez-vous avec des bénévoles partageant les mêmes idées",
        associations: "Associations",
        volunteers: "Bénévoles",
        sessions: "Sessions",
        cities: "Villes",
        officialVideo: "Vidéo Officielle",
        photoGallery: "Galerie de Photos",
        seeMoreAssociations: "Voir plus d'associations"
    },
    en: {
        welcome: "Welcome to Digital Explorers",
        connectingCommunities: "Connecting Communities Through Service",
        platformDescription: "Our platform brings together associations and volunteers, creating meaningful connections and positive change in communities. We make it easy for associations to manage their activities and for volunteers to find opportunities to make a difference.",
        easyCoordination: "Easy Coordination",
        coordinationDesc: "Streamlined session management and volunteer assignment",
        communityImpact: "Community Impact",
        impactDesc: "Make a real difference in your local community",
        featuredAssociations: "Featured Associations",
        city: "City",
        phone: "Phone",
        getStarted: "Get Started",
        learnMore: "Learn More",
        communityBuilding: "Community Building",
        connectVolunteers: "Connect with like-minded volunteers",
        associations: "Associations",
        volunteers: "Volunteers",
        sessions: "Sessions",
        cities: "Cities",
        officialVideo: "Official Video",
        photoGallery: "Photo Gallery",
        seeMoreAssociations: "See more associations"
    },
    ar: {
        welcome: "مرحبًا بكم في Digital Explorers",
        connectingCommunities: "ربط المجتمعات من خلال الخدمة",
        platformDescription: "تجمع منصتنا بين الجمعيات والمتطوعين، مما يخلق روابط هادفة وتغييرًا إيجابيًا في المجتمعات. نسهل على الجمعيات إدارة أنشطتها وعلى المتطوعين إيجاد فرص لإحداث فرق.",
        easyCoordination: "تنسيق سهل",
        coordinationDesc: "إدارة مبسطة للجلسات وتعيين المتطوعين",
        communityImpact: "أثر مجتمعي",
        impactDesc: "أحدث فرقًا حقيقيًا في مجتمعك المحلي",
        featuredAssociations: "الجمعيات الشريكة",
        city: "المدينة",
        phone: "الهاتف",
        getStarted: "ابدأ",
        learnMore: "اعرف المزيد",
        communityBuilding: "بناء المجتمع",
        connectVolunteers: "تواصل مع متطوعين يشاركونك نفس الأفكار",
        associations: "جمعيات",
        volunteers: "متطوعون",
        sessions: "جلسات",
        cities: "مدن",
        officialVideo: "الفيديو الرسمي",
        photoGallery: "معرض الصور",
        seeMoreAssociations: "المزيد من الجمعيات"
    }
};

const colors = {
    purple: {
        50: '#F8F5FF',
        100: '#E9E3FF',
        200: '#D1C2FF',
        300: '#B49AFF',
        400: '#9C74FF',
        500: '#8445FF',
        600: '#7028FF',
        700: '#5B1AE6',
        800: '#4A15BF',
        900: '#3A1299',
    }
};

const galleryImages = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
    '/images/11.jpg',
    '/images/12.jpg',
    '/images/13.jpg',
    '/images/14.jpg',
    '/images/15.jpg',
    '/images/16.jpg',
    '/images/17.jpg',
    '/images/18.jpg',
    '/images/19.jpg',
    '/images/20.jpg',
    '/images/21.jpg',
    '/images/22.jpg',
    '/images/23.jpg',
    '/images/24.jpg',
    '/images/25.jpg',
    '/images/26.jpg',
    '/images/27.jpg',
    '/images/28.jpg',
    '/images/29.jpg',
    '/images/30.jpg',
    '/images/31.jpg',
    '/images/32.jpg',
    '/images/33.jpg',
    '/images/34.jpg',
    '/images/35.jpg',
    '/images/36.jpg',
    '/images/37.jpg',
    '/images/38.jpg',
    '/images/39.jpg',
    '/images/40.jpg',
    '/images/41.jpg',
    '/images/42.jpg',
    '/images/43.jpg',
    '/images/44.jpg',
    '/images/45.jpg',
    '/images/46.jpg',
    '/images/47.jpg',
    '/images/48.jpg',
    '/images/49.jpg',
    '/images/50.jpg',
];

const officialVideoSrc = "/images/Video.mp4";

function useCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const interval = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(interval);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(interval);
    }, [target, duration]);
    return count;
}

const features = [
    {
        icon: FaLightbulb,
        titleKey: "easyCoordination",
        descKey: "coordinationDesc",
    },
    {
        icon: FaUsers,
        titleKey: "communityBuilding",
        descKey: "connectVolunteers",
    },
    {
        icon: FaStar,
        titleKey: "communityImpact",
        descKey: "impactDesc",
    },
];

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [galleryModal, setGalleryModal] = useState(null);
    const [associations, setAssociations] = useState([]);
    const [assocModal, setAssocModal] = useState(null);
    const { language } = useLanguage();
    const t = translations[language];
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Video controls
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
        }, 3500); // Change image every 3.5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await GuestService.getAllAssociations();
                if (response.statusCode === 200) {
                    setAssociations(response.associations || []);
                } else {
                    setError(response.message || "Failed to load associations");
                }
                setError(null);
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Slider logic for associations
    const [assocSliderIndex, setAssocSliderIndex] = useState(0);
    const visibleAssocCount = useBreakpointValue({ base: 1, sm: 2, md: 3 }) || 1;

    const handleAssocPrev = () => {
        setAssocSliderIndex((prev) =>
            prev === 0 ? Math.max(0, associations.length - visibleAssocCount) : prev - 1
        );
    };
    const handleAssocNext = () => {
        setAssocSliderIndex((prev) =>
            prev + visibleAssocCount >= associations.length
                ? 0
                : prev + 1
        );
    };

    const visibleAssociations = associations.slice(
        assocSliderIndex,
        assocSliderIndex + visibleAssocCount
    );
    if (visibleAssociations.length < visibleAssocCount && associations.length > 0) {
        // Wrap around for infinite effect
        visibleAssociations.push(
            ...associations.slice(0, visibleAssocCount - visibleAssociations.length)
        );
    }

    // Animated stats
    const countAssociations = useCountUp(8);
    const countVolunteers = useCountUp(100);
    const countSessions = useCountUp(400);
    const countCities = useCountUp(7);

    // Video controls handlers
    const handlePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    // Responsive
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box bg={colors.purple[50]}>
            {/* HERO */}
            <Box py={16} bg="#582C83">
                <Container maxW="container.xl">
                    <Flex
                        direction={{base: "column", md: "row"}}
                        align="center"
                        justify="space-between"
                        gap={12}
                    >
                        {/* Left: Texts */}
                        <VStack
                            align="start"
                            spacing={6}
                            flex={1}
                            color="white"
                            justify="center"
                            minH={{md: "400px"}}
                        >
                            <Heading
                                fontSize={{base: "3xl", md: "5xl"}}
                                fontWeight="bold"
                                textAlign="left"
                            >
                                {t.welcome}
                            </Heading>
                            <Text fontSize={{base: "xl", md: "2xl"}} fontWeight="bold">
                                {t.connectingCommunities}
                            </Text>
                            <Text fontSize={{base: "md", md: "lg"}} maxW="2xl" color="whiteAlpha.800">
                                {t.platformDescription}
                            </Text>
                            {!isAuthenticated && (
                                <Button
                                    size="lg"
                                    bg="white"
                                    color="#582C83"
                                    px={8}
                                    h={14}
                                    fontSize="lg"
                                    _hover={{bg: "gray.100", color: "#582C83", boxShadow: "lg"}}
                                    rightIcon={<Icon as={FaArrowRight}/>}
                                    onClick={handleLoginClick}
                                    shadow="xl"
                                    mt={4}
                                >
                                    {t.getStarted}
                                </Button>
                            )}
                        </VStack>
                        {/* Right: Video with controls */}
                        <Box
                            flex={1}
                            maxW="750px"
                            w="100%"
                            borderRadius="2xl"
                            overflow="hidden"
                            boxShadow="2xl"
                            bg="gray.100"
                            position="relative"
                        >
                            <AspectRatio ratio={16 / 9} w="100%">
                                <video
                                    ref={videoRef}
                                    src={officialVideoSrc}
                                    loop
                                    autoPlay
                                    muted={isMuted}
                                    playsInline
                                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                                />
                            </AspectRatio>
                            <Flex
                                position="absolute"
                                bottom={4}
                                left="50%"
                                transform="translateX(-50%)"
                                zIndex={3}
                                bg="rgba(255,255,255,0.7)"
                                borderRadius="full"
                                boxShadow="md"
                                px={4}
                                py={2}
                                align="center"
                                gap={4}
                            >
                                <Tooltip label={isPlaying ? "Pause" : "Play"}>
                                    <IconButton
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                        icon={isPlaying ? <FaPause/> : <FaPlay/>}
                                        onClick={handlePlayPause}
                                        colorScheme="purple"
                                        variant="ghost"
                                        isRound
                                    />
                                </Tooltip>
                                <Tooltip label={isMuted ? "Unmute" : "Mute"}>
                                    <IconButton
                                        aria-label={isMuted ? "Unmute" : "Mute"}
                                        icon={isMuted ? <FaVolumeMute/> : <FaVolumeUp/>}
                                        onClick={handleMute}
                                        colorScheme="purple"
                                        variant="ghost"
                                        isRound
                                    />
                                </Tooltip>
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>

            {/* STATS */}
            <Box bg="white" py={12}>
                <Container maxW="container.xl">
                    <SimpleGrid columns={{base: 1, sm: 2, md: 4}} spacing={8}>
                        {[
                            {
                                icon: FaBuilding,
                                value: countAssociations,
                                label: t.associations,
                            },
                            {
                                icon: FaUsers,
                                value: countVolunteers,
                                label: t.volunteers,
                            },
                            {
                                icon: FaLightbulb,
                                value: countSessions,
                                label: t.sessions,
                            },
                            {
                                icon: FaStar,
                                value: countCities,
                                label: t.cities,
                            },
                        ].map((stat, idx) => (
                            <Box
                                key={idx}
                                bg="white"
                                borderRadius="2xl"
                                boxShadow="md"
                                pt={8}
                                pb={6}
                                px={4}
                                position="relative"
                                textAlign="center"
                                _hover={{boxShadow: "xl", transform: "translateY(-4px)"}}
                                transition="all 0.2s"
                            >
                                {/* Top border accent */}
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    right={0}
                                    h="6px"
                                    bg="#582C83"
                                    borderTopRadius="2xl"
                                />
                                {/* Floating icon */}
                                <Circle
                                    size={16}
                                    bg="#582C83"
                                    color="white"
                                    boxShadow="lg"
                                    position="absolute"
                                    top={-8}
                                    left="50%"
                                    transform="translateX(-50%)"
                                    border="4px solid white"
                                >
                                    <Icon as={stat.icon} boxSize={8}/>
                                </Circle>
                                <Box mt={6}>
                                    <Text fontWeight="bold" fontSize="3xl" color="#582C83" mb={1}>
                                        {stat.value}+
                                    </Text>
                                    <Text fontSize="md" color="gray.600" fontWeight="medium">
                                        {stat.label}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* SINGLE IMAGE SECTION (replace src with your design) */}
            <Box py={16} bg={colors.purple[50]}>
                <Container maxW="container.xl">
                    <Image
                        src="/images/galerie-media.webp"
                        alt="Processus DigiExpo"
                        objectFit="contain"
                        w="100%"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        loading="lazy"
                    />
                </Container>
            </Box>

            {/* GALLERY - horizontal scroll */}
            <Box py={16} bg={colors.purple[100]}>
                <Container maxW="container.xl">
                    <Heading
                        size="xl"
                        color="#582C83"
                        textAlign="center"
                        mb={10}
                        letterSpacing="tight"
                        fontWeight="extrabold"
                    >
                        {t.photoGallery}
                    </Heading>
                    {/* Main image with zoom */}
                    <Box position="relative" w="100%" maxW="900px" mx="auto" mb={6}>
                        <Image
                            src={galleryImages[galleryIndex]}
                            alt={`Gallery ${galleryIndex + 1}`}
                            objectFit="cover"
                            w="100%"
                            h={{base: "220px", md: "400px"}}
                            borderRadius="xl"
                            boxShadow="2xl"
                            cursor="default" // changed from pointer to default
                            transition="all 0.3s"
                            _hover={{filter: "brightness(0.85)"}}
                            loading="lazy"
                        />
                        <Box
                            position="absolute"
                            bottom={4}
                            left="50%"
                            transform="translateX(-50%)"
                            bg="rgba(0,0,0,0.5)"
                            color="white"
                            px={4}
                            py={1}
                            borderRadius="full"
                            fontSize="md"
                            fontWeight="medium"
                            pointerEvents="none"
                        >
                        </Box>
                    </Box>
                    {/* Thumbnails */}
                    <Flex justify="center" align="center" gap={2} wrap="nowrap" overflowX="auto">
                        {galleryImages.map((img, idx) => (
                            <Box
                                key={idx}
                                border={galleryIndex === idx ? "3px solid #582C83" : "2px solid #E9E3FF"}
                                borderRadius="md"
                                overflow="hidden"
                                boxShadow={galleryIndex === idx ? "lg" : "sm"}
                                minW="80px"
                                maxW="80px"
                                h="60px"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{borderColor: "#582C83"}}
                                onClick={() => setGalleryIndex(idx)}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                    loading="lazy"
                                />
                            </Box>
                        ))}
                    </Flex>
                    {/* Modal for zoomed image */}
                    <Modal isOpen={galleryModal !== null} onClose={() => setGalleryModal(null)} size="4xl" isCentered>
                        <ModalOverlay/>
                        <ModalContent bg="white" borderRadius="2xl" p={2} position="relative">
                            <ModalCloseButton/>
                            <ModalBody p={0} display="flex" alignItems="center" justifyContent="center"
                                       position="relative">
                                <IconButton
                                    icon={<FaChevronLeft/>}
                                    onClick={() => setGalleryModal((galleryModal - 1 + galleryImages.length) % galleryImages.length)}
                                    colorScheme="purple"
                                    variant="ghost"
                                    size="lg"
                                    isRound
                                    aria-label="Previous image"
                                    position="absolute"
                                    left={2}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    zIndex={2}
                                    bg="#582C83"
                                    _hover={{bg: "#3A1299"}}
                                />
                                <Image
                                    src={galleryImages[galleryModal ?? 0]}
                                    alt="Gallery Modal"
                                    w="100%"
                                    maxH="70vh"
                                    borderRadius="2xl"
                                    boxShadow="2xl"
                                    objectFit="contain"
                                    loading="lazy"
                                />
                                <IconButton
                                    icon={<FaChevronRight/>}
                                    onClick={() => setGalleryModal((galleryModal + 1) % galleryImages.length)}
                                    colorScheme="purple"
                                    variant="ghost"
                                    size="lg"
                                    isRound
                                    aria-label="Next image"
                                    position="absolute"
                                    right={2}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    zIndex={2}
                                    bg="#582C83"
                                    _hover={{bg: "#3A1299"}}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Container>
            </Box>

            {/* ASSOCIATIONS - Responsive slider with modal and see more button */}
            <Box py={20} bg={colors.purple[50]}>
                <Container maxW="container.xl">
                    <Heading
                        size="xl"
                        color="#582C83"
                        mb={10}
                        textAlign="center"
                        position="relative"
                        _after={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '4px',
                            borderRadius: 'full',
                            bg: "#582C83",
                        }}
                    >
                        {t.featuredAssociations}
                    </Heading>
                    <Flex align="center" justify="center" mb={6}>
                        <IconButton
                            icon={<FaChevronLeft/>}
                            onClick={handleAssocPrev}
                            aria-label="Previous"
                            colorScheme="purple"
                            variant="ghost"
                            isRound
                            mr={2}
                            disabled={associations.length <= visibleAssocCount}
                        />
                        <Flex gap={8} overflow="hidden" w="100%" justify="center">
                            {visibleAssociations.map((association, idx) => (
                                <Box
                                    key={association._id || idx}
                                    borderRadius="2xl"
                                    boxShadow="2xl"
                                    bg="white"
                                    p={6}
                                    minW={{base: "260px", md: "300px"}}
                                    maxW={{base: "260px", md: "300px"}}
                                    position="relative"
                                    _hover={{boxShadow: "xl", transform: "translateY(-4px)"}}
                                    transition="all 0.2s"
                                >
                                    <Image
                                        src={association.imageFileName
                                            ? `http://localhost:8080/images/${association.imageFileName}`
                                            : '/images/default-association.jpg'
                                        }
                                        alt={association.name}
                                        objectFit="contain"
                                        bg="white"
                                        w="full"
                                        h="180px"
                                        mb={4}
                                        borderRadius="xl"
                                        boxShadow="md"
                                    />
                                    <Heading size="md" color="#582C83" mb={2}>
                                        {association.name}
                                    </Heading>
                                    <Text color="#582C83" fontWeight="bold">
                                        {association.ville}
                                    </Text>
                                    <Button
                                        leftIcon={<FaInfoCircle/>}
                                        colorScheme="purple"
                                        variant="ghost"
                                        size="sm"
                                        mt={4}
                                        onClick={() => setAssocModal(association)}
                                    >
                                        {t.learnMore}
                                    </Button>
                                </Box>
                            ))}
                        </Flex>
                        <IconButton
                            icon={<FaChevronRight/>}
                            onClick={handleAssocNext}
                            aria-label="Next"
                            colorScheme="purple"
                            variant="ghost"
                            isRound
                            ml={2}
                            disabled={associations.length <= visibleAssocCount}
                        />
                    </Flex>
                    <Flex justify="center" mt={4}>
                        <Button
                            colorScheme="purple"
                            variant="solid"
                            size="lg"
                            onClick={() => navigate('/associations')}
                            leftIcon={<FaPlus/>}
                        >
                            {t.seeMoreAssociations}
                        </Button>
                    </Flex>
                    {/* Modal code remains unchanged */}
                    <Modal isOpen={!!assocModal} onClose={() => setAssocModal(null)} size="lg" isCentered>
                        <ModalOverlay/>
                        <ModalContent bg="white" borderRadius="2xl" p={2}>
                            <ModalHeader>{assocModal?.name}</ModalHeader>
                            <ModalCloseButton/>
                            <ModalBody>
                                <VStack align="start" spacing={4}>
                                    <Image
                                        src={assocModal?.imageFileName
                                            ? `http://localhost:8080/images/${assocModal.imageFileName}`
                                            : '/images/default-association.jpg'
                                        }
                                        alt={assocModal?.name}
                                        objectFit="contain"
                                        bg="white"
                                        w="full"
                                        h="180px"
                                        borderRadius="xl"
                                        boxShadow="md"
                                    />
                                    <HStack>
                                        <Icon as={FaBuilding} color="#582C83"/>
                                        <Text>{assocModal?.ville}</Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={FaPhone} color="#582C83"/>
                                        <Text>{assocModal?.responsablePhone}</Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={MdDescription} color="#582C83"/>
                                        <Text>{assocModal?.description}</Text>
                                    </HStack>
                                </VStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;