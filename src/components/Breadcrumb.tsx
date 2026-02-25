import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Crumb = { label: string; href?: string };

const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
    <Link to="/" className="hover:text-primary">হোম</Link>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        <ArrowRight className="h-3 w-3 shrink-0" />
        {item.href ? (
          <Link to={item.href} className="hover:text-primary">{item.label}</Link>
        ) : (
          <span className="text-foreground font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </div>
);

export default Breadcrumb;
