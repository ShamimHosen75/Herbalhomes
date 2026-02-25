import categorySoap from "@/assets/category-soap.jpg";
import categoryOils from "@/assets/category-oils.jpg";
import categorySkincare from "@/assets/category-skincare.jpg";
import categoryFood from "@/assets/category-food.jpg";

const categories = [
  { name: "জৈব সাবান", image: categorySoap, count: "২৪টি পণ্য" },
  { name: "প্রাকৃতিক তেল", image: categoryOils, count: "১৮টি পণ্য" },
  { name: "ভেষজ স্কিনকেয়ার", image: categorySkincare, count: "৩২টি পণ্য" },
  { name: "স্বাস্থ্যকর খাবার", image: categoryFood, count: "১৫টি পণ্য" },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium tracking-widest uppercase text-primary">ব্রাউজ করুন</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            ক্যাটাগরি অনুযায়ী কিনুন
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground">
                  {cat.name}
                </h3>
                <p className="text-sm text-primary-foreground/70 mt-0.5">{cat.count}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
