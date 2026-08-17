import { Link } from "@tanstack/react-router";

export type Crumb = { name: string; path?: string };

/**
 * Visible breadcrumb trail for deep public pages.
 * The matching BreadcrumbList JSON-LD is emitted from each route's head().
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {item.path && i < items.length - 1 ? (
              <Link to={item.path} className="hover:text-primary hover:underline underline-offset-4">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground/70">
                {item.name}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
