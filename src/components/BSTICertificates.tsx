import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, X, ShieldCheck } from "lucide-react";

interface BSTICertificate {
  id: string;
  product_name: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

const BSTICertificates = () => {
  const [certificates, setCertificates] = useState<BSTICertificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<BSTICertificate | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("bsti_certificates")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      setCertificates((data as BSTICertificate[]) || []);
    };
    load();
  }, []);

  if (certificates.length === 0) return null;

  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <ShieldCheck className="h-4 w-4" />
              <span>{t("bsti.title")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              {t("bsti.title")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {t("bsti.description")}
            </p>
          </div>

          {/* Certificate Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
            {certificates.map((cert, index) => (
              <button
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="group relative bg-card border border-border/60 hover:border-primary/40 rounded-xl p-4 md:p-5 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Award className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                  {cert.product_name}
                </p>
                <span className="text-[11px] text-muted-foreground mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ক্লিক করে দেখুন
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Image Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{selectedCert.product_name}</h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedCert.image_url}
                alt={`BSTI Certificate - ${selectedCert.product_name}`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BSTICertificates;
