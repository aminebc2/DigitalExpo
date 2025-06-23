import React, { useState } from 'react';
import {
    Box,
    styled,
    IconButton,
    Typography,
    Popover,
    Stack,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// DXC Color Palette
const dxcColors = {
    primary: {
        purple: '#582C83',
        white: '#FFFFFF'
    },
    accents: {
        red: '#9e0a0a'
    }
};

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: dxcColors.primary.purple,
        },
        error: {
            main: dxcColors.accents.red,
        }
    }
});

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Styled components
const StyledDateInput = styled('input')({
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    '&:focus': {
        outline: 'none',
        borderColor: dxcColors.primary.purple,
        boxShadow: `0 0 0 2px ${dxcColors.primary.purple}20`
    },
    '&::-webkit-calendar-picker-indicator': {
        display: 'none'
    }
});

const CalendarDay = styled(Box, {
    shouldForwardProp: prop => !['isDisabled', 'isSelected', 'isToday', 'isReserved'].includes(prop)
})(({ isDisabled, isSelected, isToday, isReserved }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    width: 36,
    borderRadius: '4px',
    cursor: isDisabled || isReserved ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    userSelect: 'none',
    // Default styles
    color: '#333',
    backgroundColor: 'transparent',

    // Reserved dates styling
    ...(isReserved && {
        opacity: 0.4,
        textDecoration: 'line-through',
        color: dxcColors.accents.red,
        backgroundColor: `${dxcColors.accents.red}0D`, // Very light red background
        cursor: 'not-allowed',
        pointerEvents: 'none', // Completely disable clicking
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: dxcColors.accents.red,
            transform: 'translateY(-50%)',
        }
    }),

    // Past dates styling (if different from reserved)
    ...(isDisabled && !isReserved && {
        opacity: 0.3,
        color: '#999',
        cursor: 'not-allowed',
        pointerEvents: 'none',
    }),

    // Selected date styling
    ...(isSelected && !isDisabled && !isReserved && {
        backgroundColor: dxcColors.primary.purple,
        color: dxcColors.primary.white,
        fontWeight: 'bold',
    }),

    // Today's date styling
    ...(isToday && !isSelected && !isDisabled && !isReserved && {
        fontWeight: 'bold',
        border: `2px solid ${dxcColors.primary.purple}`,
        color: dxcColors.primary.purple,
    }),

    // Hover effects (only for clickable dates)
    '&:hover': {
        ...(!(isDisabled || isReserved) && {
            backgroundColor: isSelected
                ? dxcColors.primary.purple
                : `${dxcColors.primary.purple}1A`,
        })
    }
}));

const WeekdayHeader = styled(Typography)({
    fontWeight: 'bold',
    color: dxcColors.primary.purple,
    textAlign: 'center',
    padding: '8px 0',
    fontSize: '12px',
});

const MonthNavButton = styled(IconButton)({
    color: dxcColors.primary.purple,
    '&:hover': {
        backgroundColor: `${dxcColors.primary.purple}1A`,
    }
});

const CustomDatePicker = ({ value, onChange, minDate, reservedDates = [], language }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDate, setSelectedDate] = useState(value);
    const [currentMonth, setCurrentMonth] = useState(() => {
        // Initialize current month based on selected date or current date
        if (value) {
            return new Date(value);
        }
        return new Date();
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    // Improved function to check if a date is reserved
    const isDateReserved = (dateStr) => {
        if (!reservedDates || !Array.isArray(reservedDates) || reservedDates.length === 0) {
            return false;
        }

        return reservedDates.some(reserved => {
            try {
                let reservedDateStr;

                if (typeof reserved === 'string') {
                    // If it's a string, try to parse it as a date
                    const parsedDate = new Date(reserved);
                    if (!isNaN(parsedDate.getTime())) {
                        reservedDateStr = formatDate(parsedDate);
                    } else {
                        reservedDateStr = reserved;
                    }
                } else if (typeof reserved === 'object' && reserved !== null) {
                    // If it's an object with a date property
                    if (reserved.date) {
                        const parsedDate = new Date(reserved.date);
                        if (!isNaN(parsedDate.getTime())) {
                            reservedDateStr = formatDate(parsedDate);
                        }
                    }
                } else if (reserved instanceof Date) {
                    // If it's already a Date object
                    reservedDateStr = formatDate(reserved);
                }

                return reservedDateStr === dateStr;
            } catch (error) {
                console.warn('Error processing reserved date:', reserved, error);
                return false;
            }
        });
    };

    const isDateDisabled = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        // Check if date is in the past
        return date < today;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const handleDateClick = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = formatDate(date);

        // Prevent selection of disabled or reserved dates
        if (isDateDisabled(date) || isDateReserved(dateStr)) {
            return; // Do nothing
        }

        setSelectedDate(dateStr);
        onChange(dateStr);
        handleClose();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const renderCalendar = () => {
        const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
        const weekDays = language === 'fr'
            ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Week days header
        const weekDayHeaders = weekDays.map(day => (
            <WeekdayHeader key={`header-${day}`}>
                {day}
            </WeekdayHeader>
        ));

        // Empty cells for days before first day of month
        const emptyCells = Array(firstDayOfMonth).fill(null).map((_, i) => (
            <Box key={`empty-${i}`} />
        ));

        // Days of the month
        const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = formatDate(date);
            const isDisabled = isDateDisabled(date);
            const isReserved = isDateReserved(dateStr);
            const isSelected = dateStr === selectedDate;
            const isTodayDate = isToday(date);

            return (
                <CalendarDay
                    key={day}
                    onClick={() => handleDateClick(day)}
                    isDisabled={isDisabled}
                    isReserved={isReserved}
                    isSelected={isSelected}
                    isToday={isTodayDate}
                    title={isReserved ? 'This date is already reserved' : ''}
                >
                    {day}
                </CalendarDay>
            );
        });

        return [...weekDayHeaders, ...emptyCells, ...monthDays];
    };

    // Handle direct input change
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue) {
            const isReserved = isDateReserved(inputValue);
            const inputDate = new Date(inputValue);
            const isDisabled = isDateDisabled(inputDate);

            if (isReserved || isDisabled) {
                // Don't allow the change if date is reserved or disabled
                return;
            }
        }
        setSelectedDate(inputValue);
        onChange(inputValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <StyledDateInput
                    type="date"
                    value={value}
                    onChange={handleInputChange}
                    min={minDate}
                    required
                    onClick={handleClick}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: {
                            p: 2,
                            width: 'auto',
                            boxShadow: `0 4px 20px ${dxcColors.primary.purple}20`,
                            borderRadius: '12px',
                        }
                    }}
                >
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <MonthNavButton onClick={handlePrevMonth} size="small">
                                <ChevronLeft />
                            </MonthNavButton>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {currentMonth.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Typography>
                            <MonthNavButton onClick={handleNextMonth} size="small">
                                <ChevronRight />
                            </MonthNavButton>
                        </Stack>
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(7, 1fr)"
                            gap={1}
                            sx={{ minWidth: '280px' }}
                        >
                            {renderCalendar()}
                        </Box>
                    </Stack>
                </Popover>
            </Box>
        </ThemeProvider>
    );
};

export default CustomDatePicker;