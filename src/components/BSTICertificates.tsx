import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, X } from "lucide-react";

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
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {t("bsti.title")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            {certificates.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 md:py-4 px-4 md:px-6 rounded-lg text-sm md:text-base font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                {cert.product_name}
              </button>
            ))}
          </div>

          <p className="text-center text-sm md:text-base text-primary font-medium mt-6 max-w-3xl mx-auto leading-relaxed">
            {t("bsti.description")}
          </p>
        </div>
      </section>

      {/* Certificate Image Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-foreground">{selectedCert.product_name}</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
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
