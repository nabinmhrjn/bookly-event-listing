export const getDateRange = (dateFilter) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (dateFilter) {
        case 'today':
            return {
                start: startOfDay,
                end: endOfDay
            };

        case 'tomorrow':
            const tomorrowStart = new Date(startOfDay);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);
            const tomorrowEnd = new Date(endOfDay);
            tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
            return {
                start: tomorrowStart,
                end: tomorrowEnd
            };

        case 'this-weekend':
            // Find next Saturday and Sunday
            const today = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysUntilSaturday = today === 6 ? 0 : (6 - today + 7) % 7; // If today is Saturday, use 0

            const saturdayStart = new Date(startOfDay);
            saturdayStart.setDate(saturdayStart.getDate() + daysUntilSaturday);

            const sundayEnd = new Date(endOfDay);
            sundayEnd.setDate(sundayEnd.getDate() + daysUntilSaturday + 1);

            return {
                start: saturdayStart,
                end: sundayEnd
            };

        case 'this-week':
            // From today to end of Sunday
            const daysUntilSunday = (7 - today) % 7;
            const weekEnd = new Date(endOfDay);
            weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
            return {
                start: startOfDay,
                end: weekEnd
            };

        case 'next-week':
            // Next Monday to next Sunday
            const daysUntilNextMonday = ((8 - today) % 7) || 7;
            const nextMondayStart = new Date(startOfDay);
            nextMondayStart.setDate(nextMondayStart.getDate() + daysUntilNextMonday);

            const nextSundayEnd = new Date(endOfDay);
            nextSundayEnd.setDate(nextSundayEnd.getDate() + daysUntilNextMonday + 6);

            return {
                start: nextMondayStart,
                end: nextSundayEnd
            };

        default:
            return null;
    }
};
