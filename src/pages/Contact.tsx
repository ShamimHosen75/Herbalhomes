import { useState, useEffect } from "react";
import { ArrowRight, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneInput from "@/components/PhoneInput";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [pageData, setPageData] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    supabase
      .from("page_contents")
      .select("*")
      .eq("page_key", "contact")
      .single()
      .then(({ data }) => {
        if (data) setPageData(data);
      });
  }, []);

  const c = pageData?.content || {};
  const title = pageData?.title || t("contact_page.title");
  const subtitle = pageData?.subtitle || t("contact_page.subtitle");
  const phone = c.phone || "+৮৮০১৭১২-৩৪৫৬৭৮";
  const phoneRaw = c.phone_raw || "+8801712345678";
  const email = c.email || "hello@herbalhomes.com";
  const address = c.address || "ঢাকা, বাংলাদেশ";
  const hours = c.hours || "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা";
  const whatsapp = c.whatsapp || "8801712345678";
  const facebook = c.facebook || "https://m.me/herbalhomes";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const contactItems = [
    { icon: Phone, label: t("contact_page.phone"), value: phone, href: `tel:${phoneRaw}` },
    { icon: Mail, label: t("contact_page.email"), value: email, href: `mailto:${email}` },
    { icon: MapPin, label: t("contact_page.address"), value: address, href: null },
    { icon: Clock, label: t("contact_page.hours"), value: hours, href: null },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">
                {t("contact_page.home")}
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">{t("contact_page.info_title")}</h2>
                <div className="space-y-5 mb-8">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-foreground mb-3">{t("contact_page.direct_contact")}</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[hsl(221,44%,41%)] text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="h-4 w-4" /> {t("contact_page.facebook_msg")}
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("contact_page.whatsapp")}
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">{t("contact_page.send_message")}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact_page.your_name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("contact_page.name_placeholder")}
                      className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("contact_page.email_label")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t("contact_page.email_placeholder")}
                        className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("contact_page.phone_label")}
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                        placeholder={t("contact_page.phone_placeholder")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact_page.message")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("contact_page.message_placeholder")}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t("contact_page.submit")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
