import moment from 'moment';
import momentTimeZone from 'moment-timezone';

moment.suppressDeprecationWarnings = true;

export const getCurrentDate = (date, format) => {
  if (date) return moment(date).format(format || 'YYYY-MM-DD');
  return moment().format(format || 'YYYY-MM-DD');
};

export const getCurrentDateTime = (date, format) => {
  if (date) return moment(date).format(format || 'YYYY-MM-DD');
  return moment().format(format || 'YYYY-MM-DD HH:mm');
};

export const getCurrentLocalDate = (date, format) => {
  if (date) return moment(date).utc().add(5, 'hours').add(30, 'minutes').format(format || 'YYYY-MM-DD');
  return moment.utc().add(5, 'hours').add(30, 'minutes').format(format || 'YYYY-MM-DD');
};

export const getCurrentTimeInUnix = () => moment().unix();

export const convertDateFromTimezone = (date, timezone, format) => {
  const d = date || new Date();
  return timezone
    ? moment.tz(d, timezone).format(format)
    : moment.utc(d).format(format);
};

export const getUTCDateTimeFromTimezone = (date, timezone, format = 'YYYY-MM-DD HH:mm:ss') => {
  const newDate = moment.tz(date || new Date(), timezone);
  return momentTimeZone.utc(newDate).format(format);
};

export const changeDateFormat = (date, format = 'YYYY-MM-DD') => moment.utc(date || new Date()).format(format);

export const convertToTz = (date, timeZone) => {
  const fmt = 'YYYY-MM-DD HH:mm:ss';
  return moment(date, fmt).tz(timeZone).format(fmt);
};

export const dateDifference = (date1, date2) => {
  const startDate = moment(date1, 'YYYY-MM-DD HH:mm:ss');
  const endDate = moment(date2, 'YYYY-MM-DD HH:mm:ss');
  return moment.duration(endDate.diff(startDate)).asHours();
};

export const getStartDateFormater = (date) => `${moment(date).format('YYYY-MM-DD')} 00:00:00`;

export const getEndDateFormater = (date) => `${moment(date).format('YYYY-MM-DD')} 23:59:59`;

export const getAddDate = (addData, convert, format) => moment()
  .add(addData || 1, convert || 'days')
  .format(format || 'YYYY-MM-DD 23:59:59');

export const getAddDateTime = (addData, convert, format) => moment()
  .add(addData || 1, convert || 'days')
  .format(format || 'YYYY-MM-DD HH:mm');

export const getAddFieldDate = (field, addData, convert, format) => moment(field)
  .add(addData || 1, convert || 'days')
  .format(format || 'YYYY-MM-DD 23:59:59');

export const convertDateTimeFormat = (date, format = 'YYYY-MM-DD HH:mm:00') => {
  if (moment(date, format).isValid()) return moment(date).format(format);
  return null;
};

export const convertLocalDateTimeToUtc = (date, time, timezone) => {
  if (date && time) {
    const newDate = moment(date).format('YYYY-MM-DD');
    const utcDateTime = moment.tz(`${newDate} ${time}`, timezone).utc();
    return {
      date: moment(utcDateTime).format('YYYY-MM-DD'),
      time: moment(utcDateTime).format('HH:mm:ss'),
    };
  }
  return { date: '', time: '' };
};

export const getCurrentWeek = (date, subtract, type, format) => moment(date)
  .subtract(subtract, type)
  .format(format || 'YYYY-MM-DD');

export const getDifferenceStartAndEndTime = (startTime, endTime, format) => {
  const s = moment(startTime, 'HH:mm:ss');
  const e = moment(endTime, 'HH:mm:ss');
  return moment(e.diff(s)).format(format || 'HH:mm:ss');
};

export const currentYear = () => moment().year();

export const getDateFormat = () => 'YYYY-MM-DD HH:mm:ss';
