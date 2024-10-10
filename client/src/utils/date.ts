import { format, formatDistance } from 'date-fns'

export const readableDate = (date: Date) => format(date, 'dd/MM/yyyy')

export const readableDateTime = (date: Date) => format(date, 'dd/MM/yyyy HH:mm')

export const getReadableInterval = ({ start, end }: { start: Date; end: Date }) => {
  const diff = formatDistance(start, end)

  return diff
}
