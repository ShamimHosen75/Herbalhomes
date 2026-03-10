import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "8801XXXXXXXXX"; // আপনার নম্বর দিন
const WHATSAPP_MESSAGE = "আসসালামু আলাইকুম! আমি আপনাদের পণ্য সম্পর্কে জানতে চাই।";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp এ মেসেজ করুন"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-whatsapp text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
