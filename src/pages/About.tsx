import { ArrowRight, Leaf, ShieldCheck, Recycle, Users, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/hero-banner.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-accent py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">হোম</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground font-medium">আমাদের সম্পর্কে</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">আমাদের সম্পর্কে</h1>
            <p className="text-muted-foreground mt-2">হার্বাল হোমসের গল্প</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1">
                <img
                  src={heroBanner}
                  alt="হার্বাল হোমস পণ্য"
                  className="rounded-2xl w-full h-auto object-cover shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  আমাদের যাত্রা
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  হার্বাল হোমস বাংলাদেশের একটি বিশ্বস্ত অর্গানিক ব্র্যান্ড যেখানে আমরা ১০০% প্রাকৃতিক ও রাসায়নিকমুক্ত পণ্য সরবরাহ করি। আমাদের লক্ষ্য হলো প্রতিটি পরিবারে বিশুদ্ধ ও স্বাস্থ্যকর পণ্য পৌঁছে দেওয়া।
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  আমরা বিশ্বাস করি যে প্রকৃতির কাছেই সেরা সমাধান লুকিয়ে আছে। তাই আমাদের প্রতিটি পণ্য প্রকৃতি থেকে সংগ্রহিত উপাদান দিয়ে তৈরি, কোনো ক্ষতিকর রাসায়নিক ছাড়াই।
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  আমাদের পণ্যগুলো শুধু আপনার জন্য নয়, পরিবেশের জন্যও নিরাপদ। আমরা পরিবেশবান্ধব প্যাকেজিং ব্যবহার করি এবং টেকসই উৎপাদন পদ্ধতি অনুসরণ করি।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10">
              আমাদের মূল্যবোধ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Leaf, title: "১০০% প্রাকৃতিক", desc: "সকল পণ্য প্রত্যয়িত জৈব উপাদান দিয়ে তৈরি।", bg: "bg-badge-green" },
                { icon: ShieldCheck, title: "নিরাপদ ও বিশ্বস্ত", desc: "প্যারাবেন, সালফেট ও কৃত্রিম রং মুক্ত।", bg: "bg-badge-blue" },
                { icon: Recycle, title: "পরিবেশবান্ধব", desc: "বায়োডিগ্রেডেবল ও রিসাইক্লেবল প্যাকেজিং।", bg: "bg-badge-orange" },
                { icon: Heart, title: "ভালোবাসায় তৈরি", desc: "প্রতিটি পণ্য যত্ন ও ভালোবাসায় হাতে তৈরি।", bg: "bg-badge-pink" },
                { icon: Users, title: "গ্রাহক সন্তুষ্টি", desc: "৫০,০০০+ সন্তুষ্ট গ্রাহকের বিশ্বাস।", bg: "bg-badge-green" },
                { icon: Award, title: "প্রিমিয়াম মান", desc: "সেরা মানের উপাদান ব্যবহারে আপোষহীন।", bg: "bg-badge-blue" },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow">
                  <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: "৫০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
                { number: "১০০+", label: "জৈব পণ্য" },
                { number: "৬৪", label: "জেলায় ডেলিভারি" },
                { number: "৪.৯/৫", label: "গড় রেটিং" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-accent">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
