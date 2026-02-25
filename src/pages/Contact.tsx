import { ArrowRight, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">হোম</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">যোগাযোগ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">যোগাযোগ করুন</h1>
            <p className="text-muted-foreground mt-2">আমরা সবসময় আপনার পাশে আছি</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">যোগাযোগের তথ্য</h2>
                <div className="space-y-5 mb-8">
                  {[
                    { icon: Phone, label: "ফোন", value: "০১৭১২-৩৪৫৬৭৮", href: "tel:+8801712345678" },
                    { icon: Mail, label: "ইমেইল", value: "hello@herbalhomes.com", href: "mailto:hello@herbalhomes.com" },
                    { icon: MapPin, label: "ঠিকানা", value: "ঢাকা, বাংলাদেশ", href: null },
                    { icon: Clock, label: "সময়সূচী", value: "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা", href: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-muted-foreground hover:text-primary">{item.value}</a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social buttons */}
                <h3 className="font-semibold text-foreground mb-3">সরাসরি যোগাযোগ</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://m.me/herbalhomes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[hsl(221,44%,41%)] text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="h-4 w-4" />
                    ফেসবুকে মেসেজ
                  </a>
                  <a
                    href="https://wa.me/8801712345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    হোয়াটসঅ্যাপ
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">মেসেজ পাঠান</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="নাম লিখুন"
                      className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">ইমেইল</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ইমেইল লিখুন"
                        className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">ফোন নম্বর</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="ফোন নম্বর"
                        className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">মেসেজ</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="আপনার মেসেজ লিখুন..."
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    মেসেজ পাঠান
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
