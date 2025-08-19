import {
    subSeconds,
    subMinutes,
    subHours,
    subDays,
    subMonths,
    subYears,
    isEqual,
    addSeconds,
    addMinutes,
    addHours,
    addDays,
    addWeeks,
    addMonths,
    addYears
} from 'date-fns';

type SubtractUnit = 'SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'MONTHS' | 'YEARS';

type RepeatType = 'SECONDLY' | 'MINUTELY' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

function subtractTime(baseTime: Date, type: SubtractUnit, value: number) {
    switch (type) {
        case "SECONDS": return subSeconds(baseTime, value);
        case "MINUTES": return subMinutes(baseTime, value);
        case "HOURS":   return subHours(baseTime, value);
        case "DAYS":    return subDays(baseTime, value);
        case "MONTHS":  return subMonths(baseTime, value);
        case "YEARS":   return subYears(baseTime, value);
        default:        return baseTime;
    }
}

function addInterval(date: Date, type: RepeatType, interval: number) {
    switch (type) {
        case 'SECONDLY': return addSeconds(date, interval);
        case 'MINUTELY': return addMinutes(date, interval);
        case 'HOURLY': return addHours(date, interval);
        case 'DAILY': return addDays(date, interval);
        case 'WEEKLY': return addWeeks(date, interval);
        case 'MONTHLY': return addMonths(date, interval);
        case 'YEARLY': return addYears(date, interval);
        default: return date;
    }
}

function getMsOffset(type: string, value: number) {
  switch (type) {
    case "SECONDS": return value * 1000;
    case "MINUTES": return value * 60 * 1000;
    case "HOURS": return value * 60 * 60 * 1000;
    case "DAYS": return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}

export {subtractTime, addInterval, getMsOffset};
  