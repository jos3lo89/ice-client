/**
 * Formatea un valor a moneda Soles Peruanos (PEN).
 * Esta función es robusta y maneja diferentes tipos de entrada sin usar 'any'.
 * 
 * @param amount - El valor a formatear (pueden ser números, strings numéricos, null o undefined).
 * @returns El valor formateado como string localizado (e.g., "S/ 1,250.00").
 */
export const formatSoles = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === "") {
    return "S/ 0.00";
  }

  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericValue)) {
    return "S/ 0.00";
  }

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};
