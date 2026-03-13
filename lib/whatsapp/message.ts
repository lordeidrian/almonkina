import type { CartItem } from "@/types/domain";

export function buildOrderMessage(input: {
  businessName: string;
  template: string;
  items: CartItem[];
  subtotal: number;
  currencyCode: string;
}): string {
  const lines = input.items.map((item) => {
    const itemTotal = item.price * item.quantity;
    return `- ${item.name} x${item.quantity} = ${formatMoney(itemTotal, input.currencyCode)}`;
  });

  return [
    input.template,
    "",
    ...lines,
    "",
    `Subtotal: ${formatMoney(input.subtotal, input.currencyCode)}`,
    `Tienda: ${input.businessName}`
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

function formatMoney(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "PYG" ? 0 : 2
  }).format(value);
}
