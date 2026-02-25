import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section id="newsletter" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-leaf-light mb-5">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            সংযুক্ত থাকুন
          </h2>
          <p className="text-muted-foreground mb-8">
            এক্সক্লুসিভ অফার, স্বাস্থ্য টিপস এবং নতুন পণ্যের আপডেট সরাসরি আপনার ইনবক্সে পান।
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা লিখুন"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 px-5 rounded-xl"
            />
            <Button type="submit" size="lg" className="px-8 rounded-xl">
              সাবস্ক্রাইব
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            কোনো স্প্যাম নেই, যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন। আমরা আপনার গোপনীয়তাকে সম্মান করি।
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
