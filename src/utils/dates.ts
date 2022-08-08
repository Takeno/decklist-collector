import { format, formatDistance, parseJSON, subDays } from 'date-fns'


export function formatDate(date:string) {

  return format(
    parseJSON(date),
    'yyyy-MM-dd HH:mm'
  );

}