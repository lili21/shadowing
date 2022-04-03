const dateTimeFormater = new Intl.DateTimeFormat('default', {
  year: 'numeric', month: 'numeric', day: 'numeric',
  weekday: 'long',
  dayPeriod: 'short'
})

export function format(dateString) {
  const date = new Date(dateString);
  return dateTimeFormater.format(date);
}