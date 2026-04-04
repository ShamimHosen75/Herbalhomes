import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

const countries: Country[] = [
  { code: "BD", name: "বাংলাদেশ", dial: "+880", flag: "🇧🇩" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullValue: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PhoneInput = ({ value, onChange, placeholder, className, required }: PhoneInputProps) => {
  const [selected, setSelected] = useState<Country>(countries[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Strip dial code from value for display
  const phoneOnly = value.startsWith(selected.dial)
    ? value.slice(selected.dial.length)
    : value;

  const handlePhoneChange = (phone: string) => {
    onChange(selected.dial + phone.replace(/^0+/, ""));
  };

  const handleCountrySelect = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch("");
    // Re-compose with new dial code
    const cleanPhone = phoneOnly.replace(/^0+/, "");
    onChange(country.dial + cleanPhone);
  };

  return (
    <div className={cn("flex", className)} ref={ref}>
      {/* Country selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 h-11 px-3 rounded-l-xl bg-muted border-0 text-sm text-foreground hover:bg-muted/80 transition-colors shrink-0"
        >
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="text-xs text-muted-foreground">{selected.dial}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full h-8 px-3 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left",
                    selected.code === country.code && "bg-accent font-medium"
                  )}
                >
                  <span className="text-lg leading-none">{country.flag}</span>
                  <span className="flex-1 text-foreground truncate">{country.name}</span>
                  <span className="text-xs text-muted-foreground">{country.dial}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-3">No results</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone input */}
      <input
        type="tel"
        required={required}
        value={phoneOnly}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-11 px-4 rounded-r-xl bg-muted border-0 border-l border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
};

export default PhoneInput;
