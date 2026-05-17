// Таблица обратной совместимости — для товаров с именованными цветами в старом формате
const LEGACY_COLOR_MAP: Record<string, string> = {
  Black: '#000000',
  Navy: '#1a2b5f',
  Grey: '#808080',
  White: '#ffffff',
  Charcoal: '#36454f',
  Brown: '#8b5a2b',
  Beige: '#f5f0e8',
  Olive: '#6b7c5c',
}

/** Возвращает hex-цвет. Если значение уже hex — возвращает как есть, иначе ищет в таблице legacy-имён. */
export function toHex(color: string): string {
  if (color.startsWith('#')) return color
  return LEGACY_COLOR_MAP[color] ?? '#cccccc'
}
