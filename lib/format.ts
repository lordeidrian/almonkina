export function formatMoney(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "PYG" ? 0 : 2
  }).format(value);
}
