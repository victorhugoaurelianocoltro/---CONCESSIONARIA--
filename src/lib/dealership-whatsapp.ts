const FALLBACK_DEALERSHIP_WHATSAPP = "5511999999999";

export function dealershipWhatsAppLink(message: string): string | null {
  const configuredPhone = process.env.NEXT_PUBLIC_DEALERSHIP_WHATSAPP?.replace(/\D/g, "");
  const phone = configuredPhone || (process.env.NODE_ENV === "development" ? FALLBACK_DEALERSHIP_WHATSAPP : "");
  if (!phone || phone.length < 10) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function vehicleInterestMessage(vehicleName: string): string {
  return `Olá! Tenho interesse no ${vehicleName}. Gostaria de saber mais informações e condições.`;
}