import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#5F249F', // DXC Bright Purple
            light: '#8547d1',
            dark: '#3b0070',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00A6B2', // DXC Bright Teal
            light: '#4CD6E0',
            dark: '#007780',
            contrastText: '#ffffff',
        },
        error: {
            main: '#FF5F00', // DXC Orange
            light: '#FF8B40',
            dark: '#CC4C00',
        },
        warning: {
            main: '#FFCD00', // DXC Gold
            light: '#FFE14D',
            dark: '#CCA300',
        },
        success: {
            main: '#4CD964', // DXC Green
            light: '#7DE490',
            dark: '#38A34B',
        },
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
        text: {
            primary: '#000000',
            secondary: '#4D4D4D',
        },
        background: {
            default: '#F8F8F8',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontSize: '1rem',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
                elevation1: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                standardError: {
                    border: '1px solid rgba(211, 47, 47, 0.1)',
                },
                standardSuccess: {
                    border: '1px solid rgba(46, 125, 50, 0.1)',
                },
            },
        },
    },
});

export default theme;
