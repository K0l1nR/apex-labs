import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';

import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(timezone);
dayjs.locale('ru');

function isAfterNow(date: Date): boolean {
  if (!date) return false;
  return dayjs().isBefore(date);
}

function isBeforeNow(date: Date): boolean {
  if (!date) return true;
  return dayjs(date).isBefore(dayjs());
}

function addDays(date: Date, days: number): Date {
  return dayjs(date).add(days, 'days').toDate();
}

function toUnixTimestamp(date: Date, type: 'sec' | 'millisec') {
  switch (type) {
    case 'sec':
      return dayjs(date).unix();
    case 'millisec':
      return dayjs(date).valueOf();
  }
}

function fromUnixTimestamp(unixTimestamp: number, type: 'sec' | 'millisec') {
  switch (type) {
    case 'sec':
      return dayjs.unix(unixTimestamp);
    case 'millisec':
      return dayjs(unixTimestamp);
  }
}

function createDateWithTimezone(date: Date, timeZone: number) {
  let UTCDateForTimezone: Date = null;

  const timeShift = date.getUTCHours() + 3 - timeZone; // Fix: adding + 3 hours

  if (timeShift < 0) {
    UTCDateForTimezone = new Date(date.setUTCHours(timeShift + 24));
  } else {
    UTCDateForTimezone = new Date(date.setUTCHours(timeShift));
  }

  return UTCDateForTimezone;
}

export {
  dayjs,
  isAfterNow,
  addDays,
  toUnixTimestamp,
  fromUnixTimestamp,
  createDateWithTimezone,
  isBeforeNow,
};
