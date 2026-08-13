import type { TFunction } from 'i18next';

// Los mensajes de validación de react-hook-form/Zod se guardan como claves
// de i18n (ver create-listing.schema.ts / edit-listing.schema.ts), pero
// también pueden venir con el texto default de Zod (ej. las reglas de
// `pricingSchema`, que vive en un paquete compartido sin i18n). Si la
// clave no existe, i18next devuelve el string tal cual, así que es seguro
// pasarle cualquier mensaje de error de campo.
//
// TFunction solo acepta las claves literales conocidas en compilación; acá
// necesitamos llamarlo con un string arbitrario en tiempo de ejecución, así
// que lo tratamos como una función genérica (key: string) => string.
export function translateFieldError(t: TFunction, message: string | undefined): string | undefined {
  if (message === undefined) return undefined;
  const translate = t as unknown as (key: string) => string;
  return translate(message);
}
