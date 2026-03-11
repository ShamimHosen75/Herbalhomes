import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "bn" as const, label: "বাংলা", flag: "🇧🇩" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent text-sm font-medium outline-none">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">{current.flag} {current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${language === lang.code ? "bg-accent font-semibold" : ""}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
