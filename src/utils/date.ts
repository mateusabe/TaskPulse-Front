import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// Converte data da API (UTC) para Date local
export function parseApiDate(date: string): Date {
  return dayjs(date).toDate()
}

// Formata data para exibição pt-BR
export function formatDate(date: string): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

// Verifica se SLA expirou
export function isExpired(dueAt: string): boolean {
  return dayjs(dueAt).isBefore(dayjs())
}
