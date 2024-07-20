import moment from 'moment-timezone';

export function dateFormat(dateTime: Date) {
  const thailandTime = moment(dateTime).tz('Asia/Bangkok');
  return thailandTime.format('DD/MM/YYYY HH:mm');
}

export function dateInputFormat(date: Date) {
  const thailandTime = moment(date).tz('Asia/Bangkok');
  return thailandTime.format('YYYY-MM-DD');
}