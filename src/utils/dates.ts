import {format, parseJSON} from 'date-fns';

export function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      year: undefined,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(parseJSON(date));
  } catch (e) {
    return format(parseJSON(date), 'yyyy-MM-dd HH:mm');
  }
}
