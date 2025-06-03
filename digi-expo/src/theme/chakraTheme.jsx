import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        brand: {
            primary: '#5F249F', // DXC Bright Purple
            secondary: '#00A6B2', // DXC Bright Teal
            teal: '#00A6B2', // DXC Bright Teal
            blue: '#0095C8', // DXC Blue
            green: '#4CD964', // DXC Green
            orange: '#FF5F00', // DXC Orange
            gold: '#FFCD00', // DXC Gold
            yellow: '#FFCD00', // DXC Yellow
            purple: '#5F249F', // DXC Dark Purple
            grey: {
                50: '#F8F8F8',
                100: '#EBEBEB', // DXC Light Grey
                200: '#D8D8D8',
                300: '#BDBDBD', // DXC Medium Grey
                400: '#999999',
                500: '#757575',
                600: '#666666',
                700: '#4D4D4D', // DXC Dark Grey
                800: '#333333',
                900: '#1A1A1A',
            },
        },
    },
    fonts: {
        heading: '"Roboto", sans-serif',
        body: '"Roboto", sans-serif',
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 500,
                borderRadius: 'lg',
            },
            variants: {
                solid: {
                    bg: 'brand.primary',
                    color: 'white',
                    _hover: {
                        bg: 'brand.purple',
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    },
                    _active: {
                        bg: 'brand.purple',
                    },
                },
                outline: {
                    borderColor: 'brand.primary',
                    color: 'brand.primary',
                    borderWidth: '2px',
                    _hover: {
                        bg: 'rgba(95, 36, 159, 0.05)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'xl',
                    boxShadow: 'sm',
                },
            },
        },
        Input: {
            variants: {
                outline: {
                    field: {
                        borderRadius: 'lg',
                        borderColor: 'gray.200',
                        _hover: {
                            borderColor: 'brand.primary',
                        },
                        _focus: {
                            borderColor: 'brand.primary',
                            boxShadow: '0 0 0 1px #5F249F',
                        },
                    },
                },
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.900',
            },
        },
    },
});

export default theme;
