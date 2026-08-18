// Oscurece un color hex (#RRGGBB) un porcentaje dado — usado para el estado
// "pressed" de los Pressable, ya que no existen tokens *Dark en theme.ts.
export function darkenColor(hex: string, amount = 0.15): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const factor = 1 - amount;

  const toHex = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r * factor)}${toHex(g * factor)}${toHex(b * factor)}`;
}
