export const WHATSAPP_NUMBER = "5513997274710";
export const WHATSAPP_DISPLAY = "(13) 99727-4710";

export function WhatsAppButton({
  children = "Falar pelo WhatsApp",
  large = false,
}: {
  children?: string;
  large?: boolean;
}) {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-sm border border-gold/60 bg-gold/10 font-display tracking-widest text-gold uppercase transition-colors hover:bg-gold hover:text-primary-foreground ${
        large ? "px-8 py-4 text-sm sm:text-base" : "px-6 py-3 text-xs sm:text-sm"
      }`}
    >
      {children}
    </a>
  );
}
