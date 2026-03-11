import { Phone, MessageCircle } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  content?: any;
}

const ContactSection = ({ title, subtitle, content }: Props) => {
  const phone = content?.phone || "০১৭১২-৩৪৫৬৭৮";
  const phoneRaw = content?.phone_raw || "+8801712345678";
  const whatsapp = content?.whatsapp || "8801712345678";
  const facebook = content?.facebook || "https://m.me/herbalhomes";
  const ctaFacebook = content?.cta_facebook || "ফেসবুকে মেসেজ করুন";
  const ctaWhatsapp = content?.cta_whatsapp || "হোয়াটসঅ্যাপ";

  return (
    <section id="contact" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            {title || "প্রশ্ন আছে? আমাদের সাথে যোগাযোগ করুন"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8">
            {subtitle || "যেকোনো প্রোডাক্ট সম্পর্কে জানতে বা অর্ডার করতে আমাদের সাথে যোগাযোগ করুন। আমরা সবসময় আপনার পাশে আছি।"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a href={facebook} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[hsl(221,44%,41%)] text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              <MessageCircle className="h-4 w-4" />
              {ctaFacebook}
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {ctaWhatsapp}
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            অথবা সরাসরি কল করুন:{" "}
            <a href={`tel:${phoneRaw}`} className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
