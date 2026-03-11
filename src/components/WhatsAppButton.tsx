import { forwardRef } from "react";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = forwardRef<HTMLAnchorElement>((_props, ref) => {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsapp || "8801XXXXXXXXX";
  const message = "আসসালামু আলাইকুম! আমি আপনাদের পণ্য সম্পর্কে জানতে চাই।";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp এ মেসেজ করুন"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-whatsapp text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
});

WhatsAppButton.displayName = "WhatsAppButton";

export default WhatsAppButton;
